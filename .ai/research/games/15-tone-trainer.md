# Tone Trainer Game

## Overview
A specialized game for mastering Lao's 6 tones through audio recognition and production. Learners hear tone variations and must match, repeat, or identify the correct tone.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Tone Trainer • Focus: Tone ID        │
│ Accuracy: 76%   Streak: 1            │
├──────────────────────────────────────┤
│ 🔊 [Play A]   🔊 [Play B]              │
│ “Which one is higher / rising?”      │
├──────────────────────────────────────┤
│ Choices: (A) Tone 1  (B) Tone 2      │
│         (C) Tone 3  (D) Tone 4       │
├──────────────────────────────────────┤
│ Optional: [🎙️ Repeat]  Pitch hint: /  │
│ Feedback: ✅ Correct          [Next]  │
└──────────────────────────────────────┘
```

## Description
Lao has 6 distinct tones that change word meaning. This game makes tone learning interactive:
- **Recognition challenge:** Hear two words, pick which has the higher tone
- **Repetition:** Hear tone, repeat it, AI provides feedback
- **Memory game:** Match words to their tone patterns visually

**Target:** Desktop and mobile (with audio)

## Learning Benefits
- **Tone discrimination:** Essential for Lao learners; often the hardest skill
- **Auditory perception:** Trains ear to distinguish subtle pitch differences
- **Production practice:** Speaking aloud activates pronunciation pathways
- **Long-vowel/short-vowel connection:** Some tones related to vowel length

## Scientific Support
- Chirkova et al. (2012): Explicit tone training significantly improves recognition
- Bradlow et al. (1997): Phoneme discrimination training improves production
- Leather (1983): Native speakers use visual-auditory feedback for tone learning
- [Lao tones on Wikipedia](https://en.wikipedia.org/wiki/Lao_language#Phonology)

## Technical Implementation
- TTS (Web Speech API or cloud TTS) for generating tone variations
- Audio input recording (optional) for production challenge
- Pitch visualization (optional) showing tone contours
- Color coding for tone categories

## Gamification Elements
- 🎵 Tone mastery badges (one per tone)
- 📊 Accuracy percentage tracker
- 🎯 Challenge mode (10 tones in 60 seconds)
- 🔄 Adaptive difficulty based on performance

## Game Modes

### Mode 1: Tone Identification
- Hear word in different tone
- Choose correct tone from visual pattern
- Feedback: "That's tone 3 (high rising)"

### Mode 2: Tone Matching
- Hear reference word
- Choose matching tone from options
- Progressive difficulty

### Mode 3: Tone Production
- See tone pattern, hear reference
- Learner repeats
- Optional: Voice analysis (pitch tracking)

### Mode 4: Tone Memory
- Match 6 tone cards in memory game style
- Visual tone contours on cards
- Increasing grid size with difficulty

## Accessibility Notes
- Works best with external speakers/headphones
- Visual tone representation for visual learners
- Text labels for each tone
- Adjustable audio playback speed

## Cost Considerations
- TTS: Cost depends on volume (free quota ~500K characters/month with Google TTS)
- Audio recording: Client-side (free)
- Visualization: Client-side canvas (free)
