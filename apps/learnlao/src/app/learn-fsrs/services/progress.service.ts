import { Injectable } from '@angular/core';
import { db } from '../db/lao-database';
import { State } from 'ts-fsrs';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  readonly TOTAL_WORDS = 2000;

  getStats(): Observable<any> {
    return from(this.calculateStats());
  }

  private async calculateStats() {
    const all = await db.progress.toArray();

    const counts = {
      learning: all.filter(c => c.state === State.Learning).length,
      review: all.filter(c => c.state === State.Review).length,
      relearning: all.filter(c => c.state === State.Relearning).length,
    };
    const seenCount = counts.learning + counts.review + counts.relearning;
    const unseen = this.TOTAL_WORDS - seenCount;
    
    // Group by day (last 7 days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekly = dayNames.map((name, index) => ({
      day: name,
      count: 0 // Placeholder - would need review history table
    }));

    return {
      overall: {
        activePercent: (seenCount / this.TOTAL_WORDS) * 100,
        grayPercent: 100 - (seenCount / this.TOTAL_WORDS) * 100
      },
      states: [
        { label: 'Mastered', val: counts.review, color: 'mastered' },
        { label: 'Learning', val: counts.learning, color: 'learning' },
        { label: 'Lapses', val: counts.relearning, color: 'lapses' },
        { label: 'Unseen', val: unseen, color: 'unseen' }
      ],
      weekly
    };
  }
}
