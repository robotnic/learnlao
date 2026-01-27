# Award System Research: Motivation, Progress, and Feedback

## Executive Summary

Learning is primarily driven by **progress perception** and **intrinsic motivation** rather than time spent. This research summarizes evidence-based principles for designing an effective award system that maximizes learner motivation and retention in language learning applications.

## Key Findings from Learning Science

### 1. Progress Matters More Than Time

**Evidence:**
- Karpicke & Roediger (2008): Spaced retrieval practice produces better long-term retention than massed practice with same time invested
- Dunlosky et al. (2013): Learning gains are measured by memory retention, not study duration
- Zimmerman & Schunk (2011): Self-regulated learners monitor progress, not hours studied

**Application:** Display achievement progress (skills mastered, words learned, levels completed) rather than session duration.

### 2. Immediate Feedback Enhances Learning

**Evidence:**
- Hattie & Timperley (2007): Feedback effectiveness depends on specificity and immediacy (effect size: 0.79)
- Shute (2008): Formative feedback during practice improves learning outcomes
- Payne et al. (2007): Feedback should explain what was correct/incorrect, not just scores

**Application:** Provide instant feedback on each action with clear explanations of results.

### 3. Intrinsic Motivation Drives Long-Term Learning

**Evidence:**
- Deci & Ryan (2000): Autonomy, competence, and relatedness drive sustained motivation
- Ryan & Deci (2000): External rewards can undermine intrinsic motivation if perceived as controlling
- Wiggins & McTighe (2005): Learners perform better when they understand meaningful goals

**Application:** Frame learning as skill mastery, not external rewards. Connect to real-world usefulness.

### 4. Incremental Progress Perception

**Evidence:**
- Kellogg & Wolff (2008): Clear progress indicators increase persistence
- Locke & Latham (2002): Specific, challenging goals with progress tracking increase performance
- Brown et al. (2014): Even small progress celebrations increase motivation

**Application:** Show granular progress (e.g., "Learn 30 words" → show 5/30 → 10/30) rather than binary complete/incomplete.

### 5. Gamification Elements: Effective vs. Harmful

**Evidence:**
- Sailer et al. (2013): Points, badges, and leaderboards increase engagement when aligned with learning goals
- Dichev & Dicheva (2017): Poorly designed gamification can increase anxiety
- Sap & Rashkin (2018): Leaderboards can demotivate lower-performing students

**Application:** Use celebrating personal progress over competitive rankings. Celebrate milestones, not just completion.

### 6. Autonomy & Choice Matter

**Evidence:**
- Cordova & Lepper (1996): Personalization and choice increase intrinsic motivation
- Patall et al. (2016): Even small choices increase engagement and performance
- Opitz et al. (2017): Perceived control positively affects language learning outcomes

**Application:** Allow learners to choose difficulty levels, topic sequences, and learning modalities.

## Recommended Award System Components

### 1. **Progress Dashboard**
- Visual representation of learning journey
- **Primary focus: Current Level Mastery** (the default goal - master level before advancing)
- Multiple dimensions: learning items mastered in current level, category breakdown, historical progress
- Shows historical progress (charts of learning over time)
- Break down by topic/category within level
- **Interactive/Expandable:** Click on "Current Level Progress" bar to drill down into details
- Overall progress (all levels) shown as secondary metric

### 2. **Milestone Celebrations**
- Celebration at specific checkpoints (every 10 words, every 5 lessons)
- Visual/audio celebration (animation, fireworks, sound effects)
- Specific achievement badges (no more than 5-7 active badges at once)
- Recognition message ("You've learned 50 words! 🎉")

### 3. **Immediate Feedback Mechanism**
- Correct/incorrect feedback within 500ms of answer
- Explanation of why answer was correct/incorrect
- Progress update ("3/10 completed in this lesson")
- Encouragement for incorrect responses ("Keep trying!")

### 4. **Level Progression System**
- Clear difficulty progression (Level 1 → Level 4)
- Prerequisite mastery requirements (80%+ accuracy to advance)
- Ability to review/master previous levels
- Certificate or badge upon completion

### 5. **Streak & Consistency Tracking**
- Daily learning streak (not dependent on duration)
- Shows consecutive days engaged
- Optional weekly/monthly challenges
- Small celebration for streak milestones

