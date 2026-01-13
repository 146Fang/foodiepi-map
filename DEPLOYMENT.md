# Deployment Guide for FoodiePi Map

## 部署到 Vercel

### 1. 环境变量配置

在 Vercel 项目设置中添加以下环境变量：

#### Firebase 配置
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

#### Pi Network 配置
- `NEXT_PUBLIC_PI_SANDBOX` (设置为 `true` 用于测试，`false` 用于生产)

#### Google Maps 配置
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### 2. API Keys 安全注意事项

#### ✅ 安全实践
- 所有 API Keys 都使用 `NEXT_PUBLIC_` 前缀（Next.js 要求客户端访问）
- 环境变量存储在 Vercel 的环境变量设置中，不会提交到代码仓库
- `.env.local` 文件已添加到 `.gitignore`

#### ⚠️ 重要提醒
- `NEXT_PUBLIC_*` 变量会暴露在客户端代码中
- 确保在 Firebase Console 和 Google Cloud Console 中配置正确的域名限制
- 使用 Firebase Security Rules 保护数据
- 限制 Google Maps API Key 的使用域名

### 3. Firebase Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Restaurants collection
    match /restaurants/{restaurantId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Scores collection
    match /scores/{userId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // User Actions collection
    match /userActions/{actionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.restaurantId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.createdRestaurants);
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
    
    // Reward Pool
    match /rewardPool/{document=**} {
      allow read: if true;
      allow write: if false; // 只能通过服务器端函数修改
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Avatar uploads
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Restaurant photos
    match /restaurants/{restaurantId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 4. Google Maps API 限制

在 Google Cloud Console 中：
1. 限制 API Key 只能从特定域名使用
2. 添加 HTTP referrer 限制：
   - `https://your-domain.vercel.app/*`
   - `https://*.vercel.app/*` (开发环境)
3. 启用以下 API：
   - Maps JavaScript API
   - Geocoding API

### 5. 部署步骤

1. **连接 GitHub 仓库到 Vercel**
   ```bash
   # 在 Vercel Dashboard 中连接仓库
   ```

2. **配置环境变量**
   - 在 Vercel 项目设置中添加所有环境变量
   - 分别配置 Production、Preview 和 Development 环境

3. **部署**
   ```bash
   # Vercel 会自动检测 Next.js 项目并部署
   # 或使用 CLI:
   vercel --prod
   ```

4. **验证部署**
   - 检查所有页面是否正常加载
   - 测试 Pi Network 认证
   - 测试地图功能
   - 测试上传功能

### 6. 生产环境检查清单

- [ ] 所有环境变量已配置
- [ ] Firebase Security Rules 已设置
- [ ] Google Maps API Key 已限制域名
- [ ] Pi Network SDK 设置为生产模式 (`NEXT_PUBLIC_PI_SANDBOX=false`)
- [ ] 测试所有主要功能
- [ ] 检查移动端显示效果（Pi Browser）
- [ ] 验证图片上传功能
- [ ] 测试支付流程

### 7. 性能优化

- 图片优化：使用 Next.js Image 组件
- 代码分割：自动通过 Next.js App Router
- CDN：Vercel 自动提供全球 CDN
- 缓存策略：已在 `next.config.js` 中配置

### 8. 监控和日志

- 使用 Vercel Analytics 监控性能
- 使用 Firebase Console 查看错误日志
- 监控 API 使用量（Google Maps, Firebase）

## 故障排除

### 常见问题

1. **地图不显示**
   - 检查 Google Maps API Key 是否正确
   - 验证 API Key 是否启用了正确的 API
   - 检查域名限制设置

2. **Pi Network 认证失败**
   - 确认 `NEXT_PUBLIC_PI_SANDBOX` 设置正确
   - 检查 Pi Network 开发者控制台中的应用配置
   - 验证重定向 URL 配置

3. **Firebase 上传失败**
   - 检查 Storage Security Rules
   - 验证 Firebase 项目配置
   - 检查网络连接

4. **环境变量未生效**
   - 在 Vercel 中重新部署
   - 确认变量名称正确（包括 `NEXT_PUBLIC_` 前缀）
   - 检查是否有拼写错误
