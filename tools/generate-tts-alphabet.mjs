import pkg from '@andresaya/edge-tts';
const { EdgeTTS, Constants } = pkg;
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KB_PATH = path.join(__dirname, '../apps/learnlao/src/assets/knowledge_base.json');
const AUDIO_DIR = path.join(__dirname, '../apps/learnlao/src/assets/audio');

// Microsoft Edge TTS Voice Names for Lao (lo-LA)
const voiceMap = {
  female: 'lo-LA-KeomanyNeural',
  male: 'lo-LA-ChanthavongNeural'
};

async function generateLaoAudio(text, id, gender) {
  const voiceName = voiceMap[gender];
  const fileName = `${id}_${gender}.mp3`;
  const outputPath = path.join(AUDIO_DIR, fileName);

  try {
    const tts = new EdgeTTS();
    await tts.synthesize(text, voiceName, {
      outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
    });

    const buffer = await tts.toBuffer();
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, buffer);

    const stats = await fs.stat(outputPath);
    return { success: true, size: stats.size };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, size: 0 };
  }
}

async function main() {
  let kb;
  try {
    const data = await fs.readFile(KB_PATH, 'utf-8');
    kb = JSON.parse(data);
  } catch (error) {
    console.error(`❌ Failed to load knowledge base: ${error.message}`);
    process.exit(1);
  }

  const alphabet = kb.alphabet || [];
  
  if (alphabet.length === 0) {
    console.log('ℹ️  No alphabet found in knowledge base');
    process.exit(0);
  }

  console.log(`🎯 Generating TTS for Alphabet (${alphabet.length} items - male & female voices)\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < alphabet.length; i++) {
    const item = alphabet[i];

    for (const gender of ['male', 'female']) {
      const fileName = `${item.id}_${gender}.mp3`;
      const filePath = path.join(AUDIO_DIR, fileName);

      try {
        await fs.stat(filePath);
        skipped++;
        continue;
      } catch {
        // File doesn't exist, proceed
      }

      const text = item.lao || '';
      // Remove markdown-like characters for vowels like "◌ະ"
      const cleanText = text.replace(/◌/g, '').trim();
      
      if (!cleanText) {
        console.log(`⏭️  [${i + 1}/${alphabet.length}] Skipped: ${item.id} (empty text)`);
        skipped++;
        continue;
      }

      console.log(`🎤 [${i + 1}/${alphabet.length}] ${gender.toUpperCase()}: ${item.id} - "${item.name}"`);

      const result = await generateLaoAudio(cleanText, item.id, gender);

      if (result.success) {
        console.log(`   ✅ Success (${result.size} bytes)`);
        created++;
      } else {
        failed++;
      }

      // Rate limiting: 2-second delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`   ✅ Created: ${created}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`\n✨ Alphabet TTS generation completed!`);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