### 6. **Personal Best Metrics**
- Speed improvements (reduced time per question)
- Accuracy improvements (increase in correct answers)
- Content growth (unique items mastered: words, phrases, characters, sentences)
- Shows comparison to own previous performance (not others)

## Recommended Visual/Audio Feedback

### Positive Reinforcement
- **Correct answer:** Subtle animation, satisfied sound (not harsh), "+5 points" or progress bar update
- **Milestone achieved:** Fireworks animation, celebratory music (short, ~2-3 seconds), confetti
- **Level completed:** Full-screen celebration, voice message ("Well done!"), medal/trophy display
- **Streak maintained:** Quick notification in corner, brief positive audio cue

### Neutral/Constructive for Errors
- **Incorrect answer:** Gentle correction (not harsh buzzer), explanation shown
- **Hint requested:** Encouraging message, gradual reveal of answer
- **Retry:** Quick reset animation, encouraging message

## Scoreboard Design Recommendation

### Structure
```
┌─────────────────────────────────────────────┐
│          YOUR LEARNING PROGRESS             │
├─────────────────────────────────────────────┤
│                                             │
│  � CURRENT LEVEL PROGRESS (click ↓)       │
│  ██████░░░░░░░░░░░░░░░░░░░  64%           │
│  Level 2: 77 of 120                        │
│                                             │
│  🏆 MILESTONES                              │
│  ✓ Level 1 Master  ✓ 50 Items Mastered  │
│  🔄 Working on: Level 2 (+23 more)       │
│  ⏳ Streak: 7 days 🔥                     │
│                                             │
│  📈 THIS WEEK'S PROGRESS                    │
│  Mon: 15 words | Tue: 12 words | ... |     │
│                                             │
│  🎯 CURRENT STREAK                          │
│  7 days 🔥  |  Keep it going!              │
│                                             │
└─────────────────────────────────────────────┘
```

### Interactive Progress Detail View
When clicking on "Current Level Progress" or the progress bar, expand to show:

```
┌──────────────────────────────────────────────────┐
│  LEVEL 2 PROGRESS DETAILS                 [←Back] │
├──────────────────────────────────────────────────┤
│                                                  │
│  🎯 CURRENT GOAL: Master Level 2                │
│  ████████░░░░░░░░░░░░░░░░░░░░  64%             │
│  Level 2: 77 of 120                             │
│                                                  │
│  BY CATEGORY (within Level 2):                   │
│  🍽️  Food            ████████░░ 22/30 (73%)    │
│  🛫 Travel          ███░░░░░░░░ 8/25 (32%)     │
│  🏥 Emergency       ██████░░░░░ 16/20 (80%)    │
│  💬 Social          █████░░░░░░ 15/25 (60%)    │
│  📚 Core            ███████░░░░ 16/20 (80%)    │
│  (Click category to review or quiz)            │
│                                                  │
│  MASTERY DEPTH (Level 2):                        │
│  🟦 Beginner (0-2 attempts)    32 items       │
│  🟩 Familiar (3-5 attempts)    28 items       │
│  🟪 Proficient (6+ attempts)   17 items       │
│  Goal: Move more items to proficient level     │
│                                                  │
│  WEAKEST CATEGORIES (need work):                 │
│  🔴 Travel: 8/25 (32%) - NEEDS FOCUS           │
│     Recommended action: 20-word focused quiz   │
│  🟡 Social: 15/25 (60%) - GETTING BETTER       │
│                                                  │
│  LEVEL PROGRESSION:                              │
│  ✓ Level 1: 120/120 (100%) ✓ MASTERED          │
│  ▶ Level 2: 77/120 (64%) ← YOU ARE HERE        │
│  ○ Level 3: LOCKED (master Level 2 to unlock)  │
│  ○ Level 4: LOCKED                              │
│                                                  │
│  NEXT MILESTONE:                                 │
│  🎁 100 items in Level 2 → Unlock Level 3      │
│     Only 23 more items needed!                  │
│     Keep up the pace: 4-5 items per day        │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Key Features:**
- **Current level progress** is the primary metric (shows clear progress toward goal)
- Category breakdown within the level (not across all levels)
- Identifies weak categories that need focus
- Shows unlock requirements clearly
- Level progression explicitly shows which levels are locked/unlocked
- Estimated time based on learning pace

### Key Elements
- **Current level progress bar:** Primary display showing percentage of level completion (motivating!)
- **Category breakdown:** Within current level only (no overwhelming 1000-item view)
- **Weak area identification:** Highlights categories needing focus in current level
- **Level progression:** Clear visual of current level, completed levels, locked levels
- **Next milestone:** Shows exact items needed to unlock next level
- **Weekly view:** Shows consistency within current level
- **Streak counter:** Large, prominent display with encouragement
- **Overall journey:** Secondary metric showing cumulative progress (not demotivating)

## Default Learning Goal & Level System

### Goal Structure
**The default goal is to MASTER THE CURRENT LEVEL and unlock the next level.**

```
Level 1: 120 items (Foundation)
├─ Food & Dining: 30 items
├─ Greetings & Social: 25 items  
├─ Basic Needs: 30 items
├─ Transport: 20 items
└─ Core Vocabulary: 15 items

