import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MemoryMonitorService } from './memory-monitor.service';
import confetti from 'canvas-confetti';

/**
 * NEURAL TELEMETRY HUD (Minimalist White)
 * 30px ultra-lean status bar. 
 * Data conveyed via color-tiering and the top horizon heatmap.
 */
@Component({
  selector: 'app-memory-monitor',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="monitor-bar" *ngIf="monitor.stats$ | async as s">
      <!-- THE HORIZON: 2px Heatmap across the top edge -->
      <div class="horizon">
        <div class="h-seg t-cyan"   [style.flex]="s.cyan"></div>
        <div class="h-seg t-green"  [style.flex]="s.lightgreen"></div>
        <div class="h-seg t-yellow" [style.flex]="s.yellow"></div>
        <div class="h-seg t-orange" [style.flex]="s.orange"></div>
        <div class="h-seg t-grey"   [style.flex]="s.grey + 0.1"></div>
        <div class="h-seg t-green"  [style.flex]="s.lightgreen"></div>
      </div>

      <!-- THE LEGEND: Color-indexed counters -->
      <div class="telemetry">
        <div class="stat"><span class="dot t-grey"></span>{{s.grey}}</div>
        <div class="stat"><span class="dot t-orange"></span>{{s.orange}}</div>
        <div class="stat"><span class="dot t-yellow"></span>{{s.yellow}}</div>
        <div class="stat"><span class="dot t-green"></span>{{s.lightgreen}}</div>
        <div class="stat"><span class="dot t-cyan"></span>{{s.cyan}}</div>
        
        <!-- PIVOT METER: Shows round progress 1-20 -->
        <div class="spacer"></div>
        <div class="pivot-meter">
          {{ (s.orange + s.yellow + s.lightgreen + s.cyan) % 20 + 1 }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { 
      display: block; 
      width: 100%; 
      height: 30px; 
      background: #ffffff; 
      border-bottom: 1px solid #f1f5f9;
      font-family: 'Inter', 'JetBrains Mono', monospace;
      
      /* NEURAL TIER PALETTE */
      --c-grey: #f1f5f9;    /* New/Forgotten */
      --c-orange: #fde047;  /* Encoding */
      --c-yellow: #fbbf24;  /* Volatile */
      --c-green: #4ade80;   /* Developing */
      --c-cyan: #22d3ee;    /* Stabilized */
    }

    .monitor-bar { height: 100%; display: flex; flex-direction: column; }

    /* The 2px Horizon Bar */
    .horizon { display: flex; height: 20px; width: 100%; background: var(--c-grey); }
    .h-seg { height: 100%; transition: flex 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
    
    .t-grey   { background-color: var(--c-grey); }
    .t-orange { background-color: var(--c-orange); }
    .t-yellow { background-color: var(--c-yellow); }
    .t-green  { background-color: var(--c-green); }
    .t-cyan   { background-color: var(--c-cyan); }

    /* The Telemetry Row */
    .telemetry { 
      flex: 1; 
      display: flex; 
      align-items: center; 
      padding: 0 24px; 
    }

    .stat { 
      display: flex; 
      align-items: center; 
      margin-right: 20px; 
      font-size: 11px; 
      font-weight: 700; 
      color: #1e293b; 
      min-width: 40px;
    }

    .dot { 
      width: 6px; 
      height: 6px; 
      border-radius: 1px; 
      margin-right: 8px; 
    }

    .spacer { flex: 1; }

    .pivot-meter { 
      font-size: 10px; 
      font-weight: 800; 
      color: #cbd5e0; 
      letter-spacing: 1px; 
      border: 1px solid #f1f5f9;
      padding: 1px 6px;
      border-radius: 3px;
    }
  `]
})
export class MemoryMonitorComponent {
  constructor(public monitor: MemoryMonitorService) {
    this.monitor.stats$.subscribe(s => {
      const activeCount = s.orange + s.yellow + s.lightgreen + s.cyan;
      if (activeCount > 0 && activeCount % 20 === 0) {
        // High-speed minimalist confetti
        confetti({
          particleCount: 25,
          spread: 40,
          origin: { y: 0.02 }, 
          colors: ['#22d3ee', '#4ade80']
        });
      }
    });
  }
}
