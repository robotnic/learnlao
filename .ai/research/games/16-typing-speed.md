# Typing Speed Game

## Overview
Learners type Lao words as quickly and accurately as possible. Combines keystroke familiarity with vocabulary practice and builds typing fluency.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Typing Speed • 00:45 remaining       │
│ CPM: 92   Accuracy: 84%             │
├──────────────────────────────────────┤
│ Prompt:  ຂອບໃຈ                           │
│ Type:    [____________________]      │
├──────────────────────────────────────┤
│ Live feedback:  ຂ ✅  ອ ✅  …           │
├──────────────────────────────────────┤
│ [Enter=Submit]     [Skip]     [Next] │
└──────────────────────────────────────┘
```

## Description
Words appear one at a time. Learner must:
1. Read the Lao word (or its English equivalent)
2. Type it correctly in the Lao script
3. Press Enter to confirm
4. Next word appears immediately

Scoring based on accuracy and speed (CPM - characters per minute). Typing proficiency builds as vocabulary knowledge deepens.

**Target:** Desktop (requires keyboard)

## Learning Benefits
- **Keyboard familiarity:** Learns Lao keyboard layout (or input method)
- **Orthographic knowledge:** Spelling and written form mastery
- **Speed building:** From slow, deliberate typing to fluent input
- **Production practice:** Active generation of vocabulary
- **Working memory:** Holding word form while typing

## Scientific Support
- Kellogg (1996): Typing engages different cognitive processes than writing by hand
- Roothooft & Breeze (2016): Written production improves language learning
- Brysbaert et al. (2011): Faster orthographic processing correlates with reading fluency
- Ellis & Beaton (1993): Written repetition improves vocabulary retention

## Technical Implementation
- Lao keyboard support (browser-based input method)
- Character-by-character comparison for feedback
- Keystroke logging for speed calculation
- Error highlighting (missing/extra characters)
- Auto-suggest for difficult words (optional)

## Gamification Elements
- 🏃 Speed ranking (WPM/CPM)
- 🎯 Accuracy percentage
- 🔥 Accuracy streak (perfect words)
- 🏆 Personal best tracking
- ⭐ Difficulty-based scoring

## Game Modes

### Mode 1: Standard Sprint
- 60-second type as much as you can
- Words from current level
- Score: Correct words × Speed modifier

### Mode 2: Perfect Run
- Type 20 words with 100% accuracy
- Stop on first error
- Tests consistency and focus

### Mode 3: Timed Challenge
- Type specific word count (10, 20, 50)
- Track time taken
- Compete against personal best

### Mode 4: Category Speed
- All words from single category
- Keyboard familiarity builds
- Specialized vocabulary speed

### Mode 5: Mixed Difficulty
- Words from multiple levels
- Random order
- Tests adaptability

## Difficulty Levels
- **Beginner:** Short, simple words, no time pressure
- **Intermediate:** Mix of word lengths, 60-second timer
- **Advanced:** Complex words, harder keyboard combinations
- **Expert:** Rare words, punctuation, fast-paced

## Lao Input Method Considerations
- Browser must support Lao Unicode input
- May require third-party input method (Google Lao, Lao Keyboard, etc.)
- Mobile support limited (desktop-focused)

## Accessibility Notes
- Clear character-by-character feedback
- Visible error highlighting
- Keyboard shortcuts explained
- Adjustable font size

## Cost Considerations
- Zero external cost
- Graphics: Minimal
- TTS: Optional for word pronunciation (during feedback)
- All processing client-side