Level 2: 120 items (Intermediate)
├─ Extended Food: 30 items
├─ Travel & Navigation: 25 items
├─ Emergency & Health: 20 items
├─ Social Interactions: 25 items
└─ Grammar & Structure: 20 items

Level 3: 120 items (Advanced)
└─ [Unlocked after mastering Level 2]

Level 4: 120 items (Mastery)
└─ [Unlocked after mastering Level 3]
```

### Progression Requirements
- **Mastery threshold:** 80%+ accuracy on all items in current level
- **Unlock next level:** Complete current level with 80%+ proficiency
- **Previously completed levels:** Always available for review/maintenance
- **No skipping:** Must master levels sequentially

### Why This Approach
1. **Achievable goals:** 120 items per level feels manageable, not 1000
2. **Clear progress:** 64% in Level 2 feels far better than 16% overall
3. **Unlock system:** Creates natural motivation milestones
4. **Focus:** Learners concentrate on one level at a time
5. **Consolidation:** Prevents advancing without mastery
6. **Science-backed:** Locke & Latham (2002) shows specific goals with clear progress tracking increase performance

## Medal System: Motivation Through Achievement (Not Urgency)

### Medal Tiers
```
🥈 Silver Medal
├─ Earned: On any first quiz attempt (encourages participation)
├─ Feeling: "Great job trying!"
└─ Example: First quiz on "food" = Silver earned

🥇 Gold Medal  
├─ Earned: Score 85-94% on replay quiz
├─ Feeling: "You're getting really good at this!"
└─ Example: Retry "food" quiz, get 90% = Gold earned

💎 Platinum Medal
├─ Earned: Score 95%+ on replay quiz
├─ Feeling: "Master level! You really know this!"
└─ Example: Perfect on 3rd attempt = Platinum earned

👑 Master Badge
├─ Earned: 100% accuracy on 3+ consecutive replays
├─ Feeling: "You've truly mastered this!"
└─ Example: Perfect scores on attempts 3, 4, 5 = Master badge
```

### Why This Works
1. **No urgency** - Reviews are optional opportunities, not requirements
2. **Clear progression** - Silver → Gold → Platinum → Master shows growth
3. **Replayability** - Same quiz retaken becomes a medal-hunting game
4. **Non-destructive** - You never "lose" a medal by replaying
5. **Personal achievement** - All medals are personal, not competitive
6. **Flexibility** - Some items may have only Silver, others all 4 tiers
7. **Intrinsic motivation** - Collecting medals is fun, not compulsory

### Medal Display
```
"Food & Dining" Category
├─ ເບິ່ງ (look)      🥈🥇💎
├─ ກິນ (eat)         🥈🥇
├─ ດື່ມ (drink)      🥈
├─ ນໍາ (bring)       🥈
└─ ຊື້ (buy)         🥈🥇💎👑

Visual: Show medal collection as constellation or collection shelf
Encourages: "I want Gold on that one too!"
```

### Feature 1: Quiz Repetition System
**Use Case:** "100 Items Club - I want to make the quiz again to repeat my knowledge"

#### Implementation
```
ACHIEVED MILESTONE: 100 Items Club 🎉
You've mastered 100 learning items!
(words, phrases, characters, sentences, or tones)

[View Your 100 Items] [Take Review Quiz]

