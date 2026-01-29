# Word Sort (Categories) Game

## Overview
Learners **drag and sort** Lao items into meaning-based (or usage-based) categories. This builds strong semantic organization and reduces “isolated flashcard knowledge”.

## Design Sketch
```text
┌──────────────────────────────────────┐
│ Word Sort • Set: Daily Life          │
│ Correct: 6/10   Time: 00:32          │
├──────────────────────────────────────┤
│ Items: [ນ້ຳ] [ເຂົ້າ] [ຄົນ] [ໄປ] ...      │
├──────────────────────────────────────┤
│ Buckets:  ┌────Food────┐ ┌──People─┐ │
│          │            │ │         │ │
│          └────────────┘ └─────────┘ │
│          ┌──Actions───┐             │
│          │            │             │
│          └────────────┘             │
├──────────────────────────────────────┤
│ Feedback: “Misplaced: ໄປ → Actions”  │
└──────────────────────────────────────┘
```

## Description
The learner sees 8–16 items (words or short phrases) and 3–6 category buckets. They must sort each item into the correct bucket.

Examples of category sets:
- **People / Places / Food / Numbers**
- **Greetings / Thanks / Apologies / Leave-taking**
- **Classifiers / Time words / Question words**
- **Formal vs casual** (for phrases)

**Target:** Desktop + mobile (drag-and-drop or tap-to-select)

## Learning Benefits
- **Semantic encoding (depth of processing):** sorting forces meaning decisions rather than passive review.
- **Category fluency:** faster retrieval because items are stored in organized “chunks”.
- **Error correction:** wrong placement reveals misconceptions immediately.
- **Transfer:** category knowledge supports comprehension in new contexts.

## Scientific Support (Pointers)
- Craik & Lockhart (1972): deeper processing improves retention.
- Baddeley (1997): structured rehearsal and retrieval improves long-term memory.
- Karpicke & Roediger (2008): retrieval practice improves durable learning.

## Technical Implementation
- Simple drag-drop UI (or tap item → tap bucket).
- Buckets defined per lesson (tags/categories).
- Scoring: correct placements, time, streak.
- Adaptive: reuse missed items in later rounds.

## Gamification Elements
- ⏱️ Time bonus for fast sorting
- 🔥 Streak for perfect buckets
- 🧠 “Category Mastery” badges
- 📈 Progress per category

## Game Modes
### Mode 1: Assisted Sort
- Items show hint tags (optional)
- Buckets have icons/images

### Mode 2: Timed Sort
- 45–90 seconds
- Increasing item count

### Mode 3: Confusable Categories
- Categories are intentionally close (e.g., polite vs casual)
- Great for phrase pragmatics

## Content Fit
- **Character (C):** not recommended (—)
- **Word (W):** strong fit (✅)
- **Phrase (P):** secondary fit (⚠️) when sorting by scenario/register
