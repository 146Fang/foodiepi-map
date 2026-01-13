import { db, isFirebaseAvailable } from '@/lib/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { getRestaurantScore } from './restaurantScoreService';
import { getRewardPoolBalance } from './restaurantScoreService';

/**
 * 获取用户在特定餐厅的个人积分
 */
export async function getUserRestaurantScore(
  userId: string,
  restaurantId: string
): Promise<number> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return 0;
  }

  try {
    const actionsRef = collection(db, 'userActions');
    const q = query(
      actionsRef,
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId)
    );
    
    const querySnapshot = await getDocs(q);
    let totalScore = 0;

    // 计算该用户在该餐厅的所有操作积分
    querySnapshot.docs.forEach((doc) => {
      const actionType = doc.data().actionType;
      switch (actionType) {
        case 'recommend':
        case 'like':
        case 'rating':
        case 'comment':
        case 'tip':
          totalScore += 1;
          break;
        case 'payment':
          totalScore += 2;
          break;
      }
    });

    return totalScore;
  } catch (error) {
    console.error('Error getting user restaurant score:', error);
    return 0;
  }
}

/**
 * 计算用户在特定餐厅的预估奖励金额
 * 公式：(玩家在该餐厅个人积分 / 该餐厅总积分) * (奖励金池 * 90%)
 */
export async function calculateUserReward(
  userId: string,
  restaurantId: string
): Promise<number> {
  try {
    const [userScore, restaurantScore, poolBalance] = await Promise.all([
      getUserRestaurantScore(userId, restaurantId),
      getRestaurantScore(restaurantId),
      getRewardPoolBalance(),
    ]);

    if (restaurantScore === 0) {
      return 0;
    }

    // 计算奖励：(用户积分 / 餐厅总积分) * (奖励金池 * 90%)
    const reward = (userScore / restaurantScore) * (poolBalance * 0.9);
    return reward;
  } catch (error) {
    console.error('Error calculating user reward:', error);
    return 0;
  }
}

/**
 * 计算用户在所有餐厅的总预估奖励
 */
export async function calculateUserTotalReward(userId: string): Promise<number> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return 0;
  }

  try {
    // 获取用户操作过的所有餐厅
    const actionsRef = collection(db, 'userActions');
    const q = query(actionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const restaurantIds = new Set<string>();
    querySnapshot.docs.forEach((doc) => {
      const restaurantId = doc.data().restaurantId;
      if (restaurantId) {
        restaurantIds.add(restaurantId);
      }
    });

    // 计算每个餐厅的奖励并累加
    let totalReward = 0;
    for (const restaurantId of restaurantIds) {
      const reward = await calculateUserReward(userId, restaurantId);
      totalReward += reward;
    }

    return totalReward;
  } catch (error) {
    console.error('Error calculating total reward:', error);
    return 0;
  }
}

/**
 * 检查是否在奖励分配时间范围内（1/1 至 12/31）
 */
export function isWithinRewardPeriod(date: Date = new Date()): boolean {
  const year = date.getFullYear();
  const startDate = new Date(year, 0, 1); // 1月1日
  const endDate = new Date(year, 11, 31, 23, 59, 59); // 12月31日

  return date >= startDate && date <= endDate;
}

/**
 * 获取当前奖励年度的开始和结束日期
 */
export function getRewardYearRange(): { start: Date; end: Date } {
  const now = new Date();
  const year = now.getFullYear();
  return {
    start: new Date(year, 0, 1),
    end: new Date(year, 11, 31, 23, 59, 59),
  };
}

/**
 * 分配奖励（实际执行分配逻辑）
 * 注意：这应该在服务器端或通过 Cloud Function 执行
 */
export async function distributeRewards(): Promise<void> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const poolBalance = await getRewardPoolBalance();
    const distributionAmount = poolBalance * 0.9; // 90% 用于分配

    // 获取所有餐厅
    const restaurantsRef = collection(db, 'restaurants');
    const restaurantsSnapshot = await getDocs(restaurantsRef);

    // 获取所有用户操作
    const actionsRef = collection(db, 'userActions');
    const actionsSnapshot = await getDocs(actionsRef);

    // 计算每个用户在每个餐厅的积分
    const userRestaurantScores: Record<string, Record<string, number>> = {};
    const restaurantTotalScores: Record<string, number> = {};

    actionsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const userId = data.userId;
      const restaurantId = data.restaurantId;
      const actionType = data.actionType;

      if (!userRestaurantScores[userId]) {
        userRestaurantScores[userId] = {};
      }
      if (!userRestaurantScores[userId][restaurantId]) {
        userRestaurantScores[userId][restaurantId] = 0;
      }
      if (!restaurantTotalScores[restaurantId]) {
        restaurantTotalScores[restaurantId] = 0;
      }

      const points = actionType === 'payment' ? 2 : 1;
      userRestaurantScores[userId][restaurantId] += points;
      restaurantTotalScores[restaurantId] += points;
    });

    // 计算并分配奖励
    const rewards: Array<{ userId: string; amount: number }> = [];

    for (const userId in userRestaurantScores) {
      let userTotalReward = 0;

      for (const restaurantId in userRestaurantScores[userId]) {
        const userScore = userRestaurantScores[userId][restaurantId];
        const restaurantScore = restaurantTotalScores[restaurantId];

        if (restaurantScore > 0) {
          const reward = (userScore / restaurantScore) * distributionAmount;
          userTotalReward += reward;
        }
      }

      if (userTotalReward > 0) {
        rewards.push({ userId, amount: userTotalReward });
      }
    }

    // 这里应该将奖励分配给用户（更新用户的 Pi 余额）
    // 由于是前端实现，这里只返回计算结果
    // 实际分配应该在服务器端执行
    console.log('Rewards to distribute:', rewards);
  } catch (error) {
    console.error('Error distributing rewards:', error);
    throw new Error('Failed to distribute rewards');
  }
}
