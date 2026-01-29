import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScoreboardComponent } from '../../../../libs/shared/components/scoreboard/scoreboard.component';
import { AwardService } from '../../../../libs/shared/services/award.service';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [RouterLink, ScoreboardComponent],
  providers: [AwardService],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <a routerLink="/" class="back-link">← Back</a>
          <h1>Progress</h1>
        </header>
        <main>
          <app-scoreboard></app-scoreboard>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .page {
      min-height: 100vh;
      background: #fff;
      padding: 2rem;
    }

    .container {
      max-width: 1200px;
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
      margin: 0 0 2rem 0;
    }
  `]
})
export class ProgressComponent {}
