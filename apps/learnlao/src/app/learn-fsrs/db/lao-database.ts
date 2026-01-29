import Dexie, { Table } from 'dexie';
import { Vocabulary, Progress } from '../types/learning.types';

export class LaoDatabase extends Dexie {
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

export const db = new LaoDatabase();
