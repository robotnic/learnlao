import { Component } from '@angular/core';
import { FsrsGameComponent } from './learn-fsrs/components/fsrs-game.component';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [FsrsGameComponent],
  template: `
    <app-fsrs-game></app-fsrs-game>
  `
})
export class LearnComponent {}
