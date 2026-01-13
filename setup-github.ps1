# GitHub 仓库设置自动化脚本
# 使用方法: .\setup-github.ps1

Write-Host "`n🚀 FoodiePi Map - GitHub 仓库设置助手`n" -ForegroundColor Cyan

# 检查 Git 是否已初始化
if (-not (Test-Path .git)) {
    Write-Host "📦 初始化 Git 仓库..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git 仓库已初始化`n" -ForegroundColor Green
} else {
    Write-Host "✅ Git 仓库已存在`n" -ForegroundColor Green
}

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host "📝 发现未提交的文件，正在添加..." -ForegroundColor Yellow
    git add .
    Write-Host "✅ 文件已添加到暂存区`n" -ForegroundColor Green
    
    # 检查是否已有提交
    $hasCommits = git log --oneline -1 2>$null
    if (-not $hasCommits) {
        Write-Host "💾 创建初始提交..." -ForegroundColor Yellow
        git commit -m "Initial commit: FoodiePi Map - Web3 Restaurant Discovery App"
        Write-Host "✅ 初始提交已创建`n" -ForegroundColor Green
    } else {
        Write-Host "💾 创建提交..." -ForegroundColor Yellow
        $commitMessage = Read-Host "请输入提交信息（或按 Enter 使用默认信息）"
        if ([string]::IsNullOrWhiteSpace($commitMessage)) {
            $commitMessage = "Update: FoodiePi Map"
        }
        git commit -m $commitMessage
        Write-Host "✅ 提交已创建`n" -ForegroundColor Green
    }
} else {
    Write-Host "✅ 没有未提交的更改`n" -ForegroundColor Green
}

# 检查是否已连接远程仓库
$remote = git remote -v 2>$null
if (-not $remote) {
    Write-Host "🔗 需要连接 GitHub 远程仓库`n" -ForegroundColor Yellow
    Write-Host "请按照以下步骤操作：`n" -ForegroundColor Cyan
    Write-Host "1. 访问 https://github.com/new" -ForegroundColor White
    Write-Host "2. 创建新仓库（例如：foodiepi-map）" -ForegroundColor White
    Write-Host "3. 不要初始化 README、.gitignore 或 license" -ForegroundColor White
    Write-Host "4. 复制仓库 URL（例如：https://github.com/YOUR_USERNAME/foodiepi-map.git）`n" -ForegroundColor White
    
    $repoUrl = Read-Host "请输入您的 GitHub 仓库 URL"
    
    if (-not [string]::IsNullOrWhiteSpace($repoUrl)) {
        Write-Host "`n🔗 添加远程仓库..." -ForegroundColor Yellow
        git remote add origin $repoUrl
        git branch -M main
        
        Write-Host "`n📤 推送到 GitHub..." -ForegroundColor Yellow
        git push -u origin main
        
        Write-Host "`n✅ 代码已推送到 GitHub！" -ForegroundColor Green
        Write-Host "仓库地址: $repoUrl`n" -ForegroundColor Cyan
    } else {
        Write-Host "`n⚠️ 未提供仓库 URL，请稍后手动连接`n" -ForegroundColor Yellow
        Write-Host "手动连接命令：" -ForegroundColor Cyan
        Write-Host "git remote add origin https://github.com/YOUR_USERNAME/foodiepi-map.git" -ForegroundColor White
        Write-Host "git branch -M main" -ForegroundColor White
        Write-Host "git push -u origin main`n" -ForegroundColor White
    }
} else {
    Write-Host "✅ 远程仓库已连接" -ForegroundColor Green
    Write-Host "远程仓库信息：" -ForegroundColor Cyan
    git remote -v
    Write-Host ""
    
    $push = Read-Host "是否推送到 GitHub? (y/N)"
    if ($push -eq "y" -or $push -eq "Y") {
        Write-Host "`n📤 推送到 GitHub..." -ForegroundColor Yellow
        git push origin main
        Write-Host "✅ 代码已推送！`n" -ForegroundColor Green
    }
}

Write-Host "`n🎉 GitHub 设置完成！`n" -ForegroundColor Green
Write-Host "下一步：查看 DEPLOY_GUIDE.md 了解如何部署到 Vercel`n" -ForegroundColor Cyan
