# PowerShell 脚本：快速创建 .env.local 文件
# 使用方法: .\create-env-local.ps1

$envPath = Join-Path $PSScriptRoot ".env.local"
$examplePath = Join-Path $PSScriptRoot "env.example.txt"

Write-Host "`n🔥 Firebase 环境变量设置助手`n" -ForegroundColor Cyan
Write-Host "这个脚本将帮助您创建 .env.local 文件。`n" -ForegroundColor Yellow

# 检查是否已存在
if (Test-Path $envPath) {
    $overwrite = Read-Host "⚠️  .env.local 文件已存在。是否覆盖？(y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "已取消。" -ForegroundColor Yellow
        exit
    }
}

Write-Host "请从 Firebase Console 获取以下配置值：" -ForegroundColor Green
Write-Host "1. 访问 https://console.firebase.google.com/"
Write-Host "2. 选择或创建项目"
Write-Host "3. 点击 ⚙️ 设置 → 项目设置"
Write-Host "4. 滚动到'您的应用'，点击 Web 图标 </>"
Write-Host "5. 复制配置值`n"

$apiKey = Read-Host "NEXT_PUBLIC_FIREBASE_API_KEY"
$authDomain = Read-Host "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
$projectId = Read-Host "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
$storageBucket = Read-Host "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET (可选，按 Enter 使用默认值)"
if ([string]::IsNullOrWhiteSpace($storageBucket)) {
    $storageBucket = "$projectId.appspot.com"
}
$messagingSenderId = Read-Host "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID (可选，按 Enter 跳过)"
$appId = Read-Host "NEXT_PUBLIC_FIREBASE_APP_ID (可选，按 Enter 跳过)"
$piSandbox = Read-Host "NEXT_PUBLIC_PI_SANDBOX (true/false，默认 true)"
if ([string]::IsNullOrWhiteSpace($piSandbox)) {
    $piSandbox = "true"
}
$googleMapsKey = Read-Host "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (可选，按 Enter 跳过)"
if ([string]::IsNullOrWhiteSpace($googleMapsKey)) {
    $googleMapsKey = "your_google_maps_api_key_here"
}

# 验证必填字段
if ([string]::IsNullOrWhiteSpace($apiKey) -or [string]::IsNullOrWhiteSpace($authDomain) -or [string]::IsNullOrWhiteSpace($projectId)) {
    Write-Host "`n❌ 错误: API_KEY, AUTH_DOMAIN, PROJECT_ID 是必填项！" -ForegroundColor Red
    exit 1
}

# 生成 .env.local 内容
$envContent = @"
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$apiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$authDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$projectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$storageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$messagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=$appId

# Pi Network Configuration
NEXT_PUBLIC_PI_SANDBOX=$piSandbox

# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$googleMapsKey
"@

# 写入文件
try {
    $envContent | Out-File -FilePath $envPath -Encoding utf8 -NoNewline
    Write-Host "`n✅ 成功创建 .env.local 文件！" -ForegroundColor Green
    Write-Host "`n📝 下一步:" -ForegroundColor Cyan
    Write-Host "1. 重启开发服务器: npm run dev"
    Write-Host "2. 在 Firebase Console 中启用 Firestore 和 Storage"
    Write-Host "3. 刷新浏览器页面`n"
} catch {
    Write-Host "`n❌ 写入文件失败: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
