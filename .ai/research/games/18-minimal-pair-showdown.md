# Minimal Pair Showdown Game

## Overview
A fast, competitive variant of Listening Discrimination focused on **minimal pairs** (phoneme and tone contrasts). Learners identify which of two options matches the audio, under time pressure.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Minimal Pair Showdown • 00:09        │
│ Score: 120   Streak: 3              │
├──────────────────────────────────────┤
│ 🔊 [Play] [Slow]                     │
│ “Pick the match”                     │
├──────────────────────────────────────┤
│ (A) ກາ        (B) ກ່າ                  │
│  RT bonus: +12 if < 1.0s             │
├──────────────────────────────────────┤
│ Feedback: ✅ “tone contrast”   [Next] │
└──────────────────────────────────────┘
```

## Description
Each round:
1. Play audio (single word or short phrase)
2. Show **two** (or four) options that are confusable (tone/phoneme minimal pairs)
3. Learner picks the match
4. Immediate feedback + replay + “why it’s different” hint

**Target:** Desktop + mobile (tap/click)

## Learning Benefits
- **Perceptual tuning:** repeated exposure improves discrimination of hard contrasts.
- **Attention focusing:** learners learn which acoustic cue matters (tone contour, vowel length, consonant voicing).
- **Confidence building:** quick wins early, then increasing difficulty.

## Scientific Support (Pointers)
- Lively, Logan & Pisoni (1993): high-variability phonetic training improves L2 perception.
- Bradlow et al. (1997): perceptual training can generalize to production.
- Goldstone (1998): perceptual learning improves category sensitivity.

## Technical Implementation
- Audio sets with minimal-pair metadata:
  - `targetId`, `distractorIds[]`, `contrastType` (tone/phoneme/vowel-length)
  - multiple speakers to avoid overfitting
- Optional “slow” playback and repeat.
- Adaptive scheduling: missed contrasts appear more often.

## Gamification Elements
- ⚡ Reaction-time bonus
- 🔥 Streak multiplier
- 🏆 “Tone Hunter” / “Sound Sniper” badges
- 🎯 Accuracy + speed combo score

## Game Modes
### Mode 1: Two-Choice Duel
- Fastest and simplest

### Mode 2: Four-Choice Arena
- Harder; uses closer distractors

### Mode 3: Contrast Focus
- Only one contrast type (e.g., tones)

## Content Fit
- **Character (C):** secondary (⚠️) when options are script-only and learners map sound→script
- **Word (W):** strong fit (✅)
- **Phrase (P):** secondary (⚠️) for short fixed expressions
