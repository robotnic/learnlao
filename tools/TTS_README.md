# Text-to-Speech (TTS) Generator

This script generates MP3 audio files for Lao vocabulary and phrases using the ApyHub API.

## Setup

### 1. Get API Token

1. Sign up at [ApyHub](https://apyhub.com)
2. Get your API token from the dashboard
3. Add it to your environment variables

### 2. Set Environment Variable

```bash
export APY_TOKEN="your_api_token_here"
```

Or create a `.env` file in the project root:

```
APY_TOKEN=your_api_token_here
```

Then load it before running:

```bash
source .env
npm run generate-tts
```

## Usage

### Generate TTS for Random 20 Items

```bash
npm run generate-tts
```

This will:
- Load the knowledge base (vocabulary and phrases)
- Randomly select 20 items
- Skip items that already have audio files
- Generate MP3 files for each item
- Save them to `apps/learnlao/src/assets/audio/`

### Features

- **Smart Skipping**: Checks if audio file already exists before generating
- **Rate Limiting**: 1-second delay between requests to avoid API throttling
- **Random Selection**: Processes 20 random items each run (great for incremental generation)
- **Progress Tracking**: Shows detailed progress and summary statistics
- **Error Handling**: Gracefully handles failures and continues with other items

## Output

Files are saved as: `{id}_{gender}.mp3`

Example:
- `sabaidee_01_female.mp3`
- `ph_01_female.mp3`

## Script Details

The script generates TTS files with:
- **Language**: Lao (lo)
- **Gender**: Female (default, can be modified)
- **Format**: MP3

## Tips

- Run the script multiple times to incrementally generate audio for more items
- Each run processes a random set of 20 items, ensuring diverse coverage
- Existing files are automatically skipped, so it's safe to re-run
- Monitor API usage in your ApyHub dashboard to avoid hitting limits

## Troubleshooting

### Missing APY_TOKEN

```
Error: Missing APY_TOKEN environment variable
```

Make sure your API token is set:
```bash
export APY_TOKEN="your_token"
npm run generate-tts
```

### API Errors

If you get HTTP errors like 401 or 403, check:
- Your API token is correct
- Your account has active credits/subscription
- The token is being passed correctly

### Slow Generation

The script intentionally adds 1-second delays between requests. For faster generation with ApyHub's rate limits, you could increase concurrent requests, but be mindful of API limits.
