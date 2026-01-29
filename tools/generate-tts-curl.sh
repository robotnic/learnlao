#!/bin/bash

# TTS Generator using curl (proven to work)
# Parse JSON with Node.js to avoid jq dependency

set -e

# Check for API token
if [ -z "$APY_TOKEN" ]; then
    echo "❌ ERROR: APY_TOKEN environment variable not set!"
    echo "   Please set it with: export APY_TOKEN=\"your_token\""
    exit 1
fi

echo "🚀 Starting TTS generation with curl...\n"

# Configuration
MAX_FILES=20
API_URL="https://api.apyhub.com/tts/text/file"
KB_FILE="apps/learnlao/src/assets/knowledge_base.json"
AUDIO_DIR="apps/learnlao/src/assets/audio"

# Ensure audio directory exists
mkdir -p "$AUDIO_DIR"

# Use Node.js to extract and shuffle items from knowledge base
ITEMS_JSON=$(node -e "
const fs = require('fs');
const kb = JSON.parse(fs.readFileSync('$KB_FILE', 'utf8'));
const items = [];

// Add vocabulary
if (kb.vocabulary) {
  kb.vocabulary.forEach(v => {
    items.push({id: v.id, text: v.lao});
  });
}

// Add phrases
if (kb.phrases) {
  kb.phrases.forEach(p => {
    items.push({id: p.id, text: p.lao});
  });
}

// Shuffle
for (let i = items.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [items[i], items[j]] = [items[j], items[i]];
}

// Take first MAX_FILES
items.slice(0, $MAX_FILES).forEach(item => {
  console.log(item.id + '|' + item.text);
});
")

CREATED=0
SKIPPED=0
FAILED=0
COUNT=0

echo "🎯 Generating TTS for $(echo "$ITEMS_JSON" | wc -l) items\n"

# Process each item
echo "$ITEMS_JSON" | while IFS='|' read -r ID LAO; do
    COUNT=$((COUNT + 1))
    
    FILE="$AUDIO_DIR/${ID}_female.mp3"
    
    # Check if file exists
    if [ -f "$FILE" ]; then
        echo "⏭️  [$COUNT/$MAX_FILES] Skipped: $ID (already exists)"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    echo "🎤 [$COUNT/$MAX_FILES] Generating: $ID - \"$LAO\""
    
    # Call API using curl
    HTTP_CODE=$(curl -s -w "%{http_code}" -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "apy-token: $APY_TOKEN" \
        -d "{\"text\": \"$LAO\", \"language\": \"lo\", \"gender\": \"female\"}" \
        -o "$FILE" \
        --connect-timeout 10 \
        --max-time 120)
    
    if [ "$HTTP_CODE" = "200" ]; then
        if [ -f "$FILE" ]; then
            FILE_SIZE=$(stat -f%z "$FILE" 2>/dev/null || stat -c%s "$FILE" 2>/dev/null || echo "unknown")
            echo "   ✅ Success (HTTP $HTTP_CODE, size: $FILE_SIZE bytes)"
            CREATED=$((CREATED + 1))
        else
            echo "   ⚠️  Empty response (HTTP $HTTP_CODE)"
            FAILED=$((FAILED + 1))
        fi
    elif [ "$HTTP_CODE" = "403" ]; then
        echo "   ❌ Forbidden (HTTP 403) - Check API token or quota"
        rm -f "$FILE" 2>/dev/null
        FAILED=$((FAILED + 1))
    elif [ "$HTTP_CODE" = "429" ]; then
        echo "   ⏳ Rate limited (HTTP 429) - Increasing delay"
        rm -f "$FILE" 2>/dev/null
        FAILED=$((FAILED + 1))
        sleep 3  # Extra delay for rate limiting
    else
        echo "   ❌ Failed (HTTP $HTTP_CODE)"
        rm -f "$FILE" 2>/dev/null
        FAILED=$((FAILED + 1))
    fi
    
    # Rate limiting: 2-second delay between requests
    sleep 2
done

echo "\n📈 Summary:"
echo "   ✅ Created: $CREATED"
echo "   ⏭️  Skipped: $SKIPPED"
echo "   ❌ Failed: $FAILED"
echo "\n✨ TTS generation completed!"

