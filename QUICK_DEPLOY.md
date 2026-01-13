# ⚡ 快速部署指南

## 🎯 一键完成所有操作

### 方法 1: 使用自动化脚本（推荐）

#### 步骤 1: 设置 GitHub

在 PowerShell 中运行：

```powershell
.\setup-github.ps1
```

脚本会自动：
- ✅ 初始化 Git（如果需要）
- ✅ 添加所有文件
- ✅ 创建提交
- ✅ 连接 GitHub 仓库
- ✅ 推送代码

#### 步骤 2: 部署到 Vercel

1. 访问 https://vercel.com
2. 点击 "Sign Up" → "Continue with GitHub"
3. 点击 "Add New..." → "Project"
4. 选择您的 `foodiepi-map` 仓库
5. 点击 "Import"

#### 步骤 3: 配置环境变量（可选）

在 Vercel 项目设置中添加：

```
NEXT_PUBLIC_PI_SANDBOX=true
```

（Firebase 配置可选，应用可以在演示模式运行）

#### 步骤 4: 部署

点击 "Deploy" 按钮，等待 2-3 分钟完成！

### 方法 2: 手动操作

#### GitHub 设置

```bash
# 1. 初始化 Git（如果还没有）
git init

# 2. 添加文件
git add .

# 3. 创建提交
git commit -m "Initial commit: FoodiePi Map"

# 4. 在 GitHub 创建仓库后，连接远程
git remote add origin https://github.com/YOUR_USERNAME/foodiepi-map.git
git branch -M main
git push -u origin main
```

#### Vercel 部署

1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 配置环境变量（可选）
4. 点击部署

## ✅ 完成检查清单

- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建
- [ ] 环境变量已配置（可选）
- [ ] 部署成功
- [ ] 应用 URL 可访问

## 🎉 完成！

您的应用现在：
- ✅ 托管在 Vercel（永久免费）
- ✅ 代码保存在 GitHub
- ✅ 自动部署（每次推送代码时）
- ✅ 可在 Pi Browser 中使用

## 📱 使用应用

1. **在普通浏览器中**：应用以演示模式运行
2. **在 Pi Browser 中**：打开 Vercel URL，完整功能可用

## 🔧 后续更新

每次修改代码后：

```bash
git add .
git commit -m "描述更改"
git push origin main
```

Vercel 会自动重新部署！
