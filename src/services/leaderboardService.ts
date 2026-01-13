import { db, isFirebaseAvailable } from '@/lib/firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { Restaurant } from './restaurantService';

export interface LeaderboardEntry {
  restaurant: Restaurant;
  rank: number;
  value: number;
}

/**
 * 获取按总积分排序的餐厅排行榜（前 10 名）
 */
export async function getTopRestaurantsByScore(): Promise<LeaderboardEntry[]> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return [];
  }

  try {
    const restaurantsRef = collection(db, 'restaurants');
    const q = query(
      restaurantsRef,
      orderBy('totalScore', 'desc'),
      limit(10)
    );
    
    const querySnapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];

    querySnapshot.docs.forEach((doc, index) => {
      const restaurant = {
        id: doc.id,
        ...doc.data(),
      } as Restaurant;

      entries.push({
        restaurant,
        rank: index + 1,
        value: restaurant.totalScore || 0,
      });
    });

    return entries;
  } catch (error) {
    console.error('Error getting top restaurants by score:', error);
    return [];
  }
}

/**
 * 获取按奖励金池总量排序的餐厅排行榜（前 10 名）
 * 注意：这里需要计算每个餐厅从奖励金池获得的总额
 * 由于奖励金池是共享的，我们需要根据餐厅的支付记录来计算
 */
export async function getTopRestaurantsByPoolContribution(): Promise<LeaderboardEntry[]> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return [];
  }

  try {
    // 获取所有支付记录，按餐厅分组计算总额
    const paymentsRef = collection(db, 'payments');
    const paymentsSnapshot = await getDocs(paymentsRef);

    const restaurantPoolAmounts: Record<string, number> = {};

    paymentsSnapshot.docs.forEach((doc) => {
      const payment = doc.data();
      const restaurantId = payment.restaurantId;
      const poolAmount = payment.poolAmount || 0;

      if (restaurantId) {
        if (!restaurantPoolAmounts[restaurantId]) {
          restaurantPoolAmounts[restaurantId] = 0;
        }
        restaurantPoolAmounts[restaurantId] += poolAmount;
      }
    });

    // 转换为数组并排序
    const entries = Object.entries(restaurantPoolAmounts)
      .map(([restaurantId, amount]) => ({ restaurantId, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);

    // 获取餐厅详细信息
    const leaderboardEntries: LeaderboardEntry[] = [];
    for (let i = 0; i < entries.length; i++) {
      const { restaurantId, amount } = entries[i];
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      const restaurantSnap = await getDoc(restaurantRef);

      if (restaurantSnap.exists()) {
        const restaurant = {
          id: restaurantSnap.id,
          ...restaurantSnap.data(),
        } as Restaurant;

        leaderboardEntries.push({
          restaurant,
          rank: i + 1,
          value: amount,
        });
      }
    }

    return leaderboardEntries;
  } catch (error) {
    console.error('Error getting top restaurants by pool contribution:', error);
    return [];
  }
}
