# Learning Units Structure & Curriculum Design

## Research: Best Practices in Learning Structure

### 1. Cognitive Load Theory (CLT)
- **Principle**: Learners have limited working memory capacity
- **Application**: Break complex content into smaller chunks (atomic units)
- **Implication**: Aim for 3-5 new items per activity; phrase-based lessons can introduce more items, but keep *new* items per activity constrained

### 2. Spaced Repetition
- **Principle**: Spacing learning sessions improves long-term retention
- **Evidence**: Optimal spacing follows exponential curve (1 day, 3 days, 1 week, 2 weeks, 1 month)
- **Application**: Structure activities to revisit previously learned items

### 3. Progressive Complexity
- **Principle**: Move from recognition → production → application
- **Bloom's Taxonomy**: Remember → Understand → Apply → Analyze → Evaluate → Create
- **Language Learning**: Alphabet → Words → Phrases → Sentences → Conversation

### 4. Interleaving
- **Principle**: Mix different topics/difficulty levels rather than blocking
- **Evidence**: Better transfer and discrimination of concepts
- **Application**: Combine alphabet, tone, and basic vocabulary items

### 5. Retrieval Practice
- **Principle**: Testing effect improves memory more than restudying
- **Application**: Every activity should require active recall, not passive exposure

---

## Learning Unit Structure (Recommended)

### Hierarchy

```
LEVEL (1-4)
  └─ LESSON (5-8 lessons per level)
      └─ ACTIVITY (3-4 activities per lesson)
          └─ FACT (1-5 facts per activity)
              └─ Knowledge Base Item (Char/Word/Phrase)
```

### Definition

**FACT**: Smallest learning unit
- 1 Lao character + pronunciation rules
- 1 word + IPA pronunciation + English meaning
- 1 phrase + context of use

**ACTIVITY**: Interleaved practice targeting a specific skill
- Types: Recognition, Recall, Production, Discrimination
- ~5-15 minutes
- Contains 3-5 facts
- Includes spaced repetition of previous items

**LESSON**: Coherent thematic unit combining activities
- Theme: alphabet, daily conversations, food, etc.
- 45-60 minutes total (4-5 sessions × 12-15 min)
- Mix new content (50%) + review (50%)
- Achieves 1-2 learning objectives

**LEVEL**: Proficiency milestone
- Level 1: Can recognize and name alphabet & basic greetings
- Level 2: Can understand and produce basic sentences
- Level 3: Can navigate survival situations
- Level 4: Can engage in extended conversations

---

## High-Level JSON (Curriculum Structure)

This is an example “source of truth” payload that defines curriculum structure at a high level.

```json
{
    "schemaVersion": "1.0",
    "curriculum": {
        "id": "lao-curriculum",
        "name": "Lao Language Curriculum",
        "targetCefr": "A1",
        "unitHierarchy": [
            "path",
            "level",
            "lesson",
            "activity",
            "fact",
            "knowledgeItem"
        ],
        "romanization": {
            "scheme": "TBD",
            "notes": "Pick one scheme and apply globally; until then, mark uncertain items with needsVerification=true."
        },
        "spacedRepetition": {
            "recommendedIntervalsDays": [1, 3, 7, 14, 30],
            "withinLessonSessionMix": [
                { "session": 1, "newPercent": 50, "reviewPercent": 50 },
                { "session": 2, "newPercent": 40, "reviewPercent": 60 },
                { "session": 3, "newPercent": 20, "reviewPercent": 80 },
                { "session": 4, "newPercent": 10, "reviewPercent": 90 }
            ]
        },
        "awards": {
            "masteryThresholds": {
                "fact": { "accuracyPercent": 80, "sessions": 3 },
                "activity": { "accuracyPercent": 85 },
                "lesson": { "allActivitiesCompleted": true },
                "level": { "avgAccuracyPercent": 90 }
            },
            "displayLogic": {
                "inProgressPath": "showLevelMedals",
                "completedPath": "showPathMedalOnly"
            }
        },
        "paths": [
            {
                "id": "path-1",
                "name": "Foundations (Transliteration & Survival)",
                "scriptMode": "romanized",
                "completionMedal": "🎖️",
                "levels": [
                    {
                        "id": "1.1",
                        "name": "Greetings & Survival Essentials",
                        "estimatedDurationMinutes": 135,
                        "prerequisites": [],
                        "lessons": [
                            {
                                "id": "1-1-1",
                                "title": "Greetings & Politeness",
                                "estimatedDurationMinutes": 45,
                                "topics": [
                                    { "text": "sabaidee", "type": "phrase" },
                                    { "text": "khop jai", "type": "phrase", "needsVerification": true },
                                    { "text": "la kon", "type": "phrase", "needsVerification": true }
                                ],
                                "activityTypes": [
                                    "flashcards",
                                    "listening-discrimination",
                                    "speech-recognition",
                                    "quiz"
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
}
```

