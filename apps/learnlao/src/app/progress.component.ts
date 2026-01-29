import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ProgressService } from './learn-fsrs/services/progress.service';

interface ProgressStats {
  overall: number;
  states: { val: number; label: string; color: string }[];
  weekly: { day: string; count: number }[];
}

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <a routerLink="/" class="back-link">← Back</a>
          <h1>Your Progress</h1>
        </header>
        <main *ngIf="stats$ | async as stats">
          <!-- Overall Progress Circle -->
          <div class="progress-section">
            <div class="circle-container">
              <svg class="progress-circle" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" class="bg-circle"></circle>
                <circle cx="60" cy="60" r="54" class="progress-ring" 
                  [style.--circumference]="339.29" 
                  [style.--offset]="getCircleOffset(stats.overall)"></circle>
              </svg>
              <div class="circle-text">
                <span class="percentage">{{ stats.overall | number:'1.0-0' }}%</span>
                <span class="label">Learned</span>
              </div>
            </div>
          </div>

          <!-- Stacked Progress Bar -->
          <div class="bar-section">
            <div class="bar-container">
              <div class="bar-inner">
                <div *ngIf="stats.states[0].val > 0" class="bar-segment mastered" 
                  [style.width.%]="getBarWidth(stats.states[0].val, 2000)"></div>
                <div *ngIf="stats.states[1].val > 0" class="bar-segment learning" 
                  [style.width.%]="getBarWidth(stats.states[1].val, 2000)"></div>
                <div *ngIf="stats.states[2].val > 0" class="bar-segment lapses" 
                  [style.width.%]="getBarWidth(stats.states[2].val, 2000)"></div>
                <div *ngIf="stats.states[3].val > 0" class="bar-segment unseen" 
                  [style.width.%]="getBarWidth(stats.states[3].val, 2000)"></div>
              </div>
            </div>
            
            <!-- Legend -->
            <div class="legend">
              <div *ngIf="stats.states[0].val > 0" class="legend-item">
                <span class="color-box mastered"></span>
                <span class="label">{{ stats.states[0].label }}: {{ stats.states[0].val }}</span>
              </div>
              <div *ngIf="stats.states[1].val > 0" class="legend-item">
                <span class="color-box learning"></span>
                <span class="label">{{ stats.states[1].label }}: {{ stats.states[1].val }}</span>
              </div>
              <div *ngIf="stats.states[2].val > 0" class="legend-item">
                <span class="color-box lapses"></span>
                <span class="label">{{ stats.states[2].label }}: {{ stats.states[2].val }}</span>
              </div>
              <div *ngIf="stats.states[3].val > 0" class="legend-item">
                <span class="color-box unseen"></span>
                <span class="label">{{ stats.states[3].label }}: {{ stats.states[3].val }}</span>
              </div>
            </div>
          </div>

          <!-- State Cards -->
          <div class="cards-section">
            <div *ngFor="let state of stats.states" class="card" [class]="state.color">
              <div class="card-number">{{ state.val }}</div>
              <div class="card-label">{{ state.label }}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --mastered: #4CAF50;
      --learning: #2196F3;
      --lapses: #f44336;
      --unseen: #ccc;
    }

    .page {
      min-height: 100vh;
      background: #fff;
      padding: 2rem;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1rem;
      color: #666;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .back-link:hover {
      color: #000;
    }

    h1 {
      font-size: 2rem;
      font-weight: 300;
      margin: 0;
    }

    main {
      padding: 2rem 0;
    }

    .progress-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .circle-container {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 0 auto;
    }

    .progress-circle {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .bg-circle {
      fill: none;
      stroke: #f0f0f0;
      stroke-width: 6;
    }

    .progress-ring {
      fill: none;
      stroke: var(--mastered);
      stroke-width: 6;
      stroke-linecap: round;
      stroke-dasharray: var(--circumference, 339.29);
      stroke-dashoffset: var(--offset, 0);
      transition: stroke-dashoffset 0.5s ease;
    }

    .circle-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .percentage {
      display: block;
      font-size: 2rem;
      font-weight: 600;
      color: #333;
    }

    .label {
      display: block;
      font-size: 0.85rem;
      color: #999;
      margin-top: 0.25rem;
    }

    .bar-section {
      margin-bottom: 3rem;
    }

    .bar-container {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }

    .bar-inner {
      display: flex;
      height: 20px;
      border-radius: 4px;
      overflow: hidden;
      background: #f0f0f0;
    }

    .bar-segment {
      transition: width 0.3s ease;
    }

    .bar-segment.mastered {
      background: var(--mastered);
    }

    .bar-segment.learning {
      background: var(--learning);
    }

    .bar-segment.lapses {
      background: var(--lapses);
    }

    .bar-segment.unseen {
      background: var(--unseen);
    }

    .legend {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .color-box {
      width: 16px;
      height: 16px;
      border-radius: 2px;
    }

    .color-box.mastered {
      background: var(--mastered);
    }

    .color-box.learning {
      background: var(--learning);
    }

    .color-box.lapses {
      background: var(--lapses);
    }

    .color-box.unseen {
      background: var(--unseen);
    }

    .cards-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .card {
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      color: white;
    }

    .card.mastered {
      background: var(--mastered);
    }

    .card.learning {
      background: var(--learning);
    }

    .card.lapses {
      background: var(--lapses);
    }

    .card.unseen {
      background: var(--unseen);
      color: #333;
    }

    .card-number {
      font-size: 2rem;
      font-weight: 600;
    }

    .card-label {
      font-size: 0.85rem;
      margin-top: 0.5rem;
      opacity: 0.9;
    }
  `]
})
export class ProgressComponent implements OnInit {
  stats$: Observable<any>;

  constructor(private progressService: ProgressService) {
    this.stats$ = this.progressService.getStats();
  }

  ngOnInit(): void {}

  getCircleOffset(percent: number): number {
    const circumference = 339.29;
    return circumference - (percent / 100) * circumference;
  }

  getBarWidth(count: number, total: number): number {
    return (count / total) * 100;
  }
}
