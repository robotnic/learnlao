import pkg from '@andresaya/edge-tts';
const { EdgeTTS, Constants } = pkg;
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_PATH = path.join(__dirname, '../apps/learnlao/src/assets/knowledge_base.json');
const AUDIO_DIR = path.join(__dirname, '../apps/learnlao/src/assets/audio');
const MAX_FILES = 20;

// Microsoft Edge TTS Voice Names for Lao (lo-LA)
const voiceMap = {
  female: 'lo-LA-KeomanyNeural',
  male: 'lo-LA-ChanthavongNeural'
};

/**
 * Converts Lao text to MP3 and saves it locally using Edge TTS.
 * @param {string} text - The text to synthesize.
 * @param {string} id - A unique ID for the filename.
 * @param {string} gender - 'male' or 'female'.
 */
async function generateLaoAudio(text, id, gender) {
  const voiceName = voiceMap[gender];
  const fileName = `${id}.mp3`;
  const outputPath = path.join(AUDIO_DIR, fileName);

  try {
    const tts = new EdgeTTS();
    
    // Use higher quality 96kbps format for better audio
    await tts.synthesize(text, voiceName, {
      outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
    });

    // Write to file
    const buffer = await tts.toBuffer();
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, buffer);

    // Get file size
    const stats = await fs.stat(outputPath);
    return { success: true, size: stats.size };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, size: 0 };
  }
}

async function main() {
  // Load knowledge base
  let kb;
  try {
    const data = await fs.readFile(KB_PATH, 'utf-8');
    kb = JSON.parse(data);
  } catch (error) {
    console.error(`❌ Failed to load knowledge base: ${error.message}`);
    process.exit(1);
  }

  // Collect all items (vocabulary + phrases)
  const allItems = [];

  // Add vocabulary
  if (kb.vocabulary && Array.isArray(kb.vocabulary)) {
    kb.vocabulary.forEach(word => {
      allItems.push({
        id: word.id,
        text: word.lao,
        type: 'vocabulary'
      });
    });
  }

  // Add phrases
  if (kb.phrases && Array.isArray(kb.phrases)) {
    kb.phrases.forEach(phrase => {
      allItems.push({
        id: phrase.id,
        text: phrase.lao,
        type: 'phrase'
      });
    });
  }

  if (allItems.length === 0) {
    console.error('❌ No vocabulary or phrases found in knowledge base');
    process.exit(1);
  }

  // Shuffle items
  for (let i = allItems.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
  }

  // Take first MAX_FILES
  const itemsToProcess = allItems.slice(0, MAX_FILES);

  console.log(`🎯 Generating TTS for ${itemsToProcess.length} items (female voices)\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < itemsToProcess.length; i++) {
    const item = itemsToProcess[i];
    const fileName = `${item.id}.mp3`;
    const filePath = path.join(AUDIO_DIR, fileName);

    // Check if file exists
    try {
      await fs.stat(filePath);
      console.log(`⏭️  [${i + 1}/${itemsToProcess.length}] Skipped: ${item.id} (already exists)`);
      skipped++;
      continue;
    } catch {
      // File doesn't exist, proceed
    }

    console.log(`🎤 [${i + 1}/${itemsToProcess.length}] Generating: ${item.id} - "${item.text}"`);

    const result = await generateLaoAudio(item.text, item.id, 'female');

    if (result.success) {
      console.log(`   ✅ Success (size: ${result.size} bytes)`);
      created++;
    } else {
      failed++;
    }

    // Rate limiting: 2-second delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n✨ TTS generation completed!`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
