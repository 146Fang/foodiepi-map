import { db, isFirebaseAvailable } from '@/lib/firebaseConfig';
import { doc, getDoc, setDoc, serverTimestamp, increment, Timestamp } from 'firebase/firestore';

export interface UserScore {
  uid: string;
  score: number;
  lastUpdatedAt: Timestamp;
}

/**
 * 给用户增加分数
 * @param uid 用户 UID
 * @param points 增加的分数（默认 1）
 */
export async function addScore(uid: string, points: number = 1): Promise<void> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    if (!uid || typeof uid !== 'string' || uid.trim().length === 0) {
      throw new Error('Invalid UID');
    }

    const scoreRef = doc(db, 'scores', uid);
    const scoreSnap = await getDoc(scoreRef);

    if (scoreSnap.exists()) {
      // 更新现有分数
      await setDoc(
        scoreRef,
        {
          score: increment(points),
          lastUpdatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // 创建新记录
      await setDoc(scoreRef, {
        uid,
        score: points,
        lastUpdatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error adding score:', error);
    throw new Error('Failed to add score');
  }
}

/**
 * 获取用户分数
 */
export async function getUserScore(uid: string): Promise<number> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return 0;
  }

  try {
    const scoreRef = doc(db, 'scores', uid);
    const scoreSnap = await getDoc(scoreRef);

    if (scoreSnap.exists()) {
      const data = scoreSnap.data();
      return data.score || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error getting user score:', error);
    return 0;
  }
}
