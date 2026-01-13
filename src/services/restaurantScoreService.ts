import { db, isFirebaseAvailable } from '@/lib/firebaseConfig';
import {
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

/**
 * 增加餐厅总积分
 */
export async function addRestaurantScore(
  restaurantId: string,
  points: number
): Promise<void> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    await setDoc(
      restaurantRef,
      {
        totalScore: increment(points),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error adding restaurant score:', error);
    throw new Error('Failed to add restaurant score');
  }
}

/**
 * 获取餐厅总积分
 */
export async function getRestaurantScore(restaurantId: string): Promise<number> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return 0;
  }

  try {
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    const restaurantSnap = await getDoc(restaurantRef);

    if (restaurantSnap.exists()) {
      const data = restaurantSnap.data();
      return data.totalScore || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting restaurant score:', error);
    return 0;
  }
}

/**
 * 获取奖励金池余额
 */
export async function getRewardPoolBalance(): Promise<number> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return 0;
  }

  try {
    const poolRef = doc(db, 'rewardPool', 'main');
    const poolSnap = await getDoc(poolRef);

    if (poolSnap.exists()) {
      const data = poolSnap.data();
      return data.balance || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting reward pool balance:', error);
    return 0;
  }
}
