# Fill in the Blank Game

## Overview
Learners complete sentences by selecting the correct word from options. Tests vocabulary understanding in context and encourages reading comprehension.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Fill in the Blank • Level: 2         │
│ Accuracy: 81%   Streak: 3            │
├──────────────────────────────────────┤
│ ຂ້ອຍ ____ ເຂົ້າ                         │
│ “I ____ rice.”                       │
├──────────────────────────────────────┤
│ (A) ກິນ    (B) ໄປ                      │
│ (C) ນອນ    (D) ມາ                      │
├──────────────────────────────────────┤
│ [Check]  Hint: (optional)     [Next] │
└──────────────────────────────────────┘
```

## Description
A sentence in Lao is shown with one or more blanks. Learner must:
1. Read the sentence carefully
2. Understand context and grammar
3. Select correct word from 4 options to fill blank
4. Receive feedback

Sentences progress from simple to complex, and from high-frequency to less-frequent vocabulary.

**Target:** Desktop and mobile

## Learning Benefits
- **Contextual learning:** Words learned in meaningful sentences, not isolation
- **Reading comprehension:** Develops sentence-level understanding
- **Grammar intuition:** Implicit learning of grammatical patterns
- **Word discrimination:** Context helps distinguish similar words
- **Functional knowledge:** See how words are actually used

## Scientific Support
- Nation & Newton (2009): Learning from context is most common learning mode
- Schmitt & Meara (1997): Extensive reading with context improves vocabulary retention
- Shu et al. (1995): Learners can acquire vocabulary through context
- Hulstijn (1992): Inferring meaning from context is powerful learning strategy
- [Contextual learning - Wikipedia](https://en.wikipedia.org/wiki/Contextual_learning)

## Technical Implementation
- Curated sentence library (from language JSON)
- Difficulty ranking of sentences
- Distractors: plausible but wrong (same word type, similar meaning, or grammatically wrong)
- Sentence highlighting for emphasis

## Gamification Elements
- ⭐ Stars for correct answer on first try
- 🔥 Streak for consecutive correct
- 📊 Reading level progression (Level 1-4)
- 🎯 Accuracy tracking per word type

## Game Modes

### Mode 1: Single Blank
- One word missing per sentence
- 4 options
- Simple sentences (high-frequency words)

### Mode 2: Multiple Blanks
- 2-3 words missing per sentence
- More complex sentence structure
- Tests global comprehension

### Mode 3: Category Focus
- Only sentences from specific domain (food, travel, etc.)
- Related vocabulary reinforced
- Contextual learning

### Mode 4: Progressive Reading
- Story told across 5-10 sentences
- Build narrative understanding
- Same characters/situations throughout

### Mode 5: Challenge Mode
- Remove 1-2 options
- Stricter time limit
- Higher scoring

## Difficulty Progression
- **Beginner:** Common words, simple sentences, 4 very different options
- **Intermediate:** Mix of common/uncommon, 5-7 word sentences, 3-4 similar options
- **Advanced:** Complex sentences, rare words, subtle distinctions in options
- **Expert:** Idioms, cultural references, minimal context clues

## Sentence Construction Tips
- Use real sentences from natural Lao text
- Include cultural context
- Represent tones properly in written form
- Balance sentence length with difficulty

## Accessibility Notes
- Large text for readability
- Clear visual separation of options
- Highlightable words for context
- Audio pronunciation option for unknown words

## Cost Considerations
- Zero cost (all client-side)
- Optional TTS for word pronunciation
- Requires quality sentence database (human curated)
