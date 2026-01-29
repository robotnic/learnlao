import https from 'node:https';

const apiKey = process.env['APY_TOKEN'];

if (!apiKey) {
  console.error('❌ APY_TOKEN not set');
  process.exit(1);
}

console.log('🔍 Testing ApyHub API endpoints...\n');

const endpoints = [
  'https://api.apyhub.com/generate/speech',
  'https://api.apyhub.com/api/generate/speech',
  'https://api.apyhub.com/v1/generate/speech',
  'https://api.apyhub.com/speech',
  'https://apyhub.com/api/generate/speech',
];

async function testEndpoint(url) {
  console.log(`Testing: ${url}`);
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
      timeout: 10000
    });

    console.log(`  ✅ Response: HTTP ${response.status}`);
    const text = await response.text();
    console.log(`  📝 Body (first 200 chars): ${text.substring(0, 200)}`);
    return true;
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
    return false;
  }
}

async function runTests() {
  for (const endpoint of endpoints) {
    await testEndpoint(endpoint);
    console.log();
  }
}

runTests();
