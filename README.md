# FoodiePi Map

A Web3 restaurant discovery platform built with Next.js, Firebase, and Pi Network SDK.

## Features

- 🗺️ Interactive map search for restaurants
- 🍽️ Personalized restaurant recommendations
- 📊 User and restaurant dashboard
- 🌍 Multi-language support (8 languages)
- 🔐 Pi Network authentication
- ☁️ Firebase backend integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Web3**: Pi Network SDK
- **Language**: TypeScript

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- Firebase 项目（可选，用于完整功能）
- Pi Network 开发者账户（可选）

### 本地开发

1. 克隆仓库:
```bash
git clone https://github.com/YOUR_USERNAME/foodiepi-map.git
cd foodiepi-map
```

2. 安装依赖:
```bash
npm install
```

3. 设置环境变量（可选）:
   - 复制 `env.example.txt` 到 `.env.local`
   - 填入您的 Firebase 配置
   - 设置 `NEXT_PUBLIC_PI_SANDBOX=true` 用于开发

4. 运行开发服务器:
```bash
npm run dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 🌐 部署到 Vercel

查看 [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) 了解完整部署步骤。

**快速部署：**
1. 将代码推送到 GitHub
2. 在 Vercel 导入 GitHub 仓库
3. 配置环境变量
4. 点击部署！

### 📱 在 Pi Browser 中使用

应用会自动检测 Pi Browser 环境：
- 在 Pi Browser 中打开应用 URL
- Pi Network SDK 会自动加载
- 完整功能可用

在普通浏览器中：
- 应用会以演示模式运行
- UI 正常显示
- Firebase 和 Pi Network 功能受限

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Pi Network Configuration
NEXT_PUBLIC_PI_SANDBOX=true
```

## Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Enable Authentication (optional, for additional auth methods)
4. Enable Storage (for file uploads)
5. Copy your Firebase configuration to `.env.local`

## Pi Network Setup

1. Register as a Pi Network developer at [Pi Developer Portal](https://developers.minepi.com/)
2. Create a new app and get your app credentials
3. Configure your app's redirect URLs
4. Set `NEXT_PUBLIC_PI_SANDBOX=true` for testing in sandbox mode

## Security Notes

- All Firebase configuration uses environment variables
- User data is validated before saving to Firestore
- Pi Network authentication uses official SDK
- Input sanitization is implemented for user data

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── contexts/        # React contexts (i18n, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries (Firebase, Pi SDK)
└── services/        # Business logic services
```

## Features

### Core Features
- 🗺️ Interactive Google Maps with restaurant markers
- 🔍 Real-time search by name or address
- 📸 Restaurant photo uploads
- 🏆 Leaderboard system (by score and pool contribution)
- 💰 Reward distribution system
- 📊 Personal and restaurant dashboards
- 🎯 Point system with anti-fraud protection
- 💳 Pi Network payment integration
- 📱 Responsive design for Pi Browser

### Pi Network Integration
- 🔐 Pi Network authentication
- 📺 Pi Ad Network integration
- 💸 Pi Payment system (95% to restaurant, 5% to pool)
- 📈 User score tracking

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables (see `env.example.txt`)
4. Deploy!

## Security

- All API keys are stored as environment variables
- Firebase Security Rules protect data
- Input validation and sanitization
- Anti-fraud mechanisms for scoring
- HTTPS enforced in production

## License

MIT
