# Error Spotter Game

## Overview
Learners spot and fix **one intentional mistake** in Lao text: wrong character, wrong tone mark, wrong word, or wrong word order. This builds orthographic precision and grammar awareness.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Error Spotter • Type: Spelling       │
│ Accuracy: 70%   Streak: 0            │
├──────────────────────────────────────┤
│ Find the mistake:                    │
│   ຂອບໄຈ  (tap the wrong part)         │
├──────────────────────────────────────┤
│ Fix it: (A) ຂອບໃຈ   (B) ຂອບໄຈ          │
│ Explanation: (shown after submit)    │
├──────────────────────────────────────┤
│ [Submit] [Hint]              [Next]  │
└──────────────────────────────────────┘
```

## Description
The app shows a short prompt:
- a word (spelling error)
- a short phrase (wrong particle/register)
- a sentence (word-order error)

The learner must:
1. Identify the incorrect part (tap to highlight)
2. Choose the correction (multiple choice) or edit it
3. See explanation + correct model

**Target:** Desktop + mobile

## Learning Benefits
- **Noticing:** learners attend to form, not only meaning.
- **Orthographic stability:** improves recognition of correct spellings.
- **Grammar sensitivity:** reinforces word order and required particles.
- **Transfer:** error detection improves proofreading and reading accuracy.

## Scientific Support (Pointers)
- Schmidt (1990): noticing is important for acquisition.
- Long (1996): focus on form supports development when integrated in meaning tasks.
- Hattie & Timperley (2007): feedback is most effective when it is immediate and specific.

## Technical Implementation
- Each item stores:
  - `correctText`
  - `errorText`
  - `errorSpan` (start/end)
  - `errorType` (script/tone/spelling/grammar/register)
  - `explanation`
- UI supports highlight selection and either:
  - pick correction from options, or
  - edit inline (advanced)

## Gamification Elements
- 🕵️ “Detective” streaks
- ⭐ Bonus for first-try correct
- 📊 Mastery per error type

## Game Modes
### Mode 1: Spot Only
- Tap the wrong segment (no editing)

### Mode 2: Spot + Fix
- Pick the corrected form

### Mode 3: Edit Mode (Advanced)
- Keyboard edit (desktop) or guided edit (mobile)

## Content Fit
- **Character (C):** secondary (⚠️) for confusable script errors
- **Word (W):** strong fit (✅)
- **Phrase (P):** strong fit (✅)
