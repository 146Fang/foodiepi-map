'use client';

import { useEffect, useState } from 'react';
import { getFirebaseError, isFirebaseAvailable } from '@/lib/firebaseConfig';

interface FirebaseErrorBoundaryProps {
  children: React.ReactNode;
}

export function FirebaseErrorBoundary({ children }: FirebaseErrorBoundaryProps) {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 只在客户端检查 Firebase 是否可用
    if (typeof window !== 'undefined') {
      // 检查是否用户选择跳过配置（仅开发环境）
      const skipConfig = sessionStorage.getItem('skip_firebase_config') === 'true';
      if (skipConfig) {
        setIsChecking(false);
        return; // 用户选择跳过，不显示错误
      }

      // 延迟检查，确保环境变量已加载
      const checkFirebase = () => {
        // 检查是否有关键环境变量缺失
        const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        
        // 检查关键变量是否存在且有效
        const hasApiKey = apiKey && 
                         apiKey !== 'your_api_key_here' &&
                         !apiKey.includes('your_') &&
                         apiKey.trim().length > 0 &&
                         apiKey.length > 20;
        
        const hasAuthDomain = authDomain && 
                             authDomain !== 'your_project_id.firebaseapp.com' &&
                             !authDomain.includes('your_') &&
                             authDomain.includes('.firebaseapp.com');
        
        const hasProjectId = projectId && 
                            projectId !== 'your_project_id' &&
                            !projectId.includes('your_') &&
                            projectId.trim().length > 0;
        
        // 在开发环境中，如果配置缺失，自动进入演示模式（不显示错误）
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        if (isDevelopment && (!hasApiKey || !hasAuthDomain || !hasProjectId)) {
          // 开发环境：自动跳过配置检查，允许应用运行
          console.warn('⚠️ Firebase 配置缺失，应用将以演示模式运行（功能受限）');
          console.warn('💡 提示：要启用完整功能，请创建 .env.local 文件并配置 Firebase');
          sessionStorage.setItem('skip_firebase_config', 'true');
          setIsChecking(false);
          return;
        }
        
        // 生产环境或配置存在时，检查 Firebase 是否可用
        if (hasApiKey && hasAuthDomain && hasProjectId) {
          if (!isFirebaseAvailable()) {
            const firebaseError = getFirebaseError();
            // 只有在真正的错误时才显示（不是配置缺失）
            if (firebaseError && 
                !firebaseError.message.includes('incomplete') &&
                !firebaseError.message.includes('invalid or incomplete')) {
              // 这是真正的错误，但在开发环境中仍然允许继续
              if (isDevelopment) {
                console.warn('⚠️ Firebase 初始化错误，但应用将继续运行:', firebaseError.message);
                sessionStorage.setItem('skip_firebase_config', 'true');
              }
            }
          }
        }
        
        setIsChecking(false);
      };
      
      // 延迟检查，给环境变量加载时间
      const timeout = setTimeout(checkFirebase, 1500);
      
      return () => clearTimeout(timeout);
    } else {
      setIsChecking(false);
    }
  }, []);

  // 显示加载状态（仅在检查时）
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // 始终渲染子组件，让应用正常运行
  // 在开发环境中，即使配置缺失也允许应用运行
  return <>{children}</>;
}