---

## Award System Alignment

### Progress Tracking at Each Level

| Unit Type | Mastery Threshold | Award Trigger |
|-----------|-------------------|---------------|
| FACT | 80%+ accuracy in 3 sessions | Progress bar |
| ACTIVITY | 85%+ average accuracy | Lesson badge |
| LESSON | All activities completed | Medal (Silver/Gold) |
| LEVEL | 90%+ average across all lessons | Level unlock + Trophy |

### Streak Mechanics
- **Daily Streak**: Complete ≥1 activity per day
- **Accuracy Streak**: 3+ consecutive activities at 85%+
- **Milestone**: 7-day streak = Special medal

---

## Lao Language Curriculum: 5 Learning Paths (30 Lessons)

### Curriculum Structure: 5 Modular Paths

Each path is self-contained and earns a single completion medal 🎖️ (or 💎 for final path).  
While in progress on a path, level medals are shown individually.  
Completed paths display only the path medal.

**Note on topic lists**: The “Topics” columns below are illustrative and must be verified (script + romanization) before being treated as canonical learning content.

---

# 📘 PATH 1: Foundations (Transliteration & Survival) | 2 Levels

## LEVEL 1.1 | Greetings & Survival Essentials
**Goal**: Greet, ask for help, say basic needs (no script)  
**Duration**: ~2 hours | **Script**: Romanized only

| # | Lesson Title | Topics (Transliteration) | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 1.1.1 | Greetings & Politeness | sabaidee, khop jai, la kon | 45 min | ⚀ |
| 1.1.2 | Numbers 1-10 | (romanized 1–10; verify spelling scheme) | 45 min | ⚁ |
| 1.1.3 | Survival Phrases | bo dai, bo ao, khop jai | 45 min | ⚂ |

---

## LEVEL 1.2 | Daily Interactions & Family
**Goal**: Order food, ask directions, introduce self  
**Duration**: ~2 hours | **Script**: Romanized only

| # | Lesson Title | Topics (Transliteration) | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 1.2.1 | Food & Drink | khao, nam, gai, pa, som tam | 45 min | 1🎖️ ⚀ |
| 1.2.2 | At Restaurant | khor..., boe sai..., hoy bin | 45 min | 1🎖️ ⚁ |
| 1.2.3 | Family & Basic Verbs | po, me, pee, nong, pai, ma | 45 min | 1🎖️ |

**PATH 1 COMPLETE**: 🎖️

---

# 📗 PATH 2: Script Mastery (Lao Script Introduction) | 2 Levels

## LEVEL 2.1 | Consonants & Syllables
**Goal**: Recognize Lao consonants, read simple syllables  
**Duration**: ~2 hours | **Script**: Romanization + Lao script

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 2.1.1 | Consonants: High & Mid Class | ຂ kh, ຫ h, ຟ f, ກ g, ບ b | 45 min | 1🎖️ ⚀ |
| 2.1.2 | Consonants: Low Class | ຄ, ງ, ຍ, ຊ, ສ, ລ | 45 min | 1🎖️ ⚁ |
| 2.1.3 | Simple Syllable Reading | kho, go, bo, pa, ma, sa | 45 min | 1🎖️ ⚂ |

