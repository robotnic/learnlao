# Vocabulary drill

FSRS-Algorithmus (Free Spaced Repetition Scheduler)
Store state in browser indexedDB

## Game
Play the lao sound.
multiple choise english translation as answer

## implementation

Get a deep knowledge of FSRS
Use knowledge_base.json -> Vocabulary
No changes inside knowledge_base allowed.

Use the icon learn on startpage to start the app.

make a dir for this app with a service and a component,
don't mess with the rest of the code.

## code snippet

import Dexie, { Table } from 'dexie';
import { fsrs, Rating, Card, createEmptyCard, State, FSRS } from 'ts-fsrs';

// --- Interfaces ---
export interface Vocabulary {
  id: string;
  lao: string;
  english: string;
  level_id: string;
  phonetic: string;
  category: string;
  usage_rank: number;
  emoji: string;
}

export interface Progress extends Card {
  id: string;
}

export interface Question {
  word: Vocabulary;
  choices: string[];
  audioUrl: string;
}

// --- Database Configuration ---
class LaoDatabase extends Dexie {
  vocab!: Table<Vocabulary>;
  progress!: Table<Progress>;

  constructor() {
    super('LaoLearningDB');
    this.version(1).stores({
      vocab: 'id, category, usage_rank, english',
      progress: 'id, due, state, [state+due]' 
    });
  }
}

const db = new LaoDatabase();
// Initialize FSRS with default parameters
const f: FSRS = fsrs();

// --- Service Implementation ---
export const LearningService = {
  /**
   * Initializes the database with 2000 words.
   * Filters and sorts by usage_rank to ensure correct entry order.
   */
  async seedData(words: Vocabulary[]): Promise<void> {
    const count = await db.vocab.count();
    if (count === 0) {
      const sortedWords = [...words].sort((a, b) => a.usage_rank - b.usage_rank);
      await db.vocab.bulkAdd(sortedWords);
      
      const initialProgress: Progress[] = sortedWords.map(word => ({
        ...createEmptyCard(new Date()),
        id: word.id,
      }));
      await db.progress.bulkAdd(initialProgress);
    }
  },

  /**
   * Selection Logic:
   * 1. Check for Overdue Review words (Due <= Now).
   * 2. If none, pick the highest priority 'New' word (by usage_rank).
   */
  async getNextQuestion(): Promise<Question | null> {
    const now = new Date();

    // 1. Try to get a word that is due for review
    let nextProgress = await db.progress
      .where('due')
      .below(now)
      .and(p => p.state !== State.New)
      .orderBy('due')
      .first();

    // 2. Fallback to the next 'New' word based on usage_rank
    if (!nextProgress) {
      const newCardRecord = await db.progress.where('state').equals(State.New).first();
      if (newCardRecord) {
        // Find the specific 'New' word with the best usage_rank
        const newIds = (await db.progress.where('state').equals(State.New).toArray()).map(p => p.id);
        const bestVocab = await db.vocab
          .where('id').anyOf(newIds)
          .orderBy('usage_rank')
          .first();
        
        if (bestVocab) {
          nextProgress = await db.progress.get(bestVocab.id);
        }
      }
    }

    if (!nextProgress) return null;

    const word = await db.vocab.get(nextProgress.id);
    if (!word) return null;

    // Build the Question object
    const distractors = await this._getDistractors(word.english);
    const choices = [...distractors, word.english].sort(() => 0.5 - Math.random());
    const voice = Math.random() > 0.5 ? 'male' : 'female';
console.log('voice', voice)
    return {
      word,
      choices,
      audioUrl: `https://robotnic.github.io/audiofiles/audio/${word.id}_${voice}.mp3`
    };
  },

  /**
   * Processes the quiz result.
   * Correct -> Rating.Good (moves forward)
   * Wrong -> Rating.Again (resets stability, shows again in ~1 min)
   */
  async processResult(wordId: string, isCorrect: boolean): Promise<void> {
    const card = await db.progress.get(wordId);
    if (!card) return;

    const rating = isCorrect ? Rating.Good : Rating.Again;
    
    // FSRS handles the mathematics of the new intervals
    const schedulingCards = f.repeat(card, new Date());
    const newCard = schedulingCards[rating].card;

    await db.progress.put({
      ...newCard,
      id: wordId
    });
  },

  /**
   * Private helper to fetch 3 unique wrong answers.
   */
  private async _getDistractors(correctEnglish: string): Promise<string[]> {
    const pool = await db.vocab
      .where('english')
      .notEqual(correctEnglish)
      .limit(50)
      .toArray();

    return pool
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(v => v.english);
  }
};



# Extend this todo list

## Completed
- [x] Learn FSRS algorithm - Study FSRS algorithm documentation and understand how ts-fsrs library works. Review the code snippet provided in fsrs.md.
- [x] Design game UX flow - Design UX flow for vocabulary drill game. Define how users interact with Lao sounds, multiple choice answers, and progress tracking.

## In Progress
- [ ] Setup project structure - Create directory structure for FSRS feature with separate service and component files. Ensure isolated from existing code.

## Pending
- [ ] Build FSRS service - Implement FSRS service using ts-fsrs library and Dexie IndexedDB. Handle database initialization and FSRS state management. Follow implementation from fsrs.md code snippet.
- [ ] Setup IndexedDB with Dexie - Implement Dexie IndexedDB setup with vocab and progress tables. Seed database with knowledge_base.json vocabulary data. Use usage_rank for sorting.
- [ ] Build FSRS component - Create Angular component for vocabulary drill game. Display Lao sound playback and multiple choice English translation options. Show rating buttons only for correct answers.
- [ ] Add audio playback - Integrate audio playback functionality for Lao vocabulary words in the game component. Support male/female voice variants.
- [ ] Connect to home page - Integrate FSRS component with home page learn icon. Make sure routing and data flow works correctly.
- [ ] End-to-end testing - Test complete workflow: play sound, select answer, update progress, verify spaced repetition scheduling works.


