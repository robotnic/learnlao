import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * PROGRESS REPORTING SERVICE
 * 
 * PURPOSE: The single source of truth for the UI. 
 * Both the real 'VocabService' and the 'SimulationEngine' push data here.
 */
export interface AppStats {
  mastered: number;   // Stability (S) > 30 days
  learning: number;   // In the review cycle
  new: number;        // Never seen
  total: number;      // Total card variants (e.g., 8000)
  latestAction: string;
}

@Injectable({ providedIn: 'root' })
export class ProgressReportingService {
  private statsSubject = new BehaviorSubject<AppStats>({
    mastered: 0,
    learning: 0,
    new: 0,
    total: 8000,
    latestAction: 'Initialized'
  });

  // UI components subscribe to this
  stats$: Observable<AppStats> = this.statsSubject.asObservable();

  update(stats: AppStats) {
    this.statsSubject.next(stats);
  }
}
