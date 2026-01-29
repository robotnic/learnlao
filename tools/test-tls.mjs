import https from 'node:https';

const apiKey = process.env['APY_TOKEN'];

if (!apiKey) {
  console.error('❌ APY_TOKEN not set');
  process.exit(1);
}

console.log('🔍 Testing ApyHub API with TLS diagnostics...\n');

// Create an HTTPS agent that logs TLS info
const httpsAgent = new https.Agent({
  rejectUnauthorized: true // Start with strict verification
});

const endpoints = [
  'https://api.apyhub.com/generate/speech',
];

async function testEndpoint(url, strict = true) {
  const agent = new https.Agent({
    rejectUnauthorized: strict
  });
  
  const mode = strict ? 'STRICT' : 'INSECURE';
  console.log(`Testing: ${url} (${mode} mode)`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apy-token': apiKey
      },
      body: JSON.stringify({
        text: 'test',
        language: 'lo',
        gender: 'female'
      }),
      timeout: 10000,
      dispatcher: agent
    });

    console.log(`  ✅ Response: HTTP ${response.status}`);
    const text = await response.text();
    console.log(`  📝 Body (first 300 chars): ${text.substring(0, 300)}`);
    return true;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    if (error.code) {
      console.log(`     Code: ${error.code}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('1️⃣  Testing with STRICT certificate verification:');
  console.log('='.repeat(50));
  let success = await testEndpoint(endpoints[0], true);
  console.log();
  
  if (!success) {
    console.log('2️⃣  Testing with INSECURE mode (skip certificate verification):');
    console.log('='.repeat(50));
    success = await testEndpoint(endpoints[0], false);
    console.log();
    
    if (success) {
      console.log('⚠️  CERTIFICATE ISSUE DETECTED!');
      console.log('   The API works with certificate verification disabled.');
      console.log('   This suggests a TLS/SSL certificate issue.');
      console.log('\n   Solution: Add NODE_TLS_REJECT_UNAUTHORIZED=0 when running:');
      console.log('   NODE_TLS_REJECT_UNAUTHORIZED=0 npm run generate-tts');
    }
  }
}

runTests();
