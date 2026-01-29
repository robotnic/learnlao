import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { db } from './lao-database';

export interface ProgressStats {
  overall: number;
  states: { val: number; label: string; color: string }[];
  weekly: { day: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private readonly TOTAL_WORDS = 2000;

  getStats(): Observable<ProgressStats> {
    return new Observable(observer => {
      this.calculateStats().then(stats => {
        observer.next(stats);
        observer.complete();
      }).catch(err => {
        console.error('Error calculating stats:', err);
        observer.next(this.getDefaultStats());
        observer.complete();
      });
    });
  }

  private async calculateStats(): Promise<ProgressStats> {
    const cards = await db.progress.toArray();
    
    // Count by state
    const stateCounts = {
      'New': 0,
      'Learning': 0,
      'Review': 0,
      'Relearning': 0
    };

    cards.forEach(card => {
      const state = card.state || 'New';
      if (state in stateCounts) {
        stateCounts[state as keyof typeof stateCounts]++;
      }
    });

    // Calculate active count (non-New states)
    const activeCount = stateCounts['Learning'] + stateCounts['Review'] + stateCounts['Relearning'];
    const activePercent = (activeCount / this.TOTAL_WORDS) * 100;

    // States in order: Mastered (Review), Learning, Lapses (Relearning), Unseen (New)
    const states = [
      { val: stateCounts['Review'], label: 'Mastered', color: 'mastered' },
      { val: stateCounts['Learning'], label: 'Learning', color: 'learning' },
      { val: stateCounts['Relearning'], label: 'Lapses', color: 'lapses' },
      { val: stateCounts['New'], label: 'Unseen', color: 'unseen' }
    ];

    return {
      overall: activePercent,
      states,
      weekly: this.getWeeklyData()
    };
  }

  private getDefaultStats(): ProgressStats {
    return {
      overall: 0,
      states: [
        { val: 0, label: 'Mastered', color: 'mastered' },
        { val: 0, label: 'Learning', color: 'learning' },
        { val: 0, label: 'Lapses', color: 'lapses' },
        { val: 0, label: 'Unseen', color: 'unseen' }
      ],
      weekly: []
    };
  }

  private getWeeklyData() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({ day, count: 0 }));
  }
}
