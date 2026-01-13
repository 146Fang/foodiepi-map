# FoodiePi Map - 快速设置指南

## 解决 Firebase 配置错误

如果遇到 `auth/invalid-api-key` 错误，请按照以下步骤操作：

### 1. 创建环境变量文件

在项目根目录创建 `.env.local` 文件：

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# 或使用文本编辑器创建
```

### 2. 复制环境变量模板

从 `env.example.txt` 复制内容到 `.env.local`

### 3. 获取 Firebase 配置

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 创建新项目或选择现有项目
3. 点击项目设置（⚙️）→ 项目设置
4. 滚动到"您的应用"部分
5. 选择 Web 应用（</> 图标）
6. 复制配置值

### 4. 填写环境变量

在 `.env.local` 中填写以下值：

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...（从 Firebase 配置复制）
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 5. 启用 Firebase 服务

在 Firebase Console 中启用：

- **Firestore Database**: 
  - 创建数据库
  - 选择"以测试模式启动"（开发阶段）
  
- **Storage**:
  - 启用 Firebase Storage
  - 使用默认安全规则（开发阶段）

### 6. 重启开发服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 7. 验证配置

打开浏览器控制台，应该不再看到 Firebase 错误。

如果仍有错误，检查：
- `.env.local` 文件是否在项目根目录
- 环境变量名称是否正确（包括 `NEXT_PUBLIC_` 前缀）
- 是否重启了开发服务器
- Firebase 项目是否已启用所需服务

## 常见问题

### Q: 为什么需要 `NEXT_PUBLIC_` 前缀？
A: Next.js 要求客户端可访问的环境变量必须使用 `NEXT_PUBLIC_` 前缀。

### Q: 环境变量更新后不生效？
A: 必须重启 Next.js 开发服务器才能加载新的环境变量。

### Q: 如何验证环境变量是否正确加载？
A: 在浏览器控制台检查，不应该看到 Firebase 配置错误。如果看到 `FirebaseErrorBoundary` 组件显示错误，说明配置有问题。

### Q: 生产环境如何配置？
A: 在 Vercel 项目设置中添加环境变量，参考 `DEPLOYMENT.md`。
