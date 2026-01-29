import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestHarnessComponent } from './test-harness.component';
import { AwardService } from '../lib/services/award.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TestHarnessComponent],
  providers: [AwardService],
  template: `
    <app-test-harness></app-test-harness>
  `,
  styles: []
})
export class AppComponent {
  title = 'bootlao-award-system';
}
