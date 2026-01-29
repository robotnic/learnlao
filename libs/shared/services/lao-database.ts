import Dexie, { Table } from 'dexie';

export interface LaoWord {
  id: string;
  word: string;
  meaning: string;
  category: string;
  usage_rank?: number;
}

export interface ProgressCard {
  id: string;
  state: string;
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  last_review?: number;
}

export class LaoDatabase extends Dexie {
  vocab!: Table<LaoWord>;
  progress!: Table<ProgressCard>;

  constructor() {
    super('LaoDatabase');
    this.version(1).stores({
      vocab: 'id, category, usage_rank',
      progress: 'id, state, due'
    });
  }
}

export const db = new LaoDatabase();
