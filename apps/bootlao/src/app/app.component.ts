import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreboardComponent } from '../../../../libs/shared/components/scoreboard/scoreboard.component';
import { AwardService } from '../../../../libs/shared/services/award.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ScoreboardComponent],
  providers: [AwardService],
  template: `
    <app-scoreboard></app-scoreboard>
  `,
  styles: []
})
export class AppComponent {
  title = 'bootlao-award-system';
}
