import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { FSRS, Rating, Card as FSRSCard } from '@squeakyrobot/fsrs';
import * as levenshtein from 'fast-levenshtein';

/**
 * ARCHITECTURE OVERVIEW: VOCABULARY LEARNING SERVICE
 * 
 * DESIGN GOALS:
 * 1. Marathon Ready: Supports 10-hour sessions via "Auto-Unlock" horizon logic.
 * 2. Retention Focused: Implements the FSRS algorithm for mathematically optimal spacing.
 * 3. Frequency First: Enforces learning words in order (e.g., 1-2000) so 'Hello' comes before 'University'.
 * 4. Anti-Pattern Protection: Uses Gaussian Jitter for distractors and Anti-Spoiler logic for word variants.
 * 5. Reusable & Minimal: Generic L1/L2 naming; no hardcoded languages or gender logic.
 * 
 * DATA STRUCTURE:
 * - VocabEntry: The "Definition" (Static data).
 * - MemoryState: The "Progress" (FSRS data). Every word has 4 states (2 Levels x 2 Directions).
 * 
 * HOW TO TEST:
 * - Time: Use Sinon.js or 'FakeTimers' to tick the clock forward by 90 days to simulate long-term forgetting.
 * - Distribution: Verify that 'getDistractors' returns IDs within a +/- 30 range of the target word ID.
 * - Integration: Ensure 'submitReview' with Rating.Easy graduates all 4 variants of a word.
 */

export enum Difficulty { Standard = 'standard', Expert = 'expert' }
export enum Mode { L1ToL2 = 'l1tol2', L2ToL1 = 'l2tol1' }

export interface VocabEntry {
  id: number; // Frequency Rank (1, 2, 3...)
  l1: string; // Source (e.g., English)
  l2: string; // Target (e.g., Lao)
}

export interface MemoryState extends FSRSCard {
  id: string;      // Composite PK: "{entryId}#{level}#{mode}"
  entryId: number;
  level: Difficulty;
  mode: Mode;
}

export interface QuizChallenge {
  state: MemoryState;
  entry: VocabEntry;
  challenge: string;
  solution: string;
  choices: string[];
  isStandard: boolean;
}

@Injectable({ providedIn: 'root' })
export class VocabService extends Dexie {
  vocab!: Table<VocabEntry, number>;
  progress!: Table<MemoryState, string>;

  private readonly fsrs = new FSRS();
  private readonly ROUND_SIZE = 20; // Triggers celebration
  private sessionCounter = 0;

  constructor() {
    super('VocabLearningDB');
    // Indexing [state+entryId] allows the 'Curtain' logic to find the highest learned word instantly.
    this.version(1).stores({
      vocab: 'id, l1, l2',
      progress: 'id, entryId, due, state, [state+entryId]'
    });
  }

  /**
   * DATABASE INITIALIZATION
   * Generates 4 memory tracks for every vocab entry (Level x Direction).
   */
  async initialize(entries: VocabEntry[]): Promise<void> {
    const states: MemoryState[] = [];
    const diffs = [Difficulty.Standard, Difficulty.Expert];
    const modes = [Mode.L1ToL2, Mode.L2ToL1];

    for (const e of entries) {
      for (const level of diffs) {
        for (const mode of modes) {
          states.push({
            ...this.fsrs.createEmptyCard(),
            id: `${e.id}#${level}#${mode}`,
            entryId: e.id,
            level,
            mode,
            // Temporal Jitter: Spread initial due dates over 24h to avoid a sequential wall on day one.
            due: new Date(Date.now() + Math.random() * 86400000)
          });
        }
      }
    }

    return this.transaction('rw', [this.vocab, this.progress], async () => {
      await Promise.all([this.vocab.clear(), this.progress.clear()]);
      await Promise.all([this.vocab.bulkPut(entries), this.progress.bulkPut(states)]);
    });
  }

