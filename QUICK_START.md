# 快速开始指南

## 解决 Firebase 配置错误

### 步骤 1: 创建 `.env.local` 文件

在项目根目录（与 `package.json` 同级）创建 `.env.local` 文件。

**Windows PowerShell:**
```powershell
New-Item -Path .env.local -ItemType File
```

**或者使用文本编辑器直接创建文件**

### 步骤 2: 获取 Firebase 配置

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 点击"添加项目"或选择现有项目
3. 在项目概览页面，点击 ⚙️ 设置图标 → **项目设置**
4. 滚动到"您的应用"部分
5. 如果没有 Web 应用，点击 **</>** 图标添加 Web 应用
6. 复制配置对象中的值

### 步骤 3: 填写 `.env.local`

打开 `.env.local` 文件，填入以下内容（替换为你的实际值）：

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...（你的实际 API Key）
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Pi Network Configuration
NEXT_PUBLIC_PI_SANDBOX=true

# Google Maps API Key (可选，用于地图功能)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 步骤 4: 启用 Firebase 服务

在 Firebase Console 中：

1. **Firestore Database**:
   - 点击"创建数据库"
   - 选择"以测试模式启动"（开发阶段）
   - 选择位置

2. **Storage**:
   - 点击"开始使用"
   - 使用默认安全规则（开发阶段）

### 步骤 5: 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 步骤 6: 验证

打开浏览器，应该不再看到 Firebase 配置错误。

## 常见问题

### Q: 如何知道我的配置是否正确？
A: 如果配置正确，应用会正常加载，不会显示 Firebase 错误界面。

### Q: 我只有部分 Firebase 配置，可以运行吗？
A: 至少需要以下三个关键配置：
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

### Q: 环境变量更新后不生效？
A: **必须重启 Next.js 开发服务器**才能加载新的环境变量。

### Q: 在哪里找到 Firebase 配置？
A: Firebase Console → 项目设置 → 您的应用 → Web 应用配置

## 示例配置

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=myproject-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=myproject-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=myproject-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

## 需要帮助？

如果仍然遇到问题：
1. 检查 `.env.local` 文件是否在项目根目录
2. 确认没有使用占位符值（如 "your_api_key_here"）
3. 确认所有值都没有多余的空格
4. 重启开发服务器
5. 清除浏览器缓存并刷新页面
