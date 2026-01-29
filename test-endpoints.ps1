# Manual API Testing Script (PowerShell)
# Run this to test key endpoints after changes

$BASE_URL = "http://localhost:3000"

Write-Host "🧪 Testing Yoga Backend API" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1️⃣ Testing root endpoint..." -ForegroundColor Yellow
Invoke-RestMethod -Uri $BASE_URL -Method Get | ConvertTo-Json

# Test 2: Invalid email registration
Write-Host "`n2️⃣ Testing email validation (should fail)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method Post `
        -ContentType "application/json" `
        -Body '{"username":"test","email":"invalid-email","password":"StrongPass123!"}' | ConvertTo-Json
} catch {
    Write-Host "❌ Expected error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Weak password registration
Write-Host "`n3️⃣ Testing password validation (should fail)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method Post `
        -ContentType "application/json" `
        -Body '{"username":"test","email":"test@example.com","password":"weak"}' | ConvertTo-Json
} catch {
    Write-Host "❌ Expected error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Valid registration
Write-Host "`n4️⃣ Testing valid registration (should succeed)..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "$BASE_URL/api/auth/register" -Method Post `
        -ContentType "application/json" `
        -Body '{"username":"testuser456","email":"testuser456@example.com","password":"ValidPass123!"}' | ConvertTo-Json
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Spaces API
Write-Host "`n5️⃣ Testing spaces API..." -ForegroundColor Yellow
$spaces = Invoke-RestMethod -Uri "$BASE_URL/api/spaces" -Method Get
Write-Host "Found $($spaces.data.Count) spaces"

# Test 6: Stats API
Write-Host "`n6️⃣ Testing stats API..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "$BASE_URL/api/stats" -Method Get | ConvertTo-Json

# Test 7: Gallery API
Write-Host "`n7️⃣ Testing gallery API..." -ForegroundColor Yellow
$gallery = Invoke-RestMethod -Uri "$BASE_URL/api/gallery" -Method Get
Write-Host "Found $($gallery.data.Count) images"

Write-Host "`n✅ Testing complete!" -ForegroundColor Green
