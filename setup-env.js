#!/usr/bin/env node

/**
 * 快速设置 .env.local 文件的辅助脚本
 * 使用方法: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupEnv() {
  console.log('\n🔥 Firebase 环境变量设置助手\n');
  console.log('这个脚本将帮助您创建 .env.local 文件。');
  console.log('如果您还没有 Firebase 项目，请先访问: https://console.firebase.google.com/\n');

  const envPath = path.join(process.cwd(), '.env.local');
  const examplePath = path.join(process.cwd(), 'env.example.txt');

  // 检查是否已存在 .env.local
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local 文件已存在。是否覆盖？(y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('已取消。');
      rl.close();
      return;
    }
  }

  console.log('\n请从 Firebase Console 获取以下配置值：');
  console.log('1. 访问 https://console.firebase.google.com/');
  console.log('2. 选择或创建项目');
  console.log('3. 点击 ⚙️ 设置 → 项目设置');
  console.log('4. 滚动到"您的应用"，点击 Web 图标 </>');
  console.log('5. 复制配置值\n');

  const apiKey = await question('NEXT_PUBLIC_FIREBASE_API_KEY: ');
  const authDomain = await question('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ');
  const projectId = await question('NEXT_PUBLIC_FIREBASE_PROJECT_ID: ');
  const storageBucket = await question('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET (可选，按 Enter 跳过): ') || `${projectId}.appspot.com`;
  const messagingSenderId = await question('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID (可选，按 Enter 跳过): ') || '';
  const appId = await question('NEXT_PUBLIC_FIREBASE_APP_ID (可选，按 Enter 跳过): ') || '';

  const piSandbox = await question('NEXT_PUBLIC_PI_SANDBOX (true/false，默认 true): ') || 'true';
  const googleMapsKey = await question('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (可选，按 Enter 跳过): ') || 'your_google_maps_api_key_here';

  // 验证必填字段
  if (!apiKey || !authDomain || !projectId) {
    console.log('\n❌ 错误: API_KEY, AUTH_DOMAIN, PROJECT_ID 是必填项！');
    rl.close();
    return;
  }

  // 生成 .env.local 内容
  const envContent = `# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${appId}

# Pi Network Configuration
NEXT_PUBLIC_PI_SANDBOX=${piSandbox}

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=${googleMapsKey}
`;

  // 写入文件
  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('\n✅ 成功创建 .env.local 文件！');
    console.log('\n📝 下一步:');
    console.log('1. 重启开发服务器: npm run dev');
    console.log('2. 在 Firebase Console 中启用 Firestore 和 Storage');
    console.log('3. 刷新浏览器页面\n');
  } catch (error) {
    console.error('\n❌ 写入文件失败:', error.message);
  }

  rl.close();
}

setupEnv().catch(console.error);
