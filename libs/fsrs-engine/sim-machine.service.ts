import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Rating } from '@squeakyrobot/fsrs';
import { VocabService } from './vocab.service';
import { MemoryMonitorService } from './memory-monitor.service';
import { VocabEntry, Difficulty, Mode } from '@libs/types';

/**
 * SIM MACHINE SERVICE
 * Headless driver for temporal virtualization and stress testing.
 * Uses a private sandbox database to protect real user data.
 */
@Injectable({ providedIn: 'root' })
export class SimMachineService {
  private statusSub = new BehaviorSubject<string>('IDLE');
  status$ = this.statusSub.asObservable();

  // Private instance for the simulation sandbox
  private sandbox: VocabService;

  constructor(private monitor: MemoryMonitorService) {
    // We manually instantiate the sandbox, passing the shared monitor service
    this.sandbox = new VocabService('SimulationSandboxDB', this.monitor);
  }

  /**
   * THE SIMULATION ENGINE
   * Normalizes raw KnowledgeBase data and simulates 6 months of learning.
   */
  async runFullTest(rawKbData: any[]) {
    this.statusSub.next('NORMALIZING_DATA');
    this.monitor.broadcast({ latestAction: 'NORMALIZING_USAGE_RANKS...' });

    // 1. Sort by usage_rank and assign synthetic sequential IDs (1..2000)
    // This resolves the non-unique or missing usage_rank trap.
    const normalized: VocabEntry[] = rawKbData
      .sort((a, b) => (a.usage_rank ?? 9999) - (b.usage_rank ?? 9999))
      .map((item, index) => ({
        id: index + 1,
        originalId: item.id,
        l1: item.english,
        l2: item.lao,
        category: item.category
      }));

    // 2. Initialize Sandbox DB
    await this.sandbox.initialize(normalized);

    // 3. Phase: Marathon (Day 1)
    // Simulates a heavy learning session at the current time.
    this.statusSub.next('MARATHON_MODE');
    const startOfTest = new Date();
    this.sandbox.virtualClock = startOfTest;
    
    for (let i = 0; i < 60; i++) {
      const q = await this.sandbox.getNextChallenge();
      if (!q) break;

      const startTime = performance.now();
      // Simulate "Good" recall with a 10% failure rate
      const rating = Math.random() > 0.1 ? Rating.Good : Rating.Again;
      
      await this.sandbox.submitReview(q.state, rating, startTime);

      // Note: monitor.broadcast is called internally by sandbox.submitReview()
      // so the HUD will update automatically here.
      
      await new Promise(r => setTimeout(r, 40));
    }

    // 4. Phase: Time Jump (6 Months / 180 Days)
    this.statusSub.next('TIME_JUMP_180_DAYS');
    this.monitor.broadcast({ latestAction: 'FAST_FORWARDING_6_MONTHS...' });
    
    const futureDate = new Date(startOfTest);
    futureDate.setMonth(futureDate.getMonth() + 6);
    this.sandbox.virtualClock = futureDate;

    // 5. Phase: Recovery
    // Testing how FSRS handles massive overdueness after the break.
    this.statusSub.next('RECOVERY_MODE');
    const overdueCount = await this.sandbox.progress.where('due').below(futureDate).count();
    this.monitor.broadcast({ latestAction: `DETECTED_${overdueCount}_OVERDUE_CARDS` });

    for (let i = 0; i < 20; i++) {
      const q = await this.sandbox.getNextChallenge();
      if (q) {
        // Simulate "Rusty" recall after a long break (Rating.Hard)
        await this.sandbox.submitReview(q.state, Rating.Hard, performance.now());
        await new Promise(r => setTimeout(r, 100));
      }
    }

    this.statusSub.next('IDLE');
    this.monitor.broadcast({ latestAction: 'SIMULATION_COMPLETE_SUCCESS' });
  }
}
