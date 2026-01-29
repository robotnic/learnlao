import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  private totalWords = 2000;
  private totalWordsLoaded = false;

  constructor(private http: HttpClient) {
    this.loadTotalWords();
  }

  private loadTotalWords() {
    this.http.get<any>('/assets/knowledge_base.json').subscribe(
      (data) => {
        this.totalWords = (data.vocabulary || []).length;
        this.totalWordsLoaded = true;
        console.log('Total words loaded:', this.totalWords);
      },
      (error) => {
        console.warn('Could not load total word count:', error);
        this.totalWordsLoaded = true; // Don't wait forever
      }
    );
  }

  getStats(): Observable<ProgressStats> {
    return new Observable(observer => {
      // Wait for total words to load, but don't wait forever
      const waitForLoad = setInterval(() => {
        if (this.totalWordsLoaded) {
          clearInterval(waitForLoad);
          this.calculateStats().then(stats => {
            observer.next(stats);
            observer.complete();
          }).catch(err => {
            console.error('Error calculating stats:', err);
            observer.next(this.getDefaultStats());
            observer.complete();
          });
        }
      }, 100);

      // Timeout after 5 seconds
      setTimeout(() => {
        clearInterval(waitForLoad);
        if (!observer.closed) {
          this.calculateStats().then(stats => {
            observer.next(stats);
            observer.complete();
          }).catch(err => {
            console.error('Error calculating stats:', err);
            observer.next(this.getDefaultStats());
            observer.complete();
          });
        }
      }, 5000);
    });
  }

  private async calculateStats(): Promise<ProgressStats> {
    const cards = await db.progress.toArray();
    console.log('Total cards in DB:', cards.length);
    if (cards.length > 0) {
      console.log('First 3 cards:', cards.slice(0, 3));
    }
    
    // Get all unique states
    const uniqueStates = new Set<string>();
    const stateCounts: { [key: string]: number } = {};
    
    cards.forEach(card => {
      const state = card.state || 'Unknown';
      uniqueStates.add(state);
      stateCounts[state] = (stateCounts[state] || 0) + 1;
    });
    
    console.log('Unique states in DB:', Array.from(uniqueStates));
    console.log('All state counts:', stateCounts);

    // Map to display states
    const displayCounts = {
      'Mastered': stateCounts['Review'] || 0,
      'Learning': stateCounts['Learning'] || 0,
      'Lapses': stateCounts['Relearning'] || 0
    };

    // Unseen = total words - all cards in database
    const unseenCount = Math.max(0, this.totalWords - cards.length);

    console.log('Display counts:', displayCounts);
    console.log('Unseen count:', unseenCount);
    console.log('Total words:', this.totalWords);

    // Calculate overall progress
    const activeCards = displayCounts['Mastered'] + displayCounts['Learning'];
    const overallPercent = (activeCards / this.totalWords) * 100;

    const states = [
      { val: displayCounts['Mastered'], label: 'Mastered', color: 'mastered' },
      { val: displayCounts['Learning'], label: 'Learning', color: 'learning' },
      { val: displayCounts['Lapses'], label: 'Lapses', color: 'lapses' },
      { val: unseenCount, label: 'Unseen', color: 'unseen' }
    ];

    console.log('Final stats:', { overall: overallPercent, states });

    return {
      overall: overallPercent,
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
