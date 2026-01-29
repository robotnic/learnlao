import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <a routerLink="/" class="back-link">← Back</a>
          <h1>Learning Progress</h1>
        </header>

        <main *ngIf="stats$ | async as stats">
          <!-- Overall Progress Circle -->
          <div class="overall-section">
            <div class="progress-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" class="bg-circle"></circle>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  class="progress-bar"
                  [style.stroke-dashoffset]="282.7 * (1 - stats.overall.activePercent / 100)"
                ></circle>
              </svg>
              <div class="circle-content">
                <div class="percentage">{{ stats.overall.activePercent | number: '1.0-0' }}%</div>
                <div class="label">Learned</div>
              </div>
            </div>
          </div>

          <!-- States Breakdown -->
          <div class="states-section">
            <h2>Vocabulary States</h2>
            
            <!-- Stacked Progress Bar -->
            <div class="stacked-bar-container">
              <div class="stacked-bar-wrapper">
                <div class="stacked-bar">
                  <!-- Green (Mastered) -->
                  <div 
                    *ngIf="stats.states[2].val > 0"
                    class="bar-segment bg-green-500"
                    [style.width.%]="(stats.states[2].val / 2000) * 100"
                    [title]="'Mastered: ' + stats.states[2].val"
                  ></div>
                  <!-- Blue (Learning) -->
                  <div 
                    *ngIf="stats.states[1].val > 0"
                    class="bar-segment bg-blue-400"
                    [style.width.%]="(stats.states[1].val / 2000) * 100"
                    [title]="'Learning: ' + stats.states[1].val"
                  ></div>
                  <!-- Red (Lapses) -->
                  <div 
                    *ngIf="stats.states[3].val > 0"
                    class="bar-segment bg-red-500"
                    [style.width.%]="(stats.states[3].val / 2000) * 100"
                    [title]="'Lapses: ' + stats.states[3].val"
                  ></div>
                  <!-- Grey (Unseen) -->
                  <div 
                    *ngIf="stats.states[0].val > 0"
                    class="bar-segment bg-gray-500"
                    [style.width.%]="(stats.states[0].val / 2000) * 100"
                    [title]="'Unseen: ' + stats.states[0].val"
                  ></div>
                </div>
              </div>
              <div class="bar-legend">
                <div *ngIf="stats.states[2].val > 0" class="legend-item">
                  <div class="legend-color bg-green-500"></div>
                  <div class="legend-text">
                    <span class="legend-label">Mastered</span>
                    <span class="legend-count">{{ stats.states[2].val }}</span>
                  </div>
                </div>
                <div *ngIf="stats.states[1].val > 0" class="legend-item">
                  <div class="legend-color bg-blue-400"></div>
                  <div class="legend-text">
                    <span class="legend-label">Learning</span>
                    <span class="legend-count">{{ stats.states[1].val }}</span>
                  </div>
                </div>
                <div *ngIf="stats.states[3].val > 0" class="legend-item">
                  <div class="legend-color bg-red-500"></div>
                  <div class="legend-text">
                    <span class="legend-label">Lapses</span>
                    <span class="legend-count">{{ stats.states[3].val }}</span>
                  </div>
                </div>
                <div *ngIf="stats.states[0].val > 0" class="legend-item">
                  <div class="legend-color bg-gray-500"></div>
                  <div class="legend-text">
                    <span class="legend-label">Unseen</span>
                    <span class="legend-count">{{ stats.states[0].val }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Individual State Cards -->
            <div class="state-grid" style="margin-top: 2rem;">
              <div *ngFor="let state of stats.states" class="state-card" [ngClass]="state.color">
                <div class="state-value">{{ state.val }}</div>
                <div class="state-label">{{ state.label }}</div>
              </div>
            </div>
          </div>

          <!-- Weekly Activity -->
          <div class="weekly-section">
            <h2>Weekly Activity</h2>
            <div class="weekly-chart">
              <div *ngFor="let day of stats.weekly" class="day-bar">
                <div class="bar-wrapper">
                  <div class="bar" [style.height.%]="(day.count * 100) / 50"></div>
                </div>
                <div class="day-label">{{ day.day }}</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #f5f5f5;
      padding: 2rem;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .back-link {
      font-size: 1.2rem;
      color: #333;
      text-decoration: none;
      cursor: pointer;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #333;
    }

    h2 {
      color: #555;
      margin-bottom: 1.5rem;
    }

    .overall-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .progress-circle {
      position: relative;
      width: 200px;
      height: 200px;
      margin: 0 auto;
    }

    svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .bg-circle {
      fill: none;
      stroke: #eee;
      stroke-width: 8;
    }

    .progress-bar {
      fill: none;
      stroke: #4CAF50;
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: 282.7;
      transition: stroke-dashoffset 0.3s;
    }

    .circle-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .percentage {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
    }

    .label {
      font-size: 1rem;
      color: #999;
      margin-top: 0.5rem;
    }

    .states-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stacked-bar-container {
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stacked-bar-wrapper {
      display: flex;
      align-items: center;
    }

    .stacked-bar {
      display: flex;
      flex-direction: row;
      height: 40px;
      width: 100%;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .bar-segment {
      flex: 0 1 auto;
      transition: opacity 0.3s;
      cursor: pointer;
      min-width: 4px;
    }

    .bar-segment:hover {
      opacity: 0.8;
    }

    .bar-legend {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }

    .legend-text {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .legend-label {
      font-weight: 600;
      color: #333;
      font-size: 0.9rem;
    }

    .legend-count {
      color: #666;
      font-size: 0.85rem;
    }

    .state-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 1rem;
    }

    .state-card {
      padding: 1.5rem;
      border-radius: 8px;
      text-align: center;
      color: white;
      font-weight: 600;
    }

    .bg-gray-500 {
      background: #9CA3AF;
    }

    .bg-blue-400 {
      background: #60A5FA;
    }

    .bg-green-500 {
      background: #10B981;
    }

    .bg-red-500 {
      background: #EF4444;
    }

    .state-value {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }

    .state-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .weekly-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .weekly-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 200px;
      gap: 1rem;
    }

    .day-bar {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
    }

    .bar-wrapper {
      width: 100%;
      height: 150px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 80%;
      max-width: 40px;
      background: #60A5FA;
      border-radius: 4px 4px 0 0;
      min-height: 4px;
    }

    .day-label {
      margin-top: 0.5rem;
      font-size: 0.85rem;
      color: #666;
      font-weight: 500;
    }
  `]
})
export class ProgressComponent implements OnInit {
  stats$ = this.progressService.getStats();

  constructor(private progressService: ProgressService) {}

  ngOnInit() {
    // Stats are loaded via async pipe
  }
}
