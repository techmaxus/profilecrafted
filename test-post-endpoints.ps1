# ProfileCrafted POST API Endpoint Testing Script
# Test all backend POST API endpoints with valid data

Write-Host "Testing ProfileCrafted POST API Endpoints..." -ForegroundColor Green
Write-Host "Backend Server: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""

# Test 1: Generate Essay Endpoint (with mock data)
Write-Host "1. Testing Generate Essay Endpoint..." -ForegroundColor Cyan
try {
    $essayData = @{
        scores = @{
            overall = 85
            technicalFluency = 80
            productThinking = 90
            curiosityCreativity = 88
            communicationClarity = 82
            leadershipTeamwork = 87
        }
        sessionId = "test-session-123"
        resumeContent = "Test resume content for essay generation"
    } | ConvertTo-Json -Depth 3

    $essayResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/generate-essay" -Method POST -Body $essayData -ContentType "application/json"
    Write-Host "✅ Generate Essay endpoint working - Status: $($essayResponse.StatusCode)" -ForegroundColor Green
    
    $essayResult = $essayResponse.Content | ConvertFrom-Json
    Write-Host "   Essay generated successfully, Word count: $($essayResult.wordCount)" -ForegroundColor Green
} catch {
    Write-Host "❌ Generate Essay endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Send Email Endpoint (with mock data)
Write-Host "2. Testing Send Email Endpoint..." -ForegroundColor Cyan
try {
    $emailData = @{
        email = "test@example.com"
        essay = "This is a test essay for email functionality validation."
        sessionId = "test-session-123"
    } | ConvertTo-Json -Depth 2

    $emailResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/send-email" -Method POST -Body $emailData -ContentType "application/json"
    Write-Host "✅ Send Email endpoint working - Status: $($emailResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Send Email endpoint failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "POST API Endpoint Testing Complete!" -ForegroundColor Green
Write-Host "Note: File upload endpoint requires multipart/form-data and will be tested via frontend." -ForegroundColor Yellow
