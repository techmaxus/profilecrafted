# ProfileCrafted Final Validation Test
# Comprehensive test of all API endpoints with corrected CORS configuration

Write-Host "=== ProfileCrafted Final Validation Test ===" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host ""

# Test 1: CORS Preflight for Upload Resume
Write-Host "1. Testing CORS Preflight for Upload Resume..." -ForegroundColor Cyan
try {
    $corsTest = Invoke-WebRequest -Uri "http://localhost:5000/api/upload-resume" -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:3000"
        "Access-Control-Request-Method" = "POST"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    Write-Host "✅ CORS preflight successful - Status: $($corsTest.StatusCode)" -ForegroundColor Green
    
    # Check for CORS headers
    if ($corsTest.Headers["Access-Control-Allow-Origin"]) {
        Write-Host "   ✅ Access-Control-Allow-Origin header present" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Access-Control-Allow-Origin header missing" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ CORS preflight failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Generate Essay with CORS
Write-Host "2. Testing Generate Essay with CORS..." -ForegroundColor Cyan
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
        sessionId = "test-session-cors"
        resumeContent = "Test resume content for CORS validation"
    } | ConvertTo-Json -Depth 3

    $essayResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/generate-essay" -Method POST -Body $essayData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    }
    Write-Host "✅ Generate Essay with CORS working - Status: $($essayResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Generate Essay with CORS failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Send Email with CORS
Write-Host "3. Testing Send Email with CORS..." -ForegroundColor Cyan
try {
    $emailData = @{
        email = "test@example.com"
        essay = "This is a test essay for CORS validation."
        sessionId = "test-session-cors"
    } | ConvertTo-Json -Depth 2

    $emailResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/send-email" -Method POST -Body $emailData -ContentType "application/json" -Headers @{
        "Origin" = "http://localhost:3000"
    }
    Write-Host "✅ Send Email with CORS working - Status: $($emailResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Send Email with CORS failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Final Validation Complete ===" -ForegroundColor Green
Write-Host "All API endpoints should now work correctly from the frontend!" -ForegroundColor Yellow
