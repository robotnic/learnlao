# Flashcard Sprint Game

## Overview
High-speed flashcard game with multiple choice answers. Learners are shown a word/image and race to select correct translation, definition, or related word before time runs out.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Flashcard Sprint • 00:18 remaining   │
│ Score: 240   Streak: 5              │
├──────────────────────────────────────┤
│ Card:  ຂອບໃຈ                           │
│ (or image)                            │
├──────────────────────────────────────┤
│ (A) hello   (B) thanks               │
│ (C) sorry   (D) goodbye              │
├──────────────────────────────────────┤
│ Feedback: ✅ +40 (fast)        [Next] │
└──────────────────────────────────────┘
```

## Description
Classic spaced repetition meets arcade-style gameplay. Each round:
1. Card flips showing Lao word or image
2. Four options appear (one correct, three plausible distractors)
3. Learner taps/clicks answer
4. Points awarded based on speed and accuracy
5. Next card immediately

**Target:** Desktop and mobile

## Learning Benefits
- **Spaced repetition:** Research-backed retention method
- **Active recall:** Retrieving from memory is stronger than recognition
- **Automaticity:** Speed building leads to fluency
- **Contextual learning:** Plausible wrong answers reinforce distinctions

## Scientific Support
- Karpicke & Roediger (2008): Spaced retrieval produces superior long-term retention
- Rohrer & Taylor (2007): Spacing practice intervals optimizes learning
- Bjork & Bjork (1992): Desirable difficulties improve retention
- [Spaced repetition - Wikipedia](https://en.wikipedia.org/wiki/Spaced_repetition)

## Technical Implementation
- Data-driven from vocabulary JSON
- Algorithm-based card selection (SRS algorithm optional)
- Timer/animation for speed element
- Point calculation based on accuracy + speed

## Gamification Elements
- 🏃 Speed rewards (bonus for fast answers)
- 🎯 Streak counter (consecutive correct)
- 🏆 Personal best score per session
- ⭐ Difficulty-based points (harder words = more points)

## Game Modes

### Classic Mode
- 60-second sprint
- Increasing difficulty (easier words first)
- Score: Correct × Speed Bonus

### Endless Mode
- Play until 3 wrong answers
- Progressive difficulty
- Track personal best score

### Category Mode
- Choose category (verbs, food, travel, etc.)
- Focus on specific domain vocabulary
- Level-based (Level 1-4)

### Challenge Mode
- Specific word count (10, 20, 50 words)
- Timed competition against personal best
- Leaderboard of own scores over time

## Difficulty Scaling
- Easy: Common words (top 100)
- Medium: Mixed (common + intermediate)
- Hard: Less frequent + recent words learned
- Expert: All words in database, scrambled order

## Accessibility Notes
- Large tap targets for mobile
- Clear visual feedback (correct/incorrect)
- Adjustable timer speed
- Audio feedback optional (bell for correct/buzz for incorrect)

## Cost Considerations
- Zero external cost
- Graphics: Minimal (just card animations)
- TTS: Optional (just for audio pronunciation option)