---

## LEVEL 2.2 | Vowels & Tone Marks
**Goal**: Read words with vowel marks and tones  
**Duration**: ~2 hours | **Script**: Lao script

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 2.2.1 | Short & Long Vowels | ະ, ັ, າ, ໍ, ື | 45 min | 2🎖️ ⚀ |
| 2.2.2 | Tone Rules (Mai Tho, Mai Ti) | Mid, Low, High, Falling, Rising | 45 min | 2🎖️ ⚁ |
| 2.2.3 | Mixed Vowel & Tone Drills | Fluency with marks | 45 min | 2🎖️ |

**PATH 2 COMPLETE**: 🎖️

---

# 📙 PATH 3: Elementary Communication (Basic Conversations) | 2 Levels

## LEVEL 3.1 | Vocabulary Expansion & Questions
**Goal**: Read & understand common words, ask basic questions  
**Duration**: ~2 hours | **Script**: Lao script

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 3.1.1 | Body Parts & Descriptions | ຫົວ, ມື, ຕົວ, ໃຫຍ່, ນ້ອຍ | 45 min | 2🎖️ ⚀ |
| 3.1.2 | Question Words & Negation | ໃຜ, ຍັງ, ບໍ່, ບໍ່ຮູ້ | 45 min | 2🎖️ ⚁ |
| 3.1.3 | Time & Directions | ວັນ, ເວລາ, ເບື້ອງ, ໄກ | 45 min | 2🎖️ ⚂ |

---

## LEVEL 3.2 | Simple Sentences & Word Order
**Goal**: Form simple sentences with correct structure  
**Duration**: ~2 hours | **Script**: Lao script

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 3.2.1 | Common Verbs & Word Order | ໄປ, ມາ, ກິນ, ດື່ມ, ຢູ່ | 45 min | 2🎖️ ⚀ |
| 3.2.2 | Adjectives & Basic Particles | ຮົ້ງ, ມົນ, ສະສຸກ, ຍັງ | 45 min | 2🎖️ ⚁ |
| 3.2.3 | SVO Sentence Formation | Simple production drills | 45 min | 3🎖️ |

**PATH 3 COMPLETE**: 🎖️

---

# 📕 PATH 4: Intermediate Fluency (Complex Grammar) | 2 Levels

## LEVEL 4.1 | Expanded Vocabulary & Scenarios
**Goal**: Understand and discuss familiar topics  
**Duration**: ~2 hours | **Script**: Lao script

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 4.1.1 | Restaurant & Shopping Scenarios | ລາຄາ, ຕໍ່ລອງ, ປະກາດ, ເລືອກ | 45 min | 3🎖️ ⚀ |
| 4.1.2 | Hotel & Travel Vocabulary | ຫ້ອງ, ກົາງເຮືອນ, ລົດ, ບິນ | 45 min | 3🎖️ ⚁ |
| 4.1.3 | Weather & Seasons | ຝົນ, ແດດ, ຮ້ອນ, ເລັນ, ລົມ | 45 min | 3🎖️ ⚂ |

---

## LEVEL 4.2 | Tense & Complex Structures
**Goal**: Express past, present, and future; use compound sentences  
**Duration**: ~2 hours | **Script**: Lao script

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 4.2.1 | Past Tense & Aspect Markers | ແລ້ວ, ກຳລັງ, ຈະ, ພຽງ | 45 min | 3🎖️ ⚀ |
| 4.2.2 | Compound Sentences | ແລະ, ຫຼື, ເພາະວ່າ, ກ່ອນ | 45 min | 3🎖️ ⚁ |
| 4.2.3 | Complex Question Formation | Multiple clause questions | 45 min | 4🎖️ |

**PATH 4 COMPLETE**: 🎖️

---

