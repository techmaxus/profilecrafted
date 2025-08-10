/**
 * Production System Test
 * Validate all API endpoints and services
 */

const fs = require('fs');
const path = require('path');

async function testProductionAPI() {
  console.log('🧪 Testing ProfileCrafted.com Production API...\n');

  const baseUrl = 'http://localhost:3001';
  
  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await fetch(`${baseUrl}/health`);
    const healthData = await healthResponse.json();
    console.log(`✅ Health: ${healthData.status}`);
    console.log(`📊 Services: AI=${healthData.services.ai}, Email=${!!healthData.services.email}`);
    
    // Test 2: API Status
    console.log('\n2️⃣ Testing API status...');
    const statusResponse = await fetch(`${baseUrl}/api/status`);
    const statusData = await statusResponse.json();
    console.log(`✅ Production Ready: ${statusData.ready}`);
    if (!statusData.ready) {
      console.log(`⚠️ Issues: ${statusData.issues.join(', ')}`);
    }

    // Test 3: File Upload Endpoint
    console.log('\n3️⃣ Testing file upload endpoint...');
    
    // Create a test file
    const testContent = 'John Doe\nSoftware Engineer\nExperience: 3 years Python, JavaScript\nEducation: Computer Science\nSkills: React, Node.js, SQL';
    const testFilePath = path.join(__dirname, 'test-resume.txt');
    fs.writeFileSync(testFilePath, testContent);

    const formData = new FormData();
    const file = new Blob([testContent], { type: 'text/plain' });
    formData.append('resume', file, 'test-resume.txt');

    try {
      const uploadResponse = await fetch(`${baseUrl}/api/upload-resume`, {
        method: 'POST',
        body: formData
      });
      
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        console.log(`✅ Upload: ${uploadData.message}`);
        console.log(`📄 Session ID: ${uploadData.sessionId}`);
        
        // Test 4: Resume Analysis
        console.log('\n4️⃣ Testing resume analysis...');
        const analysisResponse = await fetch(`${baseUrl}/api/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: uploadData.sessionId,
            resumeText: testContent
          })
        });
        
        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          console.log(`✅ Analysis: Overall score ${analysisData.scores.overall}/100`);
          console.log(`🤖 Provider: ${analysisData.provider}`);
          
          // Test 5: Essay Generation
          console.log('\n5️⃣ Testing essay generation...');
          const essayResponse = await fetch(`${baseUrl}/api/generate-essay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scores: analysisData.scores,
              sessionId: uploadData.sessionId,
              resumeContent: testContent
            })
          });
          
          if (essayResponse.ok) {
            const essayData = await essayResponse.json();
            console.log(`✅ Essay: Generated ${essayData.wordCount} words`);
            console.log(`🤖 Provider: ${essayData.provider}`);
            console.log(`📝 Preview: ${essayData.essay.substring(0, 100)}...`);
          } else {
            console.log(`❌ Essay generation failed: ${essayResponse.status}`);
          }
        } else {
          console.log(`❌ Analysis failed: ${analysisResponse.status}`);
        }
      } else {
        const errorData = await uploadResponse.json();
        console.log(`❌ Upload failed: ${uploadResponse.status} - ${errorData.error}`);
      }
    } catch (uploadError) {
      console.log(`❌ Upload error: ${uploadError.message}`);
    }

    // Cleanup
    try {
      fs.unlinkSync(testFilePath);
    } catch (e) {}

    console.log('\n🎯 Production test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run test if called directly
if (require.main === module) {
  testProductionAPI().catch(console.error);
}

module.exports = { testProductionAPI };
