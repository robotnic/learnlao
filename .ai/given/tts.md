# Text to speech is outside angular.

# Example code
import { createTTSRequest } from '@andresaya/edge-tts';
import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Converts Lao text to MP3 and saves it locally using Edge TTS.
 * @param text - The text to synthesize.
 * @param id - A unique ID for the filename.
 * @param gender - 'male' or 'female'.
 */
async function generateLaoAudio(
  text: string, 
  id: string, 
  gender: 'male' | 'female'
): Promise<void> {
  // Microsoft Edge TTS Voice Names for Lao (lo-LA)
  const voiceMap = {
    'female': 'lo-LA-KeotaNeural', // The standard female voice
    'male': 'lo-LA-ChanthavongNeural' // The standard male voice
  };
  
  const voiceName = voiceMap[gender];
  const fileName = `${id}_${gender}.mp3`;
  const outputPath = path.join(process.cwd(), 'apps', 'learnlao', 'src', 'assets', 'audio', fileName);

  try {
    const request = createTTSRequest({
      voice: voiceName,
      text: text,
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3'
    });
    
    // Get the audio buffer/blob data
    const audioBuffer = await request.pipe();
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    // Write the file to disk
    await fs.writeFile(outputPath, audioBuffer);
    
    console.log(`✅ Generated: ${fileName}`);
  } catch (error) {
    console.error(`❌ Failed for ${fileName}:`, error);
  }
}

// --- Example Usage ---
(async () => {
  const phrase = "ສະບາຍດີ"; // Hello
  
  // Generate the female version
  await generateLaoAudio(phrase, 'id123', 'female');
  
  // Generate the male version
  await generateLaoAudio(phrase, 'id123', 'male');
})();


# Implementation
Make stand alone script outside angular.
Loop over from knowledge_base.json
skip if soundfile exists
create 20 soundfiles per run