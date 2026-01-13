/**
 * Pi Network SDK 加载器
 * 动态加载 Pi SDK 脚本，支持超时和降级处理
 */
export async function loadPiSDK(): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    if (window.Pi) {
      resolve();
      return;
    }

    // 检测是否在 Pi Browser 环境中
    const isPiBrowser = typeof window !== 'undefined' && 
                        (window.navigator.userAgent.includes('PiBrowser') || 
                         window.location.hostname.includes('minepi.com'));

    // 如果不在 Pi Browser 中，设置超时并允许降级
    const timeout = isPiBrowser ? 30000 : 5000; // Pi Browser: 30秒，普通浏览器: 5秒
    let timeoutId: NodeJS.Timeout;

    // 创建 script 标签
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    
    script.onload = () => {
      clearTimeout(timeoutId);
      // 初始化 Pi SDK
      if (window.Pi) {
        try {
          window.Pi.init({
            version: '2.0',
            sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === 'true',
          });
          resolve();
        } catch (error) {
          console.warn('Pi SDK init failed, continuing in demo mode:', error);
          // 即使初始化失败，也允许继续（演示模式）
          resolve();
        }
      } else {
        // SDK 加载但未定义，允许降级
        console.warn('Pi SDK loaded but not available, continuing in demo mode');
        resolve();
      }
    };
    
    script.onerror = () => {
      clearTimeout(timeoutId);
      // 在非 Pi Browser 环境中，允许降级运行
      if (!isPiBrowser) {
        console.info('ℹ️ Pi SDK not available (not in Pi Browser), app will run in demo mode');
        resolve(); // 允许继续运行
      } else {
        reject(new Error('Failed to load Pi SDK script'));
      }
    };

    // 设置超时
    timeoutId = setTimeout(() => {
      // 移除脚本标签
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      
      // 在非 Pi Browser 环境中，允许降级
      if (!isPiBrowser) {
        console.info('ℹ️ Pi SDK load timeout (not in Pi Browser), app will run in demo mode');
        resolve(); // 允许继续运行
      } else {
        reject(new Error('Pi SDK load timeout'));
      }
    }, timeout);

    document.head.appendChild(script);
  });
}
