import { Injectable, Optional, Inject, InjectionToken } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { FSRS, Rating, State } from '@squeakyrobot/fsrs'; 
import * as levenshtein from 'fast-levenshtein';
import { 
  VocabEntry, MemoryState, Difficulty, Mode, QuizChallenge 
} from '@libs/types';
import { MemoryMonitorService } from './memory-monitor.service';

export const DB_NAME = new InjectionToken<string>('DB_NAME');

/**
 * VOCABULARY ENGINE (FINAL ARCHITECTURE)
 * Hardened for 10-hour marathons and long-term retention.
 */
@Injectable({ providedIn: 'root' })
export class VocabService extends Dexie {
  vocab!: Table<VocabEntry, number>;
  progress!: Table<MemoryState, string>;

  private readonly fsrs: FSRS;
  private sessionCounter = 0;
  private currentSessionMode: Mode = Mode.L1ToL2;

  public virtualClock: Date | null = null; 

  constructor(
    @Optional() @Inject(DB_NAME) dbName: string,
    private monitor: MemoryMonitorService
  ) {
    super(dbName || 'ProductionLaoDB');

    // Handle ESM Constructor wrapping
    const FSRS_CTOR = (FSRS as any).default || FSRS;
    this.fsrs = new FSRS_CTOR();

    this.version(2).stores({
      vocab: 'id, l1, l2',
      progress: 'id, entryId, due, state, stability, [state+entryId]'
    });
  }

  private get now(): Date {
    return this.virtualClock ?? new Date();
  }

  async initialize(entries: VocabEntry[]): Promise<void> {
    const states: MemoryState[] = [];
    for (const e of entries) {
      [Difficulty.Standard, Difficulty.Expert].forEach(level => {
        [Mode.L1ToL2, Mode.L2ToL1].forEach(mode => {
          const emptyCard = this.fsrs.createEmptyCard(this.now);
          states.push({
            ...emptyCard,
            id: `${e.id}#${level}#${mode}`,
            entryId: e.id,
            level,
            mode,
            state: State.New,
            stability: emptyCard.stability, 
            due: new Date(this.now.getTime() + Math.random() * 86400000)
          });
        });
      });
    }

    await this.transaction('rw', [this.vocab, this.progress], async () => {
      await Promise.all([this.vocab.clear(), this.progress.clear()]);
      await this.vocab.bulkPut(entries);
      await this.progress.bulkPut(states);
    });

    this.monitor.broadcast({ total: entries.length * 4, latestAction: 'ENGINE_INITIALIZED' });
  }

  /**
   * MODE-BATCHED & EXPERT-GATED CHALLENGE GENERATOR
   */
  async getNextChallenge(): Promise<QuizChallenge | null> {
    const today = this.now;
    
    // 1. Pivot Mode (L1->L2 / L2->L1) every 20 cards
    if (this.sessionCounter > 0 && this.sessionCounter % 20 === 0) {
      this.currentSessionMode = this.currentSessionMode === Mode.L1ToL2 ? Mode.L2ToL1 : Mode.L1ToL2;
    }

    // 2. Horizon Logic
    const top = await this.progress
      .where('[state+entryId]')
      .between([State.Learning, 0], [State.Relearning, Infinity])
      .reverse().first();

    const horizon = top ? top.entryId + 10 : 30;

    // 3. Filter with Expert-Gate and Mode-Batching
    const dueCol = this.progress.where('due').belowOrEqual(today)
      .filter(r => {
        const isCurrentMode = r.mode === this.currentSessionMode;
        const isWithinHorizon = r.entryId <= horizon;
        // Gate: Expert cards only appear if the word is already stabilized (> 7 days)
        const isLevelLocked = r.level === Difficulty.Expert && r.stability <= 7;
        
        return isCurrentMode && isWithinHorizon && !isLevelLocked;
      });
    
    const count = await dueCol.count();
    
    const state = count > 0 
      ? await dueCol.offset(Math.floor(Math.random() * count)).first()
      : await this.progress.where('state').equals(State.New)
          .filter(r => 
            r.entryId <= horizon + 5 && 
            r.mode === this.currentSessionMode && 
            r.level === Difficulty.Standard // Beginners start with Standard
          ).first();

    if (!state) {
        // Force pivot if current mode pool is exhausted
        this.currentSessionMode = this.currentSessionMode === Mode.L1ToL2 ? Mode.L2ToL1 : Mode.L1ToL2;
        return (count === 0 && horizon < 2000) ? this.getNextChallenge() : null;
    }

    const entry = await this.vocab.get(state.entryId);
    if (!entry) return null;

    // 4. Pre-emptive Sibling Staggering
    const tomorrow = new Date(this.now.getTime() + 86400000);
    await this.progress.where('entryId').equals(state.entryId)
      .and(r => r.id !== state.id)
      .modify({ due: tomorrow });

    const isL1ToL2 = state.mode === Mode.L1ToL2;
    const solution = isL1ToL2 ? entry.l2 : entry.l1;
    const distractors = await this.getDistractors(entry, state.mode, solution);

    return {
      state, entry, solution,
      challenge: isL1ToL2 ? entry.l1 : entry.l2,
      // 5. Unique Choice Guard
      choices: Array.from(new Set([...distractors, solution])).sort(() => Math.random() - 0.5),
      isStandard: state.level === Difficulty.Standard
    };
  }

