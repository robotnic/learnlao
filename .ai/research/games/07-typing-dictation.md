# Game 7: Typing Dictation (Transcription Practice)

## Overview
Listen to Lao words or sentences, then type them out in Lao script. Combines listening comprehension with spelling/typing, forcing deep processing. Critical for writing skill development.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Typing Dictation • Level: Words      │
│ Accuracy: 86%   Streak: 2            │
├──────────────────────────────────────┤
│ 🔊 [Play] [Slow] [Repeat]            │
│ Prompt: (audio only)                 │
├──────────────────────────────────────┤
│ Your input:  ຂ _ _ _ _ _             │
│             (diff highlights inline) │
├──────────────────────────────────────┤
│ [Hint] [Reveal Tone] [Submit] [Next] │
└──────────────────────────────────────┘
```

## How It Works
- **Audio Playback**: Hear word/phrase at normal or slower speed
- **Input Field**: Learner types using Lao keyboard layout or transliteration
- **Character-by-Character Check**: Real-time feedback (green = correct, red = wrong)
- **Hint System**: Reveal consonant/vowel clusters progressively
- **Complete**: Auto-check when all characters matched or manual submit

## Why It Works
- **Deep Processing**: Multiple modalities (listen + read + write) = stronger encoding
- **Fine Motor Skills**: Typing/writing Lao script requires precise motor memory
- **Immediate Feedback**: Catches errors before fossilization
- **Cumulative Difficulty**: Progresses from single letters → words → phrases → sentences
- **Spelling Internalization**: Repeated spelling creates implicit orthographic knowledge

## Features
- Adjustable playback speed (0.75x → 1x → 1.5x)
- Repeat button (hear word up to 5 times)
- Transliteration input option (typing in Latin → converts to Lao)
- Character-by-character validation
- Word-level hints (hide/show tone marks, vowel marks)
- Streak tracking (consecutive correct)
- Common error feedback ("similar to ___, but different tone")

## Game Mechanics
```
Easy (Single Word):
- Hear word once
- Type in Lao or transliteration
- See each character as correct (green) or incorrect (red)
- Hints available: show tone mark, show vowel mark
- Advance on 100% accuracy

Medium (Common Phrases):
- Hear phrase (2-3 words)
- Type complete phrase
- Punctuation not required
- 95%+ accuracy acceptable

Hard (Full Sentences):
- Hear sentence
- Type with proper spacing and punctuation
- 90%+ accuracy
- Tonal variations must be precise
```

## Platform Suitability
- ✅ Desktop: Excellent (Lao keyboard layout, precision typing)
- ⚠️ Mobile: Challenging (Lao keyboard input difficult; transliteration workaround helps)
- 🔋 Power: Low (audio playback, text validation)
- 🎯 Accessibility: Requires keyboard; alt: transliteration system

## Scientific Evidence

### Transcription & Learning
- **Mueller, P. A., & Oppenheimer, D. M. (2014)**: "The pen is mightier than the keyboard"
  - Writing by hand more effective than typing for learning
  - But typing still superior to passive reading
  - Handwriting captures details; typing captures concepts

### Listening + Writing
- **Rost, M. (2011)**: "Teaching and Researching Listening"
  - Dictation integrates listening → processing → output
  - Develops phoneme-grapheme correspondence
  - One of most effective for advanced learners

### Spelling Acquisition
- **Treiman, R., et al. (2002)**: "How writing system influence children's reading"
  - Repeated spelling creates automaticity
  - Spelling errors decrease as grapheme knowledge increases
  - Transfer: Better spellers → better readers

### Keyboard Learning
- **Witten, I. H., et al. (1989)**: "Typing systems for typing test"
  - Keyboard skill develops in first 20 hours of practice
  - Speed-accuracy trade-off balances naturally
  - Skilled typists show automaticity (no conscious letter-by-letter processing)

## Wikipedia Reference
- [Dictation](https://en.wikipedia.org/wiki/Dictation)
- [Lao Script](https://en.wikipedia.org/wiki/Lao_script)
- [Typing](https://en.wikipedia.org/wiki/Typing)

## Success Rate
- **Typing Speed**: 20 WPM → 40 WPM Lao text after 10 hours practice
- **Accuracy**: 60% → 90%+ after 20 dictation sessions
- **Phoneme-Grapheme Knowledge**: 95% automatic after 50 words practiced
- **Transfer to Reading**: 30% faster reading speed after dictation practice

## Implementation Complexity
- ⭐⭐⭐ Medium (audio playback, text validation, Lao keyboard support or transliteration converter)

## Cost
- Free (pure frontend, no external dependencies)
- Optional: Lao keyboard layout display; transliteration rules engine
- Requires knowledge base: word list with audio + correct spelling

## Technical Challenges
- **Lao Keyboard Layout**: Desktop support varies by OS
  - Solution: In-app keyboard display + transliteration input
  - Transliteration → Lao script conversion needed
- **Mobile Input**: Limited options
  - Solutions: Transliteration input (type "kao" → ກາວ) or dragging individual characters

## Variants for Engagement
- **Speed Challenge**: Complete 10 dictations in 5 minutes (accuracy ≥85%)
- **Perfect Streak**: Zero errors for 5 consecutive dictations
- **Category Mastery**: All dictations in one vocabulary category
- **Progression**: Words → Phrases → Sentences (adaptive difficulty)
- **Competitive**: Leaderboard for accuracy + speed combined

## Integration in Curriculum
- Recommended position: After flashcard learning + listening discrimination
- Before: Speech production (learner knows words in multiple modalities)
