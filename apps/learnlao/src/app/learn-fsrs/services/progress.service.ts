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
      new: all.filter(c => c.state === State.New).length,
      learning: all.filter(c => c.state === State.Learning).length,
      review: all.filter(c => c.state === State.Review).length,
      relearning: all.filter(c => c.state === State.Relearning).length,
    };

    // Active = Learning + Review + Relearning (all non-New)
    const activeCount = counts.learning + counts.review + counts.relearning;
    
    // Group by day (last 7 days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekly = dayNames.map((name, index) => ({
      day: name,
      count: 0 // Placeholder - would need review history table
    }));

    return {
      overall: {
        activePercent: (activeCount / this.TOTAL_WORDS) * 100,
        grayPercent: 100 - (activeCount / this.TOTAL_WORDS) * 100
      },
      states: [
        { label: 'Unseen', val: counts.new, color: 'bg-gray-500' },
        { label: 'Learning', val: counts.learning, color: 'bg-blue-400' },
        { label: 'Mastered', val: counts.review, color: 'bg-green-500' },
        { label: 'Lapses', val: counts.relearning, color: 'bg-red-500' }
      ],
      weekly
    };
  }
}
