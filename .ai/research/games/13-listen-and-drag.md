# Listen & Drag Game

## Overview
Learners hear a Lao word and must drag the correct image to a designated area, or match the word to its English translation. Combines listening comprehension with kinesthetic interaction.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Listen & Drag • Mode: Picture Match  │
│ Accuracy: 90%   Streak: 6            │
├──────────────────────────────────────┤
│ 🔊 [Play] [Slow] [Repeat]            │
│ “Drag the matching item”             │
├──────────────────────────────────────┤
│ Draggables: [🍚 rice] [💧 water] [👋]  │
│ Drop zone:  ┌─────────────────────┐ │
│            │     DROP HERE        │ │
│            └─────────────────────┘ │
├──────────────────────────────────────┤
│ Feedback: ✅ Correct          [Next] │
└──────────────────────────────────────┘
```

## Description
A word is spoken aloud (TTS). The learner must:
1. Listen to the pronunciation
2. Identify the correct visual representation (image/icon)
3. Drag it to the correct zone or match it

Could have variants:
- **Picture matching:** Drag image to label
- **Translation:** Drag English word to Lao word
- **Definition:** Drag definition to word
- **Categorization:** Drag word into category bucket

**Target:** Desktop (drag/drop) and mobile (tap pairs)

## Learning Benefits
- **Listening comprehension:** Strengthens auditory processing
- **Vocabulary association:** Visual + audio association improves memory
- **Kinesthetic learning:** Physical interaction engages motor pathways
- **Contextual meaning:** Images provide semantic anchors

## Scientific Support
- Paivio (1991): Dual coding theory - words + images remembered better than words alone
- Bird et al. (2015): Speech-paired images enhance vocabulary learning
- Mayer & Moreno (2003): Multimedia learning improves retention and transfer
- [Dual coding theory - Wikipedia](https://en.wikipedia.org/wiki/Dual_coding_theory)

## Technical Implementation
- Image/icon library for vocabulary
- TTS for word pronunciation
- Drag-and-drop interaction (or click-based matching)
- Visual feedback for correct/incorrect placement

## Gamification Elements
- 🎯 Accuracy percentage
- 🔥 Streak counter
- ⏱️ Speed bonus for fast matches
- 📊 Category progress (% of category mastered)

## Game Modes

### Mode 1: Picture Matching
- Hear word → Choose correct image from grid
- Larger grid with difficulty increase
- Progressive: 3 images → 6 images → 9 images

### Mode 2: Label Matching
- Drag images to labeled zones
- Feedback on placement
- Time-based scoring

### Mode 3: Translation Matching
- Hear word → Match to English translation
- Multiple correct answers shown (synonyms)
- Teaches nuances

### Mode 4: Category Matching
- Hear word → Drag to category bucket
- Learn word groupings
- Example: Food, Transport, Greetings

### Mode 5: Sequence Challenge
- Hear sequence of 3-5 words
- Arrange images in order heard
- Tests listening + memory

## Difficulty Levels
1. 3 options (easy selection)
2. 6 options (requires discrimination)
3. 9 options (challenging)
4. 12+ options (expert)

## Accessibility Notes
- Works with mouse or touch
- Large draggable targets
- Color-coded categories
- Text labels visible
- Audio replay button always available

## Cost Considerations
- TTS: Used for word pronunciation (cost depends on volume)
- Graphics: Small icons/images (can use emoji or simple SVG)
- Zero server cost (all client-side)
