import { db, storage, isFirebaseAvailable } from '@/lib/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export interface Restaurant {
  id?: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  photos: string[]; // 照片 URL 数组
  dishes: string[]; // 餐饮品相数组
  createdBy: string; // Pi Network UID
  totalScore: number; // 餐厅总积分（来自所有玩家）
  balance: number; // 餐厅钱包余额
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 创建新餐厅
 */
export async function createRestaurant(
  restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const restaurantRef = doc(collection(db, 'restaurants'));
    
    await setDoc(restaurantRef, {
      ...restaurantData,
      totalScore: 0,
      balance: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return restaurantRef.id;
  } catch (error) {
    console.error('Error creating restaurant:', error);
    throw new Error('Failed to create restaurant');
  }
}

/**
 * 更新餐厅信息
 */
export async function updateRestaurant(
  restaurantId: string,
  updates: Partial<Restaurant>
): Promise<void> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const restaurantRef = doc(db, 'restaurants', restaurantId);
    await setDoc(
      restaurantRef,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw new Error('Failed to update restaurant');
  }
}

/**
 * 上传餐厅照片
 */
export async function uploadRestaurantPhoto(
  file: File,
  restaurantId: string
): Promise<string> {
  if (!isFirebaseAvailable() || !storage) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const storageRef = ref(storage, `restaurants/${restaurantId}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw new Error('Failed to upload photo');
  }
}

/**
 * 获取所有餐厅
 */
export async function getAllRestaurants(): Promise<Restaurant[]> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return [];
  }

  try {
    const q = query(collection(db, 'restaurants'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Restaurant[];
  } catch (error) {
    console.error('Error getting restaurants:', error);
    throw new Error('Failed to get restaurants');
  }
}

/**
 * 根据 ID 获取餐厅
 */
export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  if (!isFirebaseAvailable() || !db) {
    console.error('Firebase is not available');
    return null;
  }

  try {
    const restaurantRef = doc(db, 'restaurants', id);
    const restaurantSnap = await getDoc(restaurantRef);

    if (restaurantSnap.exists()) {
      return {
        id: restaurantSnap.id,
        ...restaurantSnap.data(),
      } as Restaurant;
    }
    return null;
  } catch (error) {
    console.error('Error getting restaurant:', error);
    throw new Error('Failed to get restaurant');
  }
}

/**
 * 搜索餐厅（按名称或地址）
 */
export async function searchRestaurants(searchTerm: string): Promise<Restaurant[]> {
  try {
    const allRestaurants = await getAllRestaurants();
    const lowerSearchTerm = searchTerm.toLowerCase();

    return allRestaurants.filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(lowerSearchTerm) ||
        restaurant.address.toLowerCase().includes(lowerSearchTerm)
    );
  } catch (error) {
    console.error('Error searching restaurants:', error);
    throw new Error('Failed to search restaurants');
  }
}
