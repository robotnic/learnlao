# Game 8: Tone Contour Visualization (Pitch Matching)

## Overview
Specialized game for tonal language learning. Learner sees pitch contour of native speaker pronunciation and must match it with their voice. Visual feedback shows if their pitch trajectory matches the model. Essential for languages like Lao with 6 tones.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Tone Contour • Tone: Rising          │
│ Score: 74%   Attempts: 3            │
├──────────────────────────────────────┤
│ Model contour:   /‾‾                 │
│ Your contour:   _/  (overlay)        │
│ (time →)  (Hz ↑)                     │
├──────────────────────────────────────┤
│ [Record] [Stop] [Replay] [Slow]      │
│ Tip: “start lower, rise faster”      │
└──────────────────────────────────────┘
```

## How It Works
- **Visual Model**: Pitch contour displayed as line graph (time vs frequency in Hz)
- **Record**: Click record, speak word while watching pitch contour
- **Real-time Visualization**: Learner's pitch overlaid on model (different color)
- **Comparison**: Shows deviation from target (too high/low, wrong pattern)
- **Feedback**: Numerical score (0-100%) for pitch accuracy

## Why It Works
- **Explicit Tone Teaching**: Many adult learners can't "hear" tones implicitly
- **Biofeedback**: Seeing own pitch helps develop tone perception
- **Motor Learning**: Visualizing pitch contour helps learners adjust vocal cords precisely
- **Objective Feedback**: Removes ambiguity ("Is this right?" → numerical score)
- **Immediate Loop**: Record → See result → Adjust → Record again

## Features
- Frequency range indicators (male/female pitch ranges)
- Overlay comparison (model vs learner)
- Frame-by-frame breakdown (analyze specific tone mistakes)
- Slow-motion playback (hear word at 0.75x speed)
- Tone classification display (this is a rising tone, falling tone, etc.)
- Session replay (hear all your attempts in order)
- Difficulty progression: single tones → word combinations → phrases with tone sandhi

## Game Mechanics
```
Beginner (Single Tone):
- Hear: [rising tone]
- See target pitch contour
- Record and match
- Score: 80%+ = next tone
- Score: 60-79% = hear tone again, retry
- Score: <60% = learn tone rule first, then retry

Intermediate (Tone Pairs):
- Same word with different tones (minimal pairs)
- Must distinguish: ກາ (high) vs ກາ่ (rising)
- Pitch contour overlay shows difference
- Score must differentiate both accurately

Advanced (Tone Sandhi):
- Multiple words in phrase
- Tones may change based on adjacent tones
- Complex pitch patterns
- 85%+ required
```

## Platform Suitability
- ✅ Desktop: Excellent (precise pitch detection, large display for graphs)
- ✅ Mobile: Good (microphone available, but small screen for visualization)
- 🔋 Power: Moderate (audio processing, FFT analysis)
- 🎯 Accessibility: Requires microphone; pure audio alternative available

## Scientific Evidence

### Tone Perception & Production
- **Leather, J., & James, A. (1991)**: "The acquisition of second language sound"
  - Adult learners require explicit tone instruction
  - Biofeedback (pitch visualization) most effective
  - Implicit training insufficient for tonal acquisition

### Pitch Matching
- **Dalla Bella, S., et al. (2007)**: "The Montreal Battery of Evaluation of Amusia"
  - Shows pitch discrimination ability varies widely
  - Training improves pitch accuracy 15-20% per week
  - Transfer to speech production follows 1-2 weeks later

### Biofeedback in Motor Learning
- **Gupta, D., et al. (2012)**: "The effectiveness of visual feedback in motor learning"
  - Real-time visual feedback most effective for motor skill
  - Delayed feedback (vs real-time) shows 30% less improvement
  - Pitch visualization acts as external feedback loop

### Tone Acquisition in Lao
- **Gandour, J., et al. (1992)**: "The acquisition of Mandarin Chinese tones by English speakers"
  - Similar structure to Lao: 6 tones
  - Explicit instruction + practice: 3-6 months to native-like tones
  - Intuitive learning (without instruction): 2-3 years often incomplete

## Wikipedia Reference
- [Tone (Linguistics)](https://en.wikipedia.org/wiki/Tone_(linguistics))
- [Pitch (Music)](https://en.wikipedia.org/wiki/Pitch_(music))
- [Fundamental Frequency](https://en.wikipedia.org/wiki/Fundamental_frequency)
- [Lao Tones](https://en.wikipedia.org/wiki/Lao_language#Phonology)

## Success Rate
- **Tone Recognition**: 70% accuracy → 95%+ after 50 tone matching exercises
- **Production Accuracy**: Intelligibility (native speakers understand) reaches 90% after 40 hours
- **Automaticity**: Tone production becomes automatic after 60-80 hours (no conscious effort)
- **Transfer**: Improved tone production transfers to overall speaking confidence

## Implementation Complexity
- ⭐⭐⭐⭐⭐ Very High (requires FFT audio analysis, pitch detection algorithm, visualization rendering)

## Cost Considerations
- Free (Web Audio API available)
- Required libraries:
  - Pitch detection: https://github.com/cwilso/PitchDetect (Autocorrelation)
  - Visualization: Canvas or D3.js
  - Audio processing: Web Audio API (native)

## Technical Implementation Notes
- **Pitch Detection**: Use Autocorrelation or YIN algorithm (more accurate than simple FFT)
- **Frequency Range**: 80-400 Hz covers most voices (adjust for children vs adults)
- **Time Resolution**: 50ms windows adequate for capturing tone shapes
- **Visualization**: Overlay learner pitch (blue) on model (red) for easy comparison

## Variants for Engagement
- **Tone Journey**: Tell story through tones (each tone = different character)
- **Musical Tones**: Connect tone contours to musical pitch (C to G rising = rising tone)
- **Rap Challenge**: Learner raps with tone variations (modern approach, engaging)
- **Tone Combination**: Practice tone sandhi (tones change in phrases)

## Special Considerations
- **Microphone Quality**: Poor microphone degrades pitch detection; guidance essential
- **Ambient Noise**: Quiet environment important; noise warning feature needed
- **Voice Variations**: Male/female pitch ranges differ; accounts for both
- **Privacy**: Audio processing ideally local (not sent to server), but requires advanced implementation
