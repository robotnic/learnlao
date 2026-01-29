import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_FILES_PER_RUN = 20;
const TTS_API_URL = process.env['TTS_API_URL'] || 'https://api.apyhub.com/tts/text/file';

/**
 * Converts Lao text to MP3 and saves it to the local assets folder.
 */
async function getTTS(
  text,
  id,
  gender = 'female',
  retries = 3
) {
  const apiKey = process.env['APY_TOKEN'];
  if (!apiKey) throw new Error("Missing APY_TOKEN environment variable");

  const url = TTS_API_URL;
  const fileName = `${id}_${gender}.mp3`;
  const outputPath = path.join(__dirname, '..', 'apps', 'learnlao', 'src', 'assets', 'audio', fileName);

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const requestBody = {
        text: text,
        language: 'lo',
        gender: gender
      };

      let response;
      try {
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apy-token': apiKey
          },
          body: JSON.stringify(requestBody),
          timeout: 120000 // 120 second timeout for TTS generation
        });
      } catch (fetchError) {
        // Detailed fetch error diagnostics
        const errorMsg = fetchError.message || String(fetchError);
        if (errorMsg.includes('ENOTFOUND') || errorMsg.includes('ECONNREFUSED')) {
          throw new Error(`Network error - cannot reach API: ${errorMsg}`);
        } else if (errorMsg.includes('timeout')) {
          throw new Error(`Request timeout after 120s`);
        } else {
          throw new Error(`Fetch failed: ${errorMsg}`);
        }
      }

      if (!response.ok) {
        const errorText = await response.text();
        const errorMsg = `HTTP ${response.status}: ${errorText.substring(0, 200)}`;
        
        // Save detailed error info
        const errorFile = path.join(__dirname, 'api-error-response.txt');
        const errorContent = `Timestamp: ${new Date().toISOString()}\n` +
                            `ID: ${id}\n` +
                            `Status: ${response.status}\n` +
                            `URL: ${TTS_API_URL}\n` +
                            `Headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}\n` +
                            `Body:\n${errorText}`;
        fs.writeFileSync(errorFile, errorContent);
        
        throw new Error(errorMsg);
      }

      // Convert response to Buffer and write to disk
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length === 0) {
        throw new Error('Received empty response from API');
      }

      // Ensure directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      fs.writeFileSync(outputPath, buffer);
      console.log(`✅ Success: File saved to ${outputPath}`);
      return true;
    } catch (error) {
      const errorMsg = error.message || String(error);
      if (attempt < retries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.error(`⚠️  [Attempt ${attempt}/${retries}] ${id}: ${errorMsg}`);
        console.log(`⏳ Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        console.error(`❌ [FAILED] ${id}: ${errorMsg}`);
        console.error(`   📝 Check api-error-response.txt for details`);
        return false;
      }
    }
  }
}

/**
 * Load knowledge base and generate TTS files
 */
async function generateTTSForKnowledgeBase() {
  const kbPath = path.join(__dirname, '..', 'apps', 'learnlao', 'src', 'assets', 'knowledge_base.json');
  const audioDir = path.join(__dirname, '..', 'apps', 'learnlao', 'src', 'assets', 'audio');

  // Ensure audio directory exists
  fs.mkdirSync(audioDir, { recursive: true });

  // Load knowledge base
  const kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));

  const vocabulary = kb.vocabulary || [];
  const phrases = kb.phrases || [];

  const items = [
    ...vocabulary.map(v => ({
      type: 'vocabulary',
      id: v.id,
      text: v.lao,
      gender: 'female'
    })),
    ...phrases.map(p => ({
      type: 'phrase',
      id: p.id,
      text: p.lao,
      gender: 'female'
    }))
  ];

  console.log(`📊 Found ${vocabulary.length} vocabulary items and ${phrases.length} phrases.`);
  console.log(`🎯 Total items to process: ${items.length}`);

  let skipped = 0;
  let created = 0;
  let failed = 0;
  let processed = 0;

  // Shuffle array and take first 20
  const shuffled = items.sort(() => Math.random() - 0.5);
  const toProcess = shuffled.slice(0, MAX_FILES_PER_RUN);

  console.log(`\n🎯 Limiting to maximum ${MAX_FILES_PER_RUN} files per run`);
  console.log(`📋 Selected ${toProcess.length} items for processing\n`);

  for (const item of toProcess) {
    processed++;
    const fileName = `${item.id}_${item.gender}.mp3`;
    const filePath = path.join(audioDir, fileName);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`⏭️  Skipped [${processed}/${toProcess.length}]: ${item.id} (already exists)`);
      skipped++;
      continue;
    }

    console.log(`🎤 [${processed}/${toProcess.length}] Generating TTS for ${item.id}: "${item.text}"`);

    const success = await getTTS(item.text, item.id, item.gender);
    if (success) {
      created++;
    } else {
      failed++;
    }

    // Rate limiting - wait 1 second between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Total processed: ${processed}`);
}

// Test API connectivity
async function testAPIConnection() {
  const apiKey = process.env['APY_TOKEN'];
  if (!apiKey) {
    console.error('❌ Cannot test: APY_TOKEN not set');
    return false;
  }

  console.log('🔍 Testing API connection...');
  console.log(`   URL: ${TTS_API_URL}`);
  console.log(`   Token: ${apiKey.substring(0, 10)}...`);
  
  try {
    const response = await fetch(TTS_API_URL, {
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
      timeout: 120000 // 120 second timeout for test
    });

    console.log(`   Status: ${response.status}`);
    
    if (response.ok) {
      console.log('✅ API connection successful!');
      return true;
    } else {
      const text = await response.text();
      const errorMsg = `API returned HTTP ${response.status}`;
      console.error(`❌ ${errorMsg}`);
      console.error(`   Response body:\n${text}`);
      
      // Save error response to file for debugging
      const errorFile = path.join(__dirname, 'api-error-response.txt');
      const errorContent = `Timestamp: ${new Date().toISOString()}\n` +
                          `Status: ${response.status}\n` +
                          `URL: ${TTS_API_URL}\n` +
                          `Headers: ${JSON.stringify(Object.fromEntries(response.headers), null, 2)}\n` +
                          `Body:\n${text}`;
      fs.writeFileSync(errorFile, errorContent);
      console.error(`\n📝 Full error details saved to: ${errorFile}`);
      return false;
    }
  } catch (error) {
    const errorMsg = error.message || String(error);
    console.error(`❌ Network/Connection error: ${errorMsg}`);
    console.error(`   Code: ${error.code || 'unknown'}`);
    console.error(`   Errno: ${error.errno || 'unknown'}`);
    
    // Save error to file
    const errorFile = path.join(__dirname, 'api-error-response.txt');
    const errorContent = `Timestamp: ${new Date().toISOString()}\n` +
                        `Error Type: ${error.code || error.name || 'Unknown'}\n` +
                        `Message: ${errorMsg}\n` +
                        `Stack: ${error.stack}`;
    fs.writeFileSync(errorFile, errorContent);
    console.error(`\n📝 Error details saved to: ${errorFile}`);
    
    console.error('\n   Please check:');
    console.error('   1. Your internet connection');
    console.error('   2. Your APY_TOKEN is correct');
    console.error('   3. The API is accessible at ' + TTS_API_URL);
    return false;
  }
}

// Main execution
console.log('🚀 Starting TTS generation...\n');

// Diagnostic checks
const apiKey = process.env['APY_TOKEN'];
if (!apiKey) {
  console.error('❌ ERROR: APY_TOKEN environment variable not set!');
  console.error('   Please set it with: export APY_TOKEN="your_token"');
  process.exit(1);
}
console.log(`✅ API token configured (length: ${apiKey.length})`);
console.log(`🔗 API Endpoint: ${TTS_API_URL}`);
console.log(`⚙️  Max files per run: ${MAX_FILES_PER_RUN}`);
console.log(`⏱️  Retry attempts: 3 with exponential backoff\n`);

// Test API first
testAPIConnection().then(connected => {
  if (!connected) {
    console.error('\n⚠️  Skipping TTS generation due to API connection issues.');
    process.exit(1);
  }
  
  console.log('\n');
  generateTTSForKnowledgeBase()
    .then(() => {
      console.log('\n✨ TTS generation completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Fatal error:', error);
      process.exit(1);
    });
});
