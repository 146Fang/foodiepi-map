'use client';

import { useEffect, useState } from 'react';
import { usePiAuth } from '@/hooks/usePiAuth';
import { Loader2 } from 'lucide-react';

interface PiAuthProviderProps {
  children: React.ReactNode;
  autoAuth?: boolean;
}

/**
 * Pi Network 认证提供者组件
 * 自动处理用户认证流程
 */
export function PiAuthProvider({
  children,
  autoAuth = true,
}: PiAuthProviderProps) {
  const { user, isLoading, error, authenticate } = usePiAuth();

  useEffect(() => {
    // 如果启用自动认证且用户未登录，则自动弹出授权
    // 但只在 Pi SDK 可用时执行
    if (autoAuth && !isLoading && !user && !error && window.Pi) {
      authenticate();
    }
  }, [autoAuth, isLoading, user, error, authenticate]);

  // 显示加载状态（最多显示 5 秒，然后自动进入演示模式）
  const [showLoading, setShowLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      // 如果超时且 Pi SDK 未加载，自动进入演示模式
      if (!window.Pi && !user) {
        console.info('ℹ️ Pi SDK load timeout, continuing in demo mode');
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [user]);

  if (isLoading && showLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/80">Loading Pi Network SDK...</p>
          <p className="text-white/60 text-sm mt-2">If this takes too long, the app will continue in demo mode</p>
        </div>
      </div>
    );
  }

  // 如果 Pi SDK 不可用，允许应用继续运行（演示模式）
  if (!window.Pi && !user && !error) {
    console.info('ℹ️ Pi SDK not available, running in demo mode');
  }

  // 显示错误状态（仅在真正的错误时）
  if (error && !user && window.Pi) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">
              Authentication Error
            </h3>
            <p className="text-white/80 mb-4">{error}</p>
            <button
              onClick={() => authenticate()}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 用户已认证或演示模式，显示内容
  return <>{children}</>;
}
