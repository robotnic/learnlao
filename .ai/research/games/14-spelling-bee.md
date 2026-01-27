# Spelling Bee Game

## Overview
Learner hears a word and must select the correct spelling from multiple Lao script options. Tests orthographic knowledge and character recognition.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Spelling Bee • Round 3/10            │
│ Accuracy: 88%   Streak: 2            │
├──────────────────────────────────────┤
│ 🔊 [Play] [Slow] [Repeat]            │
│ “Pick the correct spelling”          │
├──────────────────────────────────────┤
│ (A) ຂອບໃຈ   (B) ຂອບໄຈ                  │
│ (C) ຂອບໃຈ້   (D) ຂອບໃຈຍ                 │
├──────────────────────────────────────┤
│ Feedback: ❌ “tone mark misplaced”    │
│ [Explain]                    [Next] │
└──────────────────────────────────────┘
```

## Description
A word is pronounced aloud (TTS or native audio). Learner must:
1. Listen to the word carefully
2. Select the correct spelling from 4 options
3. Receive immediate feedback
4. Progress through word list
5. Build streak and improve accuracy

Differs from typing in that recognition is tested (not production), making it more accessible for mobile users.

**Target:** Desktop and mobile (tap/click)

## Learning Benefits
- **Orthographic knowledge:** Recognizes correct spelling patterns
- **Character recognition:** Distinguishes similar characters
- **Sound-symbol mapping:** Connects pronunciation to written form
- **Tone marking:** Recognizes how tones are marked in writing
- **Vocabulary expansion:** Encounters diverse word forms

## Scientific Support
- Perfetti et al. (1988): Orthographic knowledge supports reading fluency
- Ehri (2014): Development of orthographic knowledge progresses through stages
- Katz & Frost (1992): Orthographic transparency affects spelling learning
- Share (1995): Self-teaching mechanism links phonology and orthography

## Technical Implementation
- Audio playback (TTS or pre-recorded)
- Multiple choice options (4 variations of spelling)
- Real-time feedback on selection
- Progress tracking per difficulty level
- Difficulty-based word selection

## Gamification Elements
- 🎯 Accuracy percentage
- 🔥 Streak counter
- ⭐ Stars for perfect rounds
- 📊 Spelling skill level progression
- 🏆 Spelling difficulty badges

## Game Modes

### Mode 1: Easy Recognition
- Hear word
- 4 very different spelling options
- Common, high-frequency words
- Standard pace

### Mode 2: Challenge Recognition
- Hear word
- 4 subtly different options
- Tests fine discrimination
- Faster pace

### Mode 3: Category Spelling
- All words from one category
- Related words shown together
- Builds domain-specific orthography

### Mode 4: Speed Round
- 60-second sprint
- As many words as possible
- Increasing difficulty

### Mode 5: Tone Challenge
- Focus on tone marking in spelling
- Contrasts words differing only in tone mark
- Critical for Lao orthography

## Difficulty Levels
- **Beginner:** Common words, obvious wrong options, slow playback
- **Intermediate:** Mixed frequency, similar-looking wrong options, normal speed
- **Advanced:** Less common words, subtle differences, fast playback
- **Expert:** Rare words, multiple correct tone marks possible, natural speech speed

## Spelling Variation Types
- **Tone marks:** Same word, different tone marks
- **Similar characters:** 6 vs 9 look-alike, ກ vs ກ
- **Vowel length:** Short vs long vowel marks
- **Double marks:** When multiple marks possible
- **Rare variations:** Different historical spellings

## Accessibility Notes
- Large, clear text for spelling options
- Audio replay button (unlimited replays)
- Slow/normal/fast playback speed options
- Keyboard shortcuts for quick selection
- Visual isolation of each spelling option

## Cost Considerations
- TTS: For word pronunciation (cost depends on volume)
- Graphics: Minimal (just text options)
- Audio: Can use free TTS or curate native speaker recordings
- All processing client-side
