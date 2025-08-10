# ProfileCrafted API Endpoint Testing Script
# Test all backend API endpoints to ensure they're working correctly

Write-Host "Testing ProfileCrafted Backend API Endpoints..." -ForegroundColor Green
Write-Host "Backend Server: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "1. Testing Health Endpoint..." -ForegroundColor Cyan
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Health endpoint working - Status: $($health.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Status Check
Write-Host "2. Testing Status Endpoint..." -ForegroundColor Cyan
try {
    $status = Invoke-WebRequest -Uri "http://localhost:5000/api/status" -Method GET
    Write-Host "✅ Status endpoint working - Status: $($status.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Status endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Upload Resume Endpoint (GET should return 405 Method Not Allowed)
Write-Host "3. Testing Upload Resume Endpoint Structure..." -ForegroundColor Cyan
try {
    $upload = Invoke-WebRequest -Uri "http://localhost:5000/api/upload-resume" -Method GET
    Write-Host "❌ Upload endpoint should not accept GET requests" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "✅ Upload endpoint correctly rejects GET requests (405)" -ForegroundColor Green
    } else {
        Write-Host "❌ Upload endpoint error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Generate Essay Endpoint (GET should return 405 Method Not Allowed)
Write-Host "4. Testing Generate Essay Endpoint Structure..." -ForegroundColor Cyan
try {
    $essay = Invoke-WebRequest -Uri "http://localhost:5000/api/generate-essay" -Method GET
    Write-Host "❌ Essay endpoint should not accept GET requests" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "✅ Essay endpoint correctly rejects GET requests (405)" -ForegroundColor Green
    } else {
        Write-Host "❌ Essay endpoint error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 5: Send Email Endpoint (GET should return 405 Method Not Allowed)
Write-Host "5. Testing Send Email Endpoint Structure..." -ForegroundColor Cyan
try {
    $email = Invoke-WebRequest -Uri "http://localhost:5000/api/send-email" -Method GET
    Write-Host "❌ Email endpoint should not accept GET requests" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 405) {
        Write-Host "✅ Email endpoint correctly rejects GET requests (405)" -ForegroundColor Green
    } else {
        Write-Host "❌ Email endpoint error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "API Endpoint Testing Complete!" -ForegroundColor Green
Write-Host "Note: POST endpoints require proper data and will be tested via frontend." -ForegroundColor Yellow