  /**
   * SMART CHALLENGE SELECTOR
   * Handles:
   * A) Backlog: If returning after months, picks randomly from due pile (offset logic).
   * B) Marathon: If finished reviews, unlocks the next 5 words in the frequency list.
   */
  async getNextChallenge(): Promise<QuizChallenge | null> {
    const now = new Date();
    
    // Find the 'Learning Horizon' (The furthest word current in the review cycle)
    const top = await this.progress
      .where('[state+entryId]')
      .between([1, 0], [3, Infinity]) // State 1: Learning, 2: Review, 3: Relearning
      .reverse()
      .first();

    const horizon = top ? top.entryId + 10 : 30;

    const dueCollection = this.progress
      .where('due').belowOrEqual(now)
      .filter(r => r.entryId <= horizon);

    const count = await dueCollection.count();
    let state: MemoryState | undefined;

    if (count > 0) {
      // Pick random from due backlog to keep experience fresh
      state = await dueCollection.offset(Math.floor(Math.random() * count)).first();
    } else {
      // Auto-unlock next words for continuous marathon learning
      state = await this.progress
        .where('state').equals(0) // New
        .filter(r => r.entryId <= horizon + 5)
        .first();
    }

    if (!state) return null;
    const entry = await this.vocab.get(state.entryId);
    if (!entry) return null;

    const isL1ToL2 = state.mode === Mode.L1ToL2;
    const solution = isL1ToL2 ? entry.l2 : entry.l1;
    const distractors = await this.getDistractors(entry, state.mode, solution);

    return {
      state,
      entry,
      challenge: isL1ToL2 ? entry.l1 : entry.l2,
      solution,
      choices: this.shuffle([...distractors, solution]),
      isStandard: state.level === Difficulty.Standard
    };
  }

  /**
   * REVIEW SUBMISSION
   * 1. Updates FSRS memory math.
   * 2. Jump-Logic: If 'Easy' on a new word, mark all 4 versions as Mastered.
   * 3. Anti-Spoiler: Pushes siblings of the same word to tomorrow to prevent recognition-cheating.
   */
  async submitReview(state: MemoryState, rating: Rating): Promise<{ isRoundComplete: boolean }> {
    const result = this.fsrs.repeat(state, new Date());
    const updated = { 
      ...result[rating].card, 
      id: state.id, 
      entryId: state.entryId, 
      level: state.level, 
      mode: state.mode 
    } as MemoryState;

    await this.transaction('rw', this.progress, async () => {
      await this.progress.put(updated);

      // Fast-Track Mastery Propagation
      if (rating === Rating.Easy && state.state === 0) {
        await this.progress
          .where('entryId').equals(state.entryId)
          .modify(r => {
            r.state = 2; // Review
            r.s = 30;    // Stability
            r.due = new Date(Date.now() + 30 * 86400000);
          });
      }
      
      // Delay Sibling variants to tomorrow
      const tomorrow = new Date(Date.now() + 86400000);
      await this.progress
        .where('entryId').equals(state.entryId)
        .and(r => r.id !== state.id && r.due < tomorrow)
        .modify({ due: tomorrow });
    });

    return { isRoundComplete: ++this.sessionCounter % this.ROUND_SIZE === 0 };
  }

  /**
   * DISTRACTOR GENERATOR
   * Uses Gaussian distribution around the current word's ID.
   * This ensures distractors are of the same difficulty/frequency level.
   */
  private async getDistractors(e: VocabEntry, mode: Mode, correct: string): Promise<string[]> {
    const field = mode === Mode.L1ToL2 ? 'l2' : 'l1';
    const ids = new Set<number>();
    
    while(ids.size < 25) {
      const u1 = Math.random(), u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * Math.random());
      const g = Math.round(z0 * 20 + e.id); // StDev of 20 IDs
      if (g > 0 && g <= 2000 && g !== e.id) ids.add(g);
    }
    
    const pool = (await this.vocab.bulkGet(Array.from(ids))).filter((n): n is VocabEntry => !!n);
    return pool
      .map(n => ({ val: n[field], dist: levenshtein.get(correct.toLowerCase(), n[field].toLowerCase()) }))
      .sort((a, b) => a.dist - b.dist) // Closest visual match
      .slice(0, 3)
      .map(x => x.val);
  }

  private shuffle<T>(arr: T[]): T[] {
    return arr.sort(() => Math.random() - 0.5);
  }
}
