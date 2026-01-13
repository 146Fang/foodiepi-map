'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadPiSDK } from '@/lib/pi-sdk-loader';
import { saveOrUpdateUser } from '@/services/userService';

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
}

interface UsePiAuthReturn {
  user: PiUser | null;
  isLoading: boolean;
  error: string | null;
  authenticate: () => Promise<void>;
  logout: () => void;
}

/**
 * Pi Network 认证 Hook
 */
export function usePiAuth(): UsePiAuthReturn {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // 加载 Pi SDK
  useEffect(() => {
    loadPiSDK()
      .then(() => {
        setSdkLoaded(true);
        setIsLoading(false);
        // 如果 SDK 未加载但允许降级，清除错误
        if (!window.Pi) {
          console.info('ℹ️ Running in demo mode (Pi SDK not available)');
        }
      })
      .catch((err) => {
        console.warn('Pi SDK load failed, continuing in demo mode:', err);
        // 即使失败也允许继续运行（演示模式）
        setSdkLoaded(false);
        setIsLoading(false);
        setError(null); // 清除错误，允许应用继续运行
      });
  }, []);

  // 认证函数
  const authenticate = useCallback(async () => {
    if (!sdkLoaded || !window.Pi) {
      setError('Pi SDK not loaded');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // 调用 Pi.authenticate
      const authResult = await window.Pi.authenticate(
        ['username', 'payments'],
        (payment: any) => {
          // 处理未完成的支付（如果需要）
          console.log('Incomplete payment found:', payment);
        }
      );

      if (authResult && authResult.user) {
        const { uid, username } = authResult.user;
        const accessToken = authResult.accessToken;

        // 保存用户信息到 Firebase
        await saveOrUpdateUser(uid, username);

        // 更新本地状态
        setUser({
          uid,
          username,
          accessToken,
        });
      }
    } catch (err: any) {
      console.error('Pi authentication error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  }, [sdkLoaded]);

  // 登出函数
  const logout = useCallback(() => {
    setUser(null);
    // 清除本地存储（如果需要）
    localStorage.removeItem('pi_user');
  }, []);

  return {
    user,
    isLoading,
    error,
    authenticate,
    logout,
  };
}
