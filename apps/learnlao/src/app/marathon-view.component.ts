import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Rating } from "@squeakyrobot/fsrs";
import {
  VocabService,
  QuizChallenge,
  MemoryMonitorComponent,
} from "@libs/fsrs-engine";
import { KnowledgeBaseService } from "@bootlao/shared/services/knowledge-base.service";
import { RouterLink } from "@angular/router";

/**
 * MARATHON VIEW: Minimalist White Zen Canvas
 * Optimised for 10-hour sessions with high-legibility Lao script.
 */
@Component({
  selector: "app-marathon-view",
  standalone: true,
  imports: [CommonModule, MemoryMonitorComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="marathon-canvas">
      <a routerLink="/" class="back-link">← Back</a>
      <!-- HUD: Pinned to top, follows the white theme -->
      <app-memory-monitor class="minimal-hud"></app-memory-monitor>

      <!-- SEEDING UI: Entry point for the first session -->
      <div class="zen-gate" *ngIf="!quiz && !isBusy">
        <h1 class="zen-title">Link Stable.</h1>
        <p class="zen-subtitle">
          Ready to begin your neural frequency session?
        </p>
        <button (click)="startNewSession()" class="btn-primary">
          START_MARATHON
        </button>
      </div>

      <!-- LOADING STATE -->
      <div class="zen-gate" *ngIf="isBusy">
        <div class="spinner"></div>
        <p>SYNCHRONIZING_DATABASE...</p>
      </div>

      <!-- THE CORE GAME LOOP -->
      <main class="zen-container" *ngIf="quiz && !isBusy">
        <header class="card-meta">
          <span>RANK #{{ quiz.entry.id }}</span>
          <span>{{ quiz.entry.category || "Core" }}</span>
        </header>

        <section class="prompt-section">
          <h1 class="challenge-term">{{ quiz.challenge }}</h1>
          <div class="audio-row" *ngIf="quiz.isStandard">
            <button
              (click)="playAudio(quiz.entry.id)"
              class="btn-audio-minimal"
            >
              🔊
              <span class="phonetic" *ngIf="quiz.entry.phonetic"
                >[{{ quiz.entry.phonetic }}]</span
              >
            </button>
          </div>
        </section>

        <section class="answer-grid">
          <button
            *ngFor="let choice of quiz.choices"
            (click)="onSelect(choice)"
            class="choice-card"
            [class.correct]="selectedChoice === choice && isCorrect"
            [class.wrong]="selectedChoice === choice && isCorrect === false"
            [class.is-hint]="correctChoice === choice"
            [class.dimmed]="
              selectedChoice &&
              selectedChoice !== choice &&
              correctChoice !== choice
            "
          >
            {{ choice }}
          </button>
        </section>

        <footer class="footer-actions">
          <button
            (click)="submit(4)"
            class="btn-skip"
            [disabled]="selectedChoice !== null"
          >
            ALREADY_KNOWN (EASY)
          </button>
        </footer>
      </main>

      <ng-template #sessionEnd>
        <div class="zen-gate">
          <h2>Frequency Block Stabilized</h2>
          <button (click)="loadNext()" class="btn-primary">
            REFRESH_HORIZON
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [
    `
      :host {
        --text: #1a202c;
        --muted: #a0aec0;
        --bg: #ffffff;
        --border: #edf2f7;
        --accent: #3182ce;
        --success: #48bb78;
        --error: #f56565;
        --hint: #3182ce;
      }

      .marathon-canvas {
        min-height: 100vh;
        background: var(--bg);
        color: var(--text);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family:
          "Inter",
          -apple-system,
          sans-serif;
      }

      .minimal-hud {
        width: 100%;
        max-width: 800px;
        margin-top: 1rem;
        border: 1px solid var(--border);
      }

      .zen-gate {
        text-align: center;
        margin-top: 25vh;
      }
      .zen-title {
        font-size: 2.5rem;
        font-weight: 300;
      }

      .zen-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        max-width: 800px;
        padding: 2rem;
      }

      .card-meta {
        display: flex;
        justify-content: space-between;
        font-size: 0.7rem;
        font-weight: 600;
        color: var(--muted);
        letter-spacing: 0.1em;
        margin-bottom: 2rem;
      }

      .prompt-section {
        text-align: center;
        margin-bottom: 4rem;
      }
      .challenge-term {
        font-family: "Noto Sans Lao Looped", sans-serif;

        font-size: 3rem;
        font-weight: 800;
        line-height: 1.1;
        margin-bottom: 1rem;
      }

      .btn-audio-minimal {
        background: #fff;
        border: 1px solid var(--border);
        padding: 0.6rem 1.2rem;
        border-radius: 30px;
        cursor: pointer;
        color: var(--accent);
      }
      .phonetic {
        margin-left: 8px;
        font-weight: 400;
        color: var(--muted);
      }

      /* Answer Grid with 2.2rem scaling */
      .answer-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      .choice-card {
        font-family: "Noto Sans Lao Looped", sans-serif;

        font-optical-sizing: auto;
        font-weight: <weight>;
        font-style: normal;
        font-variation-settings: "wdth" 600;

        background: #fff;
        border: 2px solid var(--border);
        padding: 2.5rem 1.5rem;
        border-radius: 20px;
        font-size: 1.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--text);
      }
      .choice-card:hover:not(.dimmed) {
        border-color: var(--accent);
        transform: translateY(-4px);
        box-shadow: 0 12px 20px rgba(0, 0, 0, 0.05);
      }

      /* Feedback States */
      .choice-card.correct {
        border-color: var(--success) !important;
        background: #f0fff4 !important;
        color: #2f855a !important;
      }
      .choice-card.wrong {
        border-color: var(--error) !important;
        background: #fff5f5 !important;
        color: #c53030 !important;
        animation: shake 0.4s both;
      }
      .choice-card.is-hint {
        border-color: var(--hint) !important;
        background: #ebf8ff !important;
        color: #2c5282 !important;
        transform: scale(1.05);
        z-index: 10;
      }
      .choice-card.dimmed {
        opacity: 0.2;
        filter: grayscale(1);
        cursor: default;
      }

      .footer-actions {
        margin-top: 5rem;
        text-align: center;
      }
      .btn-skip {
        background: none;
        border: none;
        color: var(--muted);
        cursor: pointer;
        text-decoration: underline;
        font-size: 1rem;
      }
      .btn-primary {
        background: var(--accent);
        color: white;
        border: none;
        padding: 1rem 2.5rem;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
      }

      @keyframes shake {
        10%,
        90% {
          transform: translate3d(-1px, 0, 0);
        }
        20%,
        80% {
          transform: translate3d(2px, 0, 0);
        }
        30%,
        50%,
        70% {
          transform: translate3d(-4px, 0, 0);
        }
        40%,
        60% {
          transform: translate3d(4px, 0, 0);
        }
      }

      .spinner {
        border: 4px solid var(--border);
        border-top: 4px solid var(--accent);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
      }
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      .back-link {
        display: inline-block;
        color: #666;
        text-decoration: none;
        font-size: 0.9rem;
        margin-bottom: 1rem;
        transition: color 0.3s;
      }
    `,
  ],
})
export class MarathonViewComponent implements OnInit {
  quiz: QuizChallenge | null = null;
  startTime = 0;
  isBusy = false;
  selectedChoice: string | null = null;
  isCorrect: boolean | null = null;
  correctChoice: string | null = null;

  constructor(
    private vocabService: VocabService,
    private kbService: KnowledgeBaseService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    this.quiz = await this.vocabService.getNextChallenge();
    if (this.quiz) this.startTime = performance.now();
    this.cdr.markForCheck();
  }

  async startNewSession() {
    this.isBusy = true;
    this.cdr.markForCheck();
    await this.kbService.loadKnowledgeBase();
    const rawData = this.kbService.getVocabulary();

    const normalized = rawData
      .sort((a, b) => (a.usage_rank ?? 9999) - (b.usage_rank ?? 9999))
      .map((item, index) => ({
        id: index + 1,
        originalId: item.id,
        l1: item.english,
        l2: item.lao,
        phonetic: item.phonetic,
        category: item.category,
      }));

    await this.vocabService.initialize(normalized);
    await this.loadNext();
    this.isBusy = false;
    this.cdr.markForCheck();
  }

  async loadNext() {
    this.quiz = await this.vocabService.getNextChallenge();
    console.log(this.quiz);
    this.playAudio(this.quiz?.entry.originalId);
    this.startTime = performance.now();
    this.selectedChoice = null;
    this.isCorrect = null;
    this.correctChoice = null;
    this.cdr.markForCheck();
  }

  async onSelect(choice: string) {
    if (!this.quiz || this.selectedChoice) return;

    this.selectedChoice = choice;
    this.isCorrect = choice === this.quiz.solution;

    // Hint Reveal: Highlight the correct answer if the user failed
    if (!this.isCorrect) {
      this.correctChoice = this.quiz.solution;
    }

    this.cdr.markForCheck();

    // Psychological Pacing: 450ms for success, 1000ms for corrective hint processing
    await new Promise((r) => setTimeout(r, this.isCorrect ? 450 : 1000));

    const rating = this.isCorrect ? Rating.Good : Rating.Again;
    await this.submit(rating);
  }

  async submit(rating: Rating) {
    if (!this.quiz) return;
    await this.vocabService.submitReview(
      this.quiz.state,
      rating,
      this.startTime,
    );
    await this.loadNext();
  }

  playAudio(id: number | string | undefined) {
    const selectedVoice = "female";
    const url = `https://robotnic.github.io/audiofiles/audio/${id}_${selectedVoice}.mp3`;
    new Audio(url).play();
  }
}