# 📓 PATH 5: Advanced Mastery (Real Conversations) | 2 Levels

## LEVEL 5.1 | Cultural Context & Advanced Topics
**Goal**: Discuss culture, traditions, and express opinions  
**Duration**: ~2 hours | **Script**: Lao script

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 5.1.1 | Cultural Concepts & Traditions | ບຸນ, ວັດ, ປະເພນີ, ວັດທະນະທຳ, ຜູ້ໃຫຍ່ | 45 min | 4🎖️ ⚀ |
| 5.1.2 | Numbers & Math (11-100) | ສິບ, ຮ້ອຍ, ບວກ, ລົບ, ຄູນ | 45 min | 4🎖️ ⚁ |
| 5.1.3 | Opinions & Preferences | ມັກ, ບໍ່ມັກ, ຄວນ, ຈະ | 45 min | 4🎖️ ⚂ |

---

## LEVEL 5.2 | Fluency & Conversation Mastery
**Goal**: Sustain natural conversations on any familiar topic  
**Duration**: ~2 hours | **Script**: Lao script (full mastery)

| # | Lesson Title | Topics | Est. Time | Cumulative Medals |
|----|---|---|---|---|
| 5.2.1 | Travel Stories & Narratives | Descriptive conversation practice | 45 min | 4🎖️ ⚀ |
| 5.2.2 | Problem-Solving & Advice | Conditional sentences, suggestions | 45 min | 4🎖️ ⚁ |
| 5.2.3 | Fluency Check & Mastery Test | Unrestricted conversation drills | 45 min | 💎 |

**PATH 5 COMPLETE**: 💎

---

## Learning Path Summary

| Curriculum | Status | Medal |
|---|---|---|
| Path 1: Foundations | ✅ | 🎖️ |
| Path 2: Script Mastery | ✅ | 🎖️ |
| Path 3: Elementary Comm. | ✅ | 🎖️ |
| Path 4: Intermediate Fluency | ✅ | 🎖️ |
| Path 5: Advanced Mastery | ✅ | 💎 |

### Completion Record
- **Completed Paths**: 4 × 🎖️ + 1 × 💎
- **Total Lessons**: 30
- **Total Duration**: ~22.5 hours (30 × 45 min)
- **Target Proficiency**: CEFR A1 (Elementary)

### Display Logic
- **In Progress on Path**: Show individual level medals (e.g., ⚀ ⚁)
- **Path Completed**: Show only path medal (🎖️ or 💎)
- **Previous Paths**: Show only summary medal (🎖️)

---

## Implementation Notes

### Activity Types (to balance at each lesson)

1. **Recognition** (25%): Tap to match, Multiple choice
2. **Recall** (35%): Type answer, Speaking recognition
3. **Production** (25%): Speaking, Writing
4. **Discrimination** (15%): Same/different, Identify tone errors

### Spaced Repetition Schedule

Within each lesson (4-5 sessions):
- Session 1: New content introduction (50% new, 50% review of prior level)
- Session 2: Mixed practice (40% new, 60% review)
- Session 3: Heavy review (20% new, 80% review)
- Session 4+: Maintenance (10% new, 90% review)

### Difficulty Progression

Each lesson increases:
- Complexity of sentences
- Speed of presentation
- Context variability
- Amount of inference required

---

## Success Metrics

- **Completion Rate**: 80%+ of lessons completed
- **Accuracy Growth**: Average 60% → 85%+ across levels
- **Retention**: 70%+ accuracy on Level 1 items after Level 3
- **Engagement**: 60%+ daily return rate during active learning

---

## References

- Krashen, S. (1982). Principles and Practice in Second Language Acquisition
- Bjork, R. A., & Bjork, E. L. (1992). A new theory of disuse and an old theory of stimulus fluctuation
- Sweller, J. (1988). Cognitive Load Theory in educational technology
- Brown, P. C., Roediger, H. L., & McDaniel, M. A. (2014). Make It Stick: The Science of Successful Learning
