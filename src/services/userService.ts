import { db, isFirebaseAvailable } from '@/lib/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';

import { storage } from '@/lib/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface UserData {
  uid: string;
  username: string;
  avatarUrl?: string;
  piBalance: number; // Pi 币余额（来自打赏）
  lastLoginAt: Timestamp;
  createdAt?: Timestamp;
}

/**
 * 保存或更新用户信息到 Firebase
 * @param uid Pi Network 用户 UID（钱包地址）
 * @param username Pi Network 用户名
 * @throws {Error} 如果参数无效或保存失败
 */
export async function saveOrUpdateUser(
  uid: string,
  username: string
): Promise<void> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  // 输入验证（Web3 安全规范）
  if (!uid || typeof uid !== 'string' || uid.trim().length === 0) {
    throw new Error('Invalid UID: UID must be a non-empty string');
  }

  if (!username || typeof username !== 'string' || username.trim().length === 0) {
    throw new Error('Invalid username: Username must be a non-empty string');
  }

  // 清理输入（防止注入攻击）
  const cleanUid = uid.trim();
  const cleanUsername = username.trim();

  try {
    const userRef = doc(db, 'users', cleanUid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // 用户已存在，更新最后登录时间和用户名（用户名可能已更改）
      await setDoc(
        userRef,
        {
          username: cleanUsername,
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );
    } else {
      // 新用户，创建记录
      await setDoc(userRef, {
        uid: cleanUid,
        username: cleanUsername,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error saving user to Firebase:', error);
    throw new Error(
      `Failed to save user data: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * 获取用户信息
 * @param uid 用户 UID
 */
export async function getUser(uid: string): Promise<UserData | null> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return null;
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        piBalance: data.piBalance || 0,
      } as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user from Firebase:', error);
    throw error;
  }
}

/**
 * 上传用户头像
 */
export async function uploadUserAvatar(uid: string, file: File): Promise<string> {
  if (!isFirebaseAvailable() || !storage || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const storageRef = ref(storage, `avatars/${uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    // 更新用户记录
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { avatarUrl: downloadURL }, { merge: true });
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error('Failed to upload avatar');
  }
}

/**
 * 更新用户 Pi 币余额
 */
export async function updateUserPiBalance(uid: string, amount: number): Promise<void> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const currentBalance = userSnap.data().piBalance || 0;
      await setDoc(
        userRef,
        { piBalance: currentBalance + amount },
        { merge: true }
      );
    } else {
      await setDoc(userRef, { piBalance: amount }, { merge: true });
    }
  } catch (error) {
    console.error('Error updating Pi balance:', error);
    throw new Error('Failed to update Pi balance');
  }
}
