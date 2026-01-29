# Shadowing Karaoke Game

## Overview
Learners practice **rhythm, timing, and pronunciation** by “shadowing” short Lao phrases: they listen and repeat in near real-time, with optional on-screen highlighting like karaoke.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Shadowing Karaoke • Speed: 1.0×      │
│ Fluency: 3-day streak                │
├──────────────────────────────────────┤
│ 🔊 [Play] [Slow] [Loop]               │
│ Karaoke text (highlights as audio):  │
│   ສະ-ບາຍ-ດີ  ເດີ (progress bar)       │
├──────────────────────────────────────┤
│ [🎙️ Record] [Stop] [Replay My Take]  │
│ Feedback: timing 82%  clarity 76%    │
├──────────────────────────────────────┤
│ [Try Again]                   [Next] │
└──────────────────────────────────────┘
```

## Description
A short phrase plays (native audio or high-quality TTS). The phrase is displayed and highlighted word-by-word (or syllable-by-syllable). The learner repeats:
- immediately after (classic shadowing), or
- simultaneously at low volume (advanced)

Feedback can be lightweight (self-check + replay) or advanced (ASR scoring).

**Target:** Desktop + mobile (best with headphones)

## Learning Benefits
- **Prosody + chunking:** trains natural timing and intonation, not just segment accuracy.
- **Fluency building:** reduces cognitive load by automating common phrase patterns.
- **Pronunciation repetition:** high-volume practice with immediate model available.

## Scientific Support (Pointers)
- Shadowing is widely used in interpreter training and L2 fluency practice; it emphasizes rapid auditory-motor mapping.
- Repeated, immediate imitation supports pronunciation development (see general work on perception-production links in L2 phonetics).

## Technical Implementation
- Audio playback with word-level timestamps (manual alignment or forced alignment later).
- Optional recording + playback for self-comparison.
- Optional Web Speech API / cloud ASR scoring.
- “Slow” mode and loop mode.

## Gamification Elements
- 🎤 Phrase streaks (no missed beats)
- 🥇 Timing badge (kept up with karaoke)
- 📈 Fluency meter (sessions per week)

## Game Modes
### Mode 1: Listen → Repeat
- Repeat after audio ends

### Mode 2: Karaoke Shadow
- Highlighted text guides timing

### Mode 3: Speed Ladder
- Same phrase at 0.75× → 1.0× → 1.15×

## Content Fit
- **Character (C):** not recommended (—)
- **Word (W):** secondary (⚠️) for short words
- **Phrase (P):** strong fit (✅)
