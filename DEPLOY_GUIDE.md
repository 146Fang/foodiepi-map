# 🚀 完整部署指南 - FoodiePi Map

本指南将帮助您将 FoodiePi Map 部署到 Vercel 并推送到 GitHub。

## 📋 前置要求

- GitHub 账户
- Vercel 账户（免费）
- Firebase 项目（可选，用于完整功能）

## 🎯 步骤 1: 准备 GitHub 仓库

### 1.1 初始化 Git（如果还没有）

在项目根目录运行：

```bash
git init
```

### 1.2 添加所有文件

```bash
git add .
```

### 1.3 创建初始提交

```bash
git commit -m "Initial commit: FoodiePi Map Web3 App"
```

### 1.4 在 GitHub 创建新仓库

1. 访问 https://github.com/new
2. 仓库名称：`foodiepi-map`（或您喜欢的名称）
3. 选择 **Public** 或 **Private**
4. **不要** 初始化 README、.gitignore 或 license（我们已经有了）
5. 点击 "Create repository"

### 1.5 连接并推送代码

GitHub 会显示命令，类似这样：

```bash
git remote add origin https://github.com/YOUR_USERNAME/foodiepi-map.git
git branch -M main
git push -u origin main
```

**注意**：将 `YOUR_USERNAME` 替换为您的 GitHub 用户名。

## 🎯 步骤 2: 部署到 Vercel

### 2.1 登录 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" 或 "Log In"
3. 选择 "Continue with GitHub"（推荐）

### 2.2 导入项目

1. 在 Vercel Dashboard，点击 "Add New..." → "Project"
2. 选择您刚创建的 GitHub 仓库 `foodiepi-map`
3. 点击 "Import"

### 2.3 配置项目设置

Vercel 会自动检测 Next.js 项目，保持默认设置：

- **Framework Preset**: Next.js
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### 2.4 配置环境变量

在 "Environment Variables" 部分，添加以下变量：

#### Firebase 配置（可选，用于完整功能）

```
NEXT_PUBLIC_FIREBASE_API_KEY=你的Firebase_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=你的项目.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=你的项目ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=你的项目.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=你的发送者ID
NEXT_PUBLIC_FIREBASE_APP_ID=你的应用ID
```

#### Pi Network 配置

```
NEXT_PUBLIC_PI_SANDBOX=true
```

#### Google Maps（可选）

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=你的Google_Maps_API_Key
```

**如何获取 Firebase 配置：**
1. 访问 https://console.firebase.google.com/
2. 选择项目 → ⚙️ 设置 → 项目设置
3. 滚动到"您的应用" → 点击 Web 图标 `</>`
4. 复制配置值

### 2.5 部署

1. 点击 "Deploy" 按钮
2. 等待部署完成（通常 2-3 分钟）
3. 部署完成后，您会获得一个 URL，例如：`https://foodiepi-map.vercel.app`

## 🎯 步骤 3: 后续更新

### 3.1 本地修改代码后

```bash
git add .
git commit -m "描述您的更改"
git push origin main
```

### 3.2 Vercel 自动部署

Vercel 会自动检测 GitHub 推送并重新部署！

## 🔧 故障排除

### 问题 1: 构建失败

**解决方案：**
- 检查 Vercel 构建日志
- 确保所有环境变量都已设置
- 检查 `package.json` 中的依赖是否正确

### 问题 2: 环境变量未生效

**解决方案：**
- 在 Vercel Dashboard 中重新设置环境变量
- 重新部署项目

### 问题 3: Pi Network SDK 加载问题

**解决方案：**
- 这是正常的！Pi SDK 只在 Pi Browser 中可用
- 应用会自动进入演示模式
- 在 Pi Browser 中打开应用即可使用完整功能

## 📱 在 Pi Browser 中使用

1. 在 Pi Browser 中打开您的 Vercel URL
2. Pi Network SDK 会自动加载
3. 应用将提供完整功能

## 🔒 安全提示

- **不要** 在 GitHub 中提交 `.env.local` 文件
- **不要** 在代码中硬编码 API 密钥
- 使用 Vercel 的环境变量功能存储敏感信息

## 📊 监控和维护

### 查看部署状态

- Vercel Dashboard → 您的项目 → "Deployments"
- 查看构建日志和错误

### 查看分析

- Vercel Dashboard → Analytics（需要升级到 Pro 计划）

## 🎉 完成！

您的应用现在应该：
- ✅ 托管在 Vercel 上
- ✅ 代码保存在 GitHub 中
- ✅ 自动部署（每次推送代码时）
- ✅ 永久运行（只要 Vercel 账户活跃）

## 📞 需要帮助？

- Vercel 文档：https://vercel.com/docs
- GitHub 文档：https://docs.github.com
- Firebase 文档：https://firebase.google.com/docs

---

**恭喜！您的 FoodiePi Map 应用现在已经永久部署并运行！** 🎊
