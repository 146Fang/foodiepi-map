# 📦 GitHub 仓库设置指南

## 🚀 快速开始

### 步骤 1: 检查 Git 状态

在项目根目录运行：

```bash
git status
```

如果显示 "not a git repository"，需要初始化：

```bash
git init
```

### 步骤 2: 添加所有文件

```bash
git add .
```

### 步骤 3: 创建初始提交

```bash
git commit -m "Initial commit: FoodiePi Map - Web3 Restaurant Discovery App"
```

### 步骤 4: 在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `foodiepi-map`（或您喜欢的名称）
   - **Description**: `Web3 restaurant discovery platform with Pi Network integration`
   - **Visibility**: 选择 Public 或 Private
   - **不要勾选** "Add a README file"（我们已经有了）
   - **不要勾选** "Add .gitignore"（我们已经有了）
   - **不要选择** License（可选）

3. 点击 "Create repository"

### 步骤 5: 连接本地仓库到 GitHub

GitHub 会显示命令，复制并运行：

```bash
git remote add origin https://github.com/YOUR_USERNAME/foodiepi-map.git
git branch -M main
git push -u origin main
```

**重要**：将 `YOUR_USERNAME` 替换为您的 GitHub 用户名！

### 步骤 6: 验证

访问您的 GitHub 仓库 URL，应该能看到所有文件。

## 📝 后续更新

每次修改代码后：

```bash
git add .
git commit -m "描述您的更改"
git push origin main
```

## 🔒 安全检查清单

在推送之前，确保：

- ✅ `.env.local` 文件在 `.gitignore` 中（已包含）
- ✅ 没有硬编码的 API 密钥
- ✅ 敏感信息只存储在环境变量中

## 🎯 下一步

完成 GitHub 设置后，继续阅读 `DEPLOY_GUIDE.md` 了解如何部署到 Vercel。
