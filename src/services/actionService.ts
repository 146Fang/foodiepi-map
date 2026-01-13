import { db, isFirebaseAvailable } from '@/lib/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { addScore } from './scoreService';
import { addRestaurantScore } from './restaurantScoreService';

export type ActionType = 'recommend' | 'like' | 'rating' | 'comment' | 'tip' | 'payment';

export interface UserAction {
  id?: string;
  userId: string;
  restaurantId: string;
  actionType: ActionType;
  createdAt: Timestamp;
}

/**
 * 检查用户是否已经对某个餐厅执行过某个操作（防弊）
 */
export async function hasUserActioned(
  userId: string,
  restaurantId: string,
  actionType: ActionType
): Promise<boolean> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return false;
  }

  try {
    const actionsRef = collection(db, 'userActions');
    const q = query(
      actionsRef,
      where('userId', '==', userId),
      where('restaurantId', '==', restaurantId),
      where('actionType', '==', actionType)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user action:', error);
    return false;
  }
}

/**
 * 记录用户操作并加分（带防弊检查）
 */
export async function recordActionAndAddScore(
  userId: string,
  restaurantId: string,
  actionType: ActionType,
  points: number
): Promise<boolean> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    // 检查是否已经执行过此操作
    const hasActioned = await hasUserActioned(userId, restaurantId, actionType);
    if (hasActioned) {
      return false; // 已经执行过，不重复加分
    }

    // 记录操作
    const actionRef = doc(collection(db, 'userActions'));
    await setDoc(actionRef, {
      userId,
      restaurantId,
      actionType,
      createdAt: serverTimestamp(),
    });

    // 给用户加分
    await addScore(userId, points);
    
    // 给餐厅加分
    await addRestaurantScore(restaurantId, points);
    
    return true;
  } catch (error) {
    console.error('Error recording action:', error);
    throw new Error('Failed to record action');
  }
}

/**
 * 检查用户是否在 24 小时内支付过（用于支付加分限制）
 */
export async function hasUserPaidIn24Hours(userId: string): Promise<boolean> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return false;
  }

  try {
    const actionsRef = collection(db, 'userActions');
    const q = query(
      actionsRef,
      where('userId', '==', userId),
      where('actionType', '==', 'payment')
    );
    
    const querySnapshot = await getDocs(q);
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const createdAt = data.createdAt?.toMillis() || 0;
      if (createdAt > twentyFourHoursAgo) {
        return true; // 24 小时内支付过
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error checking payment history:', error);
    return false;
  }
}