Review Quiz Options:
□ Quiz on all 100 items (shuffle)
□ Quiz on difficult items (accuracy < 80%)
□ Quiz on recent items (learned in last 7 days)
□ Quiz by category (select specific category)
□ Quiz by item type (words vs. phrases vs. sentences, etc.)
□ Speed challenge (fastest accurate completion)
□ Pronunciation challenge (Tone Trainer mode)
```

#### Features
- **Persistent achievements:** Once earned (e.g., "100 Items Club"), always available
- **Review from achievement:** Click achievement badge to review quiz
- **Customizable quizzes:** Filter by difficulty, recency, category, accuracy, item type
- **Progress maintenance:** Quiz results update progress/streak but don't reset mastery
- **Difficulty selector:** "Review Easy" (reinforcement) vs "Challenge Hard" (mastery)
- **Item type mixing:** Quiz on mixed item types or focus on specific type (e.g., "tone practice only")

**Learning Item Mastery Levels for Quizzes:**
- 🟦 Beginner: 0-2 correct attempts → Review quizzes on these items
- 🟩 Familiar: 3-5 correct attempts → Optional review
- 🟪 Proficient: 6+ correct attempts → Challenge mode available
- 🌟 Expert: 99%+ accuracy over 10+ attempts → Master badge

---

### Feature 2: Spaced Repetition Reminders
**Use Case:** "Reminder to repeat the learned..."

#### Notification System
The system tracks which learning items need review based on **forgetting curve** - but frames it as **optional review opportunities to earn medals**:

```
REVIEW OPPORTUNITY 🎯
Ready to earn more medals?

Items ready to review: 47 (from 1-4 weeks ago)
(8 words, 12 phrases, 15 characters, 7 tones, 5 sentences)

[Start Review Quiz] [Maybe Later]

Prize Structure:
• Silver Medal 🥈: First time quiz - earn by reviewing (any accuracy)
• Gold Medal 🥇: Replay quiz - earn by getting 90%+ accuracy
• Platinum 💎: Replay quiz 3+ times - earn by getting 95%+ accuracy

Examples:
• "ອາກາດ" (air/word) - Already earned Silver? Try for Gold!
• "ຍີ່ຫໍ່" (hotel/phrase) - Earn Silver today, Gold next time
• "ົ" (tone mark) - You earned Silver last week, ready for Gold?
```

#### Notification Triggers
1. **Forgetting Curve Reminder:** After 1 day, 3 days, 1 week, 2 weeks
   - Show words likely to be forgotten
   - Prioritize words with lower accuracy

2. **Streak Maintenance:** Daily encouragement
   - "Keep your 7-day streak going!"
   - Show quickest quiz (5-10 words)

3. **Category Emphasis:** Suggest reviewing weak categories
   - "You're at 30% in Travel. Review 10 more words?"
   - Based on accuracy in category

4. **Goal-Based:** If learner set goal (e.g., "1000 words in 3 months")
   - "12 more words this week to stay on track"
   - Progress bar toward goal

#### Scheduling Algorithm
```
Review Interval Based on Forgetting Curve:
(Not urgent - optional opportunities to earn higher-tier medals)

First review: 1-3 days (earn Silver Medal)
Second review: 1 week (try for Gold Medal - 90%+ accuracy)
Third+ review: 2+ weeks (aim for Platinum - 95%+ accuracy)

Medal Tiers by Performance:
🥈 Silver: Earn on ANY first attempt or review (just participate)
🥇 Gold: Earn with 85-94% accuracy on replay
💎 Platinum: Earn with 95%+ accuracy on replay
👑 Master: Earn with 100% accuracy on 3+ consecutive replays

