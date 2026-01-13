import { initializeApp, getApps, FirebaseApp, FirebaseError } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// 验证环境变量
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 检查必要的环境变量（只检查关键字段）
const criticalVars = ['apiKey', 'authDomain', 'projectId'];
const missingCriticalVars = criticalVars.filter(
  (key) => {
    const value = requiredEnvVars[key as keyof typeof requiredEnvVars];
    return !value || value === 'your_api_key_here' || value.includes('your_');
  }
);

// 只在服务器端抛出错误，客户端只警告
if (missingCriticalVars.length > 0) {
  const errorMessage = `Missing critical Firebase environment variables: ${missingCriticalVars.join(', ')}. Please check your .env.local file.`;
  
  if (typeof window === 'undefined') {
    // 服务器端：抛出错误
    console.warn(errorMessage);
  } else {
    // 客户端：只警告，不阻止初始化
    console.warn(errorMessage);
  }
}

const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || '',
  authDomain: requiredEnvVars.authDomain || '',
  projectId: requiredEnvVars.projectId || '',
  storageBucket: requiredEnvVars.storageBucket || '',
  messagingSenderId: requiredEnvVars.messagingSenderId || '',
  appId: requiredEnvVars.appId || '',
};

// 验证配置完整性（只检查关键字段）
const isValidConfig = criticalVars.every(
  (key) => {
    const value = firebaseConfig[key as keyof typeof firebaseConfig];
    return value && value.trim().length > 0 && !value.includes('your_');
  }
);

// 初始化 Firebase（避免重复初始化）
let app: FirebaseApp | null = null;
let initializationError: Error | null = null;

// 只在配置有效时初始化
if (isValidConfig) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  } catch (error: any) {
    initializationError = error;
    // 在开发环境中，只警告不抛出错误
    if (typeof window !== 'undefined' || process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Firebase initialization error (应用将继续运行):', error.message);
    } else {
      console.error('Firebase initialization error:', error);
      // 只在生产环境的服务器端抛出错误
      if (typeof window === 'undefined') {
        throw error;
      }
    }
  }
} else {
  // 配置无效，但不阻止应用运行（完全自动化处理）
  initializationError = new Error('Firebase configuration is invalid or incomplete');
  
  // 在开发环境中，完全静默处理，不显示任何错误
  if (process.env.NODE_ENV === 'development') {
    // 开发环境：完全静默，允许应用正常运行
    console.info('ℹ️ Firebase 未配置，应用将以演示模式运行');
  } else {
    // 生产环境：只警告
    console.warn('⚠️ Firebase configuration is incomplete. Some features may not work.');
    console.warn('Required: NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  }
}

// 导出服务（带错误处理）
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (app && !initializationError) {
  try {
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error: any) {
    // 在开发环境中，完全静默处理错误
    if (process.env.NODE_ENV === 'development') {
      console.info('ℹ️ Firebase 服务未初始化，应用将以演示模式运行');
    } else {
      console.error('Error initializing Firebase services:', error);
      if (typeof window === 'undefined') {
        throw error;
      }
    }
  }
} else {
  // 配置缺失时的处理
  if (process.env.NODE_ENV === 'development') {
    // 开发环境：完全静默，允许应用正常运行
    console.info('ℹ️ Firebase 未配置，应用将以演示模式运行');
  } else if (typeof window !== 'undefined') {
    // 生产环境的客户端：只警告
    console.warn('⚠️ Firebase is not properly initialized. Some features may not work.');
  }
}

// 导出服务（如果初始化失败，导出 null 并在使用时检查）
export { db, auth, storage };

// 辅助函数：检查 Firebase 是否可用
export function isFirebaseAvailable(): boolean {
  // 检查关键服务是否已初始化
  if (!app) return false;
  
  // 在客户端，允许部分服务未初始化（开发环境）
  if (typeof window !== 'undefined') {
    // 至少需要 db 和 auth 可用
    return db !== null && auth !== null;
  }
  
  // 服务器端需要所有服务
  return db !== null && auth !== null && storage !== null;
}

// 获取 Firebase 初始化错误
export function getFirebaseError(): Error | null {
  return initializationError;
}

export default app;