  async submitReview(state: MemoryState, rating: Rating, startTime: number): Promise<void> {
    const duration = (performance.now() - startTime) / 1000;
    let finalRating: Rating = rating;

    // PROFESSOR'S PENALTY
    if (duration > 5 && rating === Rating.Good) {
      finalRating = Rating.Hard;
      this.monitor.broadcast({ latestAction: 'LATENCY_PENALTY_APPLIED' });
    }

    const result = this.fsrs.repeat(state, this.now);
    const card = result[finalRating].card;

    const updated: MemoryState = {
      ...card,
      id: state.id,
      entryId: state.entryId,
      level: state.level,
      mode: state.mode,
      state: card.state,
      stability: card.stability 
    };

    await this.transaction('rw', [this.progress], async () => {
      await this.progress.put(updated);

      if (finalRating === Rating.Easy && state.state === State.New) {
        await this.progress.where('entryId').equals(state.entryId).modify(r => {
          r.state = State.Review; 
          r.stability = 30; 
          r.due = new Date(this.now.getTime() + 30 * 86400000);
        });
      }
    });

    this.sessionCounter++;
    this.backgroundRefreshStats(state.entryId, duration);
  }

  private async backgroundRefreshStats(entryId: number, duration: number) {
    const entry = await this.vocab.get(entryId);
    
    // High-performance parallel tier counting for the Heatmap
    const [grey, orange, yellow, lightgreen, cyan] = await Promise.all([
      this.progress.where('stability').below(1).count(),
      this.progress.where('stability').between(1, 3, true, false).count(),
      this.progress.where('stability').between(3, 10, true, false).count(),
      this.progress.where('stability').between(10, 30, true, false).count(),
      this.progress.where('stability').aboveOrEqual(30).count()
    ]);

    this.monitor.broadcast({
      grey, orange, yellow, lightgreen, cyan,
      latestAction: `${entry?.l1 ?? 'TERM'} [${duration.toFixed(1)}s]`
    });
  }

/*
  private async backgroundRefreshStats(entryId: number, duration: number) {
    const entry = await this.vocab.get(entryId);
    const [mastered, learning] = await Promise.all([
      this.progress.where('stability').above(30).count(),
      this.progress.where('state').between(State.Learning, State.Relearning, true, true).count()
    ]);
    
    this.monitor.broadcast({
      mastered,
      learning,
      latestAction: `DONE: ${entry?.l1 ?? 'TERM'} (${duration.toFixed(1)}s)`
    });
  }
    */

  /**
   * HARDENED GAUSSIAN DISTRACTORS
   * Ensures text is unique and visually/frequency similar.
   */
  private async getDistractors(e: VocabEntry, mode: Mode, correct: string): Promise<string[]> {
    const field = mode === Mode.L1ToL2 ? 'l2' : 'l1';
    const ids = new Set<number>();
    
    while(ids.size < 30) {
      const u1 = Math.random(), u2 = Math.random();
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const g = Math.round(z0 * 25 + e.id); 
      if (g > 0 && g <= 2000 && g !== e.id) ids.add(g);
    }

    const rawPool = (await this.vocab.bulkGet(Array.from(ids))).filter((n): n is VocabEntry => !!n);
    const uniqueChoices = new Set<string>();
    
    return rawPool
      .map(n => n[field])
      .filter(text => text.trim().toLowerCase() !== correct.trim().toLowerCase())
      .filter(text => {
        if (uniqueChoices.has(text)) return false;
        uniqueChoices.add(text);
        return true;
      })
      .map(text => ({ 
        val: text, 
        dist: levenshtein.get(correct.toLowerCase(), text.toLowerCase()) 
      }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3)
      .map(x => x.val);
  }
}
