import { db, isFirebaseAvailable } from '@/lib/firebaseConfig';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { recordActionAndAddScore, hasUserPaidIn24Hours } from './actionService';

export interface PaymentRecord {
  id?: string;
  userId: string;
  restaurantId: string;
  amount: number; // 总金额
  restaurantAmount: number; // 95% 转给餐厅
  poolAmount: number; // 5% 转给奖励金池
  paymentId: string; // Pi Network 支付 ID
  status: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
  completedAt?: Timestamp;
}

/**
 * 创建 Pi 支付
 */
export async function createPiPayment(
  userId: string,
  restaurantId: string,
  amount: number
): Promise<any> {
  if (!window.Pi) {
    throw new Error('Pi SDK not loaded');
  }

  // 检查 24 小时内是否支付过
  const hasPaid = await hasUserPaidIn24Hours(userId);
  if (hasPaid) {
    throw new Error('You can only make one payment every 24 hours');
  }

  // 计算分配金额
  const restaurantAmount = amount * 0.95;
  const poolAmount = amount * 0.05;

  // 创建支付记录
  const paymentRef = doc(collection(db, 'payments'));
  const paymentRecord: Omit<PaymentRecord, 'id' | 'createdAt'> = {
    userId,
    restaurantId,
    amount,
    restaurantAmount,
    poolAmount,
    paymentId: '',
    status: 'pending',
  };

  await setDoc(paymentRef, {
    ...paymentRecord,
    createdAt: serverTimestamp(),
  });

  // 调用 Pi.createPayment
  const paymentData = {
    amount,
    memo: `Payment for restaurant ${restaurantId}`,
    metadata: {
      userId,
      restaurantId,
      paymentRecordId: paymentRef.id,
    },
  };

  const callbacks = {
    onReadyForServerApproval: async (paymentId: string) => {
      // 更新支付记录
      await setDoc(
        paymentRef,
        {
          paymentId,
          status: 'pending',
        },
        { merge: true }
      );
      
      // 这里应该调用后端 API 来批准支付
      // 由于是前端实现，我们假设支付会自动完成
    },
    onReadyForServerCompletion: async (paymentId: string, txid: string) => {
      // 支付完成，更新记录并分配资金
      await completePayment(paymentRef.id, paymentId, txid);
    },
    onCancel: async (paymentId: string) => {
      // 支付取消
      await setDoc(
        paymentRef,
        { status: 'failed' },
        { merge: true }
      );
    },
    onError: async (error: any, payment: any) => {
      // 支付错误
      console.error('Payment error:', error);
      await setDoc(
        paymentRef,
        { status: 'failed' },
        { merge: true }
      );
    },
  };

  return window.Pi.createPayment(paymentData, callbacks);
}

/**
 * 完成支付并分配资金
 */
async function completePayment(
  paymentRecordId: string,
  paymentId: string,
  txid: string
): Promise<void> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const paymentRef = doc(db, 'payments', paymentRecordId);
    const paymentSnap = await getDoc(paymentRef);

    if (!paymentSnap.exists()) {
      throw new Error('Payment record not found');
    }

    const paymentData = paymentSnap.data() as PaymentRecord;

    // 更新支付记录
    await setDoc(
      paymentRef,
      {
        paymentId,
        status: 'completed',
        completedAt: serverTimestamp(),
      },
      { merge: true }
    );

    // 分配资金给餐厅（95%）
    // 这里需要更新餐厅的余额字段
    const restaurantRef = doc(db, 'restaurants', paymentData.restaurantId);
    await setDoc(
      restaurantRef,
      {
        balance: increment(paymentData.restaurantAmount),
      },
      { merge: true }
    );

    // 分配资金给奖励金池（5%）
    const poolRef = doc(db, 'rewardPool', 'main');
    const poolSnap = await getDoc(poolRef);
    if (poolSnap.exists()) {
      await setDoc(
        poolRef,
        {
          balance: increment(paymentData.poolAmount),
        },
        { merge: true }
      );
    } else {
      await setDoc(poolRef, {
        balance: paymentData.poolAmount,
        updatedAt: serverTimestamp(),
      });
    }

    // 给用户加分（+2，24 小时限制已在 createPiPayment 中检查）
    await recordActionAndAddScore(
      paymentData.userId,
      paymentData.restaurantId,
      'payment',
      2
    );
  } catch (error) {
    console.error('Error completing payment:', error);
    throw new Error('Failed to complete payment');
  }
}

/**
 * 获取用户支付历史
 */
export async function getUserPayments(userId: string): Promise<PaymentRecord[]> {
  if (!isFirebaseAvailable() || !db) {
    throw new Error('Firebase is not properly initialized. Please check your environment variables.');
  }

  try {
    const paymentsRef = collection(db, 'payments');
    const q = query(paymentsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PaymentRecord[];
  } catch (error) {
    console.error('Error getting user payments:', error);
    throw new Error('Failed to get payments');
  }
}