Item Type Considerations:
- Characters & tones: Shorter intervals (more satisfying medal progression)
- Words: Standard intervals
- Phrases & sentences: Longer intervals (can still earn medals on replays)
```

#### Settings
Users can customize review opportunities:
- Frequency: Daily, 3x week, 2x week, weekly (no pressure)
- Timing: Morning/afternoon/evening
- Size: 5 items, 10 items, 20 items, 50 items
- Type: All items, items with Silver medals only, specific item types (e.g., tones only)
- Channel: In-app notification, email, browser notification, SMS
- Medal notifications: Get notified when you're close to earning Gold/Platinum

#### Sample Reminder Sequences

**Scenario 1: Earning Medal Progression**
- Day 1: Learn "ໂຕະ" (table/word) - Earn Silver Medal 🥈
- Day 2: Optional - Try quiz again for Gold Medal? (need 85%+)
- Day 3: Gold earned! 🥇 Try again in a week for Platinum?
- Day 7: Optional - Can replay again, work toward Platinum (95%+)
- Day 14: Platinum earned! 💎 Try for Master badge (100% on 3 replays)

**Scenario 2: Optional Review Opportunities**
- First attempt: 70% accuracy on "ລາວ" (Lao person/language/word)
- Day 0: Earn Silver Medal 🥈 just for trying!
- Day 1: "Ready for Gold? Quiz again for 90%+" (optional notification)
- Day 1 (if attempted): 65% - Silver only, but you tried! Keep going
- Day 2: Another chance to reach Gold - "Only 2% away from Gold!"
- Day 3: Gold earned! 🥇 You beat your previous score
- Day 7: Platinum opportunity - "3 perfect scores and earn Platinum 💎"

---

## Enhanced Scoreboard with Level-Based Progress

```
┌──────────────────────────────────────────────────┐
│          YOUR LEARNING PROGRESS                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  📍 CURRENT LEVEL PROGRESS (click ↓)             │
│  ██████░░░░░░░░░░░░░░░░░░░░░░  64%              │
│  Level 2: 77 of 120                             │
│                                                  │
│  🏆 MILESTONES                                   │
│  ✓ Level 1 Master    🎓                         │
│  ▶ Level 2 Working   23 more to go              │
│  ⏳ Daily Streak: 7 days 🔥                     │
│                                                  │
│  📈 THIS WEEK'S PROGRESS (Level 2)               │
│  Mon: +3 | Tue: +2 | Wed: +4 | Thu: +1 | ...  │
│                                                  │
│  ⏱️  ESTIMATED TIME TO NEXT LEVEL                │
│  At current pace: ~2-3 weeks to Level 3         │
│                                                  │
│  💡 FOCUS AREA                                   │
│  Travel (8/25 - 32%) - Try travel quiz!        │
│                                                  │
│  ⏰ NEXT REVIEW (Based on Forgetting Curve)      │
│  📍 12 items ready for review (Level 2)         │
│  🔴 2 items (urgent - <60% accuracy)            │
│  🟡 5 items (due today - 3+ days)               │
│  🟢 5 items (optional - 1-2 weeks)              │
│  [Start Review Session]                         │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Implementation Priorities

### Phase 1 (MVP)
1. Progress bar showing words learned
2. Immediate feedback (correct/incorrect)
3. Level badges
4. Streak counter

### Phase 2
1. Weekly progress chart
2. Achievement system (3-5 badges)
3. Milestone celebrations with audio/animation
4. Full scoreboard dashboard
5. **Click on "Overall Progress" to view drill-down details**
6. **Review from achievements (take quiz again)**

### Phase 3
1. Advanced metrics (speed, accuracy trends)
2. Multiple learning path options
3. Customizable goals
4. **Spaced repetition reminder system**
5. **Forgetting curve tracking**
6. **Custom quiz builder** (by category, difficulty, mastery level, item type)
7. Social sharing (optional personal milestones, not rankings)

## References

1. Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4-58.

2. Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1), 81-112.

3. Karpicke, J. D., & Roediger III, H. L. (2008). The critical importance of retrieval practice on long-term retention. *Psychological Bulletin*, 134(1), 77.

4. Locke, E. A., & Latham, G. P. (2002). Building a practically useful theory of goal setting and task motivation. *American Psychologist*, 57(9), 705-717.

5. Ryan, R. M., & Deci, E. L. (2000). Intrinsic and extrinsic motivations: Classic definitions and new directions. *Contemporary Educational Psychology*, 25(1), 54-67.

6. Sailer, M., Hense, J. U., Mayr, S. K., & Mandl, H. (2013). How gamification motivates: an experimental study of the effects of specific game design elements on psychological need satisfaction. *Computers in Human Behavior*, 29(5), 2033-2043.

7. Shute, V. J. (2008). Focus on formative feedback. *Review of Educational Research*, 78(1), 153-189.

8. Wiggins, G., & McTighe, J. (2005). *Understanding by design* (2nd ed.). Association for Supervision and Curriculum Development.
