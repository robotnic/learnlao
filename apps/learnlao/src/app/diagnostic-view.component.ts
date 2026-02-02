import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimMachineService, MemoryMonitorComponent } from '@libs/fsrs-engine';
import { KnowledgeBaseService } from '@bootlao/shared/services/knowledge-base.service';

@Component({
  selector: 'app-diagnostic-view',
  standalone: true,
  imports: [CommonModule, MemoryMonitorComponent],
  template: `
    <div class="diag-shell">
      <header>
        <h2 class="glitch-text">FSRS_DIAGNOSTIC_LAB</h2>
        <p>Status: <span class="status-val">{{ sim.status$ | async }}</span></p>
      </header>

      <!-- HUD: The same component used in the marathon, now showing test data -->
      <app-memory-monitor></app-memory-monitor>

      <div class="control-panel">
        <button (click)="runSimulation()" 
                [disabled]="(sim.status$ | async) !== 'IDLE'"
                class="btn-run">
          RUN 6-MONTH SIMULATION
        </button>
        <p class="hint">This will use a Sandbox DB and jump the clock forward 180 days.</p>
      </div>
    </div>
  `,
  styles: [`
    .diag-shell { min-height: 100vh; background: #050505; color: #fff; padding: 30px; font-family: monospace; }
    header { border-bottom: 1px solid #222; margin-bottom: 2rem; padding-bottom: 1rem; }
    .status-val { color: #fbff00; }
    .control-panel { margin-top: 3rem; background: #111; padding: 2rem; border: 1px dashed #444; }
    .btn-run { background: #00f2ff; color: #000; border: none; padding: 15px 30px; font-weight: bold; cursor: pointer; }
    .btn-run:disabled { opacity: 0.3; cursor: not-allowed; }
    .hint { font-size: 10px; color: #666; margin-top: 10px; }
  `]
})
export class DiagnosticViewComponent {
  constructor(
    public sim: SimMachineService,
    private kb: KnowledgeBaseService
  ) {}

  async runSimulation() {
    // Ensure KB is loaded before sending to simulation
    await this.kb.loadKnowledgeBase();
    const data = this.kb.getVocabulary();
    
    // Trigger the Time Machine
    await this.sim.runFullTest(data);
  }
}
