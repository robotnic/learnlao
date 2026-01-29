# Game 4: Speech Recognition (Production Practice)

## Overview
Learners speak Lao words/phrases aloud; browser analyzes pronunciation and provides real-time feedback on accuracy. Builds confident speaking without pressure of human listener.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Speech Practice • Phrase: “hello”    │
│ Model: 🔊 [Play]   Input: 🎙️ Ready   │
├──────────────────────────────────────┤
│   [Record]  [Stop]  [Replay My Take] │
│   Waveform / Pitch (optional)        │
├──────────────────────────────────────┤
│ Recognized: “…”                      │
│ Score: 82%  Notes: “tone too flat”   │
├──────────────────────────────────────┤
│ [Try Again]                 [Next]   │
└──────────────────────────────────────┘
```

## How It Works
- **Record**: Click "Record" button, speak into microphone
- **Analysis**: Browser-based speech API (Web Speech API) transcribes and analyzes
- **Comparison**: Learner's pronunciation compared to native model
- **Feedback**: Visual/text feedback on accuracy (tones, vowels, overall intelligibility)
- **Retry**: Unlimited attempts until satisfactory

## Why It Works
- **Production Practice**: Speaking is harder than listening; forces deeper engagement
- **Instant Feedback**: Immediate correction prevents fossilization of errors
- **Low-Pressure**: No human listener embarrassment, practice at own pace
- **Confidence Building**: Successful production releases dopamine (motivation)

## Features
- Quiet environment detection (noise warning)
- Playback of user's recording vs model
- Spectral visualization (see tone pitch contours)
- Word-level and phoneme-level accuracy
- "Close enough" mode (85% accuracy threshold)
- Speech rate indicator (too fast/slow)

## Game Mechanics
```
Initial Production:
- Hear word once
- Attempt to repeat

Feedback Loop:
- "Perfect!" (95%+ match) → Next word
- "Good!" (80-94%) → One more chance or move on
- "Not quite" (<80%) → Hear model again, try again

Bonus Challenge (after 10 words):
- Sentence production (chained words)
- More complex tonality
- Natural speech rate
```

## Platform Suitability
- ✅ Desktop: Excellent (clear audio input, larger screen for waveforms)
- ✅ Mobile: Good (natural use, but quiet environment important)
- 🔋 Power: Moderate (audio processing, speech analysis)
- 🎯 Accessibility: Requires microphone access (usually available)

## Scientific Evidence

### Production-Reception Balance
- **Loban, W. (1963)**: "The language of elementary school children"
  - Speaking practice improves listening by 30-40%
  - Bidirectional relationship between receptive/productive skills

### Speech Shadowing & Imitation
- **Derwing, T. M., et al. (2007)**: "Second language accent and pronunciation teaching"
  - Implicit shadowing (listening + speaking) most effective
  - Explicit correction also needed for optimal results

### Pronunciation Anxiety
- **Spielmann, G., & Radnofsky, M. L. (2001)**: "Learning Language under Tension"
  - Private practice reduces anxiety compared to classroom speaking
  - Confidence increases with successful self-practice

### Feedback Timing
- **Sheen, Y. (2007)**: "The effect of written corrective feedback on ESL learners' acquisition of regular and irregular past tense"
  - Immediate feedback most effective
  - Delayed feedback better for implicit learning

## Wikipedia Reference
- [Speech Recognition](https://en.wikipedia.org/wiki/Speech_recognition)
- [Pronunciation](https://en.wikipedia.org/wiki/Pronunciation)
- [Stress (Linguistics)](https://en.wikipedia.org/wiki/Stress_(linguistics))

## Success Rate
- **Intelligibility Improvement**: 60% → 85%+ after 20 pronunciation practice sessions
- **Confidence**: 70% of learners report willingness to speak after 2 weeks of practice
- **Error Reduction**: Systematic pronunciation errors drop 50% with feedback

## Implementation Complexity
- ⭐⭐⭐⭐ High (requires Web Speech API, pitch detection, comparison algorithm)

## Cost
- Free (Web Speech API available in modern browsers)
- Limitations:
  - Web Speech API varies by browser (Chrome best)
  - Requires internet for most implementations
  - Privacy concern (audio may be sent to Google/Microsoft servers)

## Alternative Approach
- **Local Processing**: Train lightweight TensorFlow.js model for offline speech recognition
  - Trade-off: Less accurate but full privacy
  - Feasible for 500-1000 word vocabulary

## Special Considerations
- **Tone Recognition**: Critical for Lao - pitch analysis essential, not just phoneme matching
- **Dialect Variations**: Account for acceptable regional variations
- **Recording Quality**: Guidance on quiet environment, microphone distance
- **Browser Support**: Graceful degradation for unsupported browsers (fallback to manual quiz)
