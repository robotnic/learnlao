import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppStats } from '@libs/types';

/**
 * MEMORY MONITOR SERVICE
 * The reactive hub for the 5-tier stability heatmap.
 */
@Injectable({ providedIn: 'root' })
export class MemoryMonitorService {
  // Initialize with the full 5-tier interface to satisfy the Component
  private statsSub = new BehaviorSubject<AppStats>({
    grey: 0,
    orange: 0,
    yellow: 0,
    lightgreen: 0,
    cyan: 0,
    total: 8000,
    latestAction: 'SYSTEM_BOOT_SUCCESS'
  });

  stats$: Observable<AppStats> = this.statsSub.asObservable();

  /**
   * Broadcasts updates to the 30px Heatmap Ticker.
   */
  broadcast(patch: Partial<AppStats>): void {
    const current = this.statsSub.value;
    this.statsSub.next({ ...current, ...patch });
  }

  /**
   * Resets counts for new sessions or simulations.
   */
  reset(totalEntries: number = 2000): void {
    this.statsSub.next({
      grey: totalEntries * 4, // Initially all are grey/unseen
      orange: 0,
      yellow: 0,
      lightgreen: 0,
      cyan: 0,
      total: totalEntries * 4,
      latestAction: 'MONITOR_RESET'
    });
  }
}
