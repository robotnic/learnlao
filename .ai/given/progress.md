# progress page

Based on the db entries from fsrs we make a learn progress page.
The button exists on the startpage.
When click open the progress dashboard.

## code snippet

import { Injectable } from '@angular/core';
import { db } from './db.service'; // Your Dexie instance
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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const logs = await db.history.where('review').above(sevenDaysAgo).toArray();

    const counts = {
      new: all.filter(c => c.state === State.New).length,
      learning: all.filter(c => c.state === State.Learning).length,
      review: all.filter(c => c.state === State.Review).length,
      relearning: all.filter(c => c.state === State.Relearning).length,
    };

    const activeCount = this.TOTAL_WORDS - counts.new;
    
    // Group history by day
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekly = dayNames.map((name, index) => ({
      day: name,
      count: logs.filter(l => new Date(l.review).getDay() === index).length
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


# Implementation

Make a todolist here 