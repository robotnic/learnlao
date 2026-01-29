import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LearningService } from '../services/learning.service';
import { GameState, Question, SessionStats } from '../types/learning.types';
import { KnowledgeBaseService } from '../../../../../../libs/shared/services/knowledge-base.service';

@Component({
  selector: 'app-fsrs-game',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterLink],
  template: `
    <div class="page">
      <div class="container">
        <header class="header">
          <a routerLink="/" class="back-link">← Back</a>
          <h1>Vocabulary Drill (FSRS)</h1>
        </header>

        <main>
          <div *ngIf="gameState.isLoading" class="loading">
            Loading next word...
          </div>

          <div *ngIf="!gameState.isLoading && gameState.currentQuestion" class="game-container">
            <!-- Word Display -->
            <div class="word-display">
              <div class="lao-word">{{ gameState.currentQuestion.word.lao }}</div>
            </div>

            <!-- Audio Button -->
            <div class="audio-section">
              <button (click)="playAudio()" class="play-button" [disabled]="gameState.isLoading">
                🔊 Play Sound
              </button>
            </div>

            <!-- Question -->
            <div class="question">
              <p>What does this word mean?</p>
            </div>

            <!-- Multiple Choice -->
            <div class="choices" *ngIf="!gameState.isAnswered">
              <button
                *ngFor="let choice of gameState.currentQuestion.choices"
                (click)="selectAnswer(choice)"
                class="choice-button"
              >
                {{ choice }}
              </button>
            </div>

            <!-- Feedback -->
            <div *ngIf="gameState.isAnswered" class="feedback" [ngClass]="gameState.isCorrect ? 'correct' : 'incorrect'">
              <div class="feedback-text">
                <span *ngIf="gameState.isCorrect">✓ Correct!</span>
                <span *ngIf="!gameState.isCorrect">✗ Wrong!</span>
                <div class="translation">{{ gameState.currentQuestion.word.english }}</div>
              </div>

              <div *ngIf="gameState.isCorrect" class="rating-buttons">
                <p>How difficult was it?</p>
                <button (click)="submitRating(1)" class="rating-btn">Again</button>
                <button (click)="submitRating(2)" class="rating-btn">Hard</button>
                <button (click)="submitRating(3)" class="rating-btn">Good</button>
                <button (click)="submitRating(4)" class="rating-btn">Easy</button>
              </div>

              <div *ngIf="!gameState.isCorrect" class="continue">
                <p>Auto-rated as "Hard" - Next review in 4 days</p>
                <button (click)="nextQuestion()" class="continue-btn">Continue</button>
              </div>
            </div>

            <!-- Session Stats -->
            <div class="stats">
              <p>Progress: {{ stats.correctCount }}/{{ stats.totalReviewed }} correct</p>
              <p *ngIf="stats.totalReviewed > 0">Accuracy: {{ stats.accuracy }}%</p>
            </div>
          </div>

          <div *ngIf="!gameState.isLoading && !gameState.currentQuestion" class="no-words">
            <p>No words to review right now!</p>
            <p>Come back later for more words to review.</p>
            <a routerLink="/" class="back-button">Back to Home</a>
          </div>
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
      max-width: 600px;
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

    .loading {
      text-align: center;
      padding: 2rem;
      font-size: 1.1rem;
      color: #666;
    }

    .game-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .word-display {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 2rem;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .emoji {
      font-size: 3rem;
    }

    .lao-word {
      font-size: 2rem;
      font-weight: 400;
      color: #333;
    }

    .audio-section {
      text-align: center;
    }

    .play-button {
      padding: 1rem 2rem;
      font-size: 1.1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .play-button:hover:not(:disabled) {
      background: #0056b3;
    }

    .play-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .question {
      text-align: center;
      font-size: 1.1rem;
      color: #666;
    }

    .choices {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .choice-button {
      padding: 1rem;
      font-size: 0.95rem;
      background: white;
      border: 2px solid #e5e5e5;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .choice-button:hover {
      border-color: #333;
      background: #f9f9f9;
    }

    .choice-button:active {
      transform: scale(0.98);
    }

    .feedback {
      padding: 2rem;
      border-radius: 8px;
      text-align: center;
    }

    .feedback.correct {
      background: #d4edda;
      color: #155724;
    }

    .feedback.incorrect {
      background: #f8d7da;
      color: #721c24;
    }

    .feedback-text {
      font-size: 1.3rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .translation {
      font-size: 1.1rem;
      margin-top: 0.5rem;
    }

    .rating-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-top: 1rem;
    }

    .rating-buttons p {
      grid-column: 1 / -1;
      margin: 0 0 0.5rem 0;
      font-size: 0.95rem;
    }

    .rating-btn {
      padding: 0.75rem;
      background: white;
      border: 2px solid currentColor;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .rating-btn:hover {
      transform: scale(1.05);
    }

    .continue {
      margin-top: 1rem;
    }

    .continue p {
      font-size: 0.9rem;
      margin: 0 0 1rem 0;
    }

    .continue-btn {
      padding: 0.75rem 1.5rem;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .continue-btn:hover {
      background: #218838;
    }

    .stats {
      text-align: center;
      font-size: 0.9rem;
      color: #666;
      padding: 1rem;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .stats p {
      margin: 0.5rem 0;
    }

    .no-words {
      text-align: center;
      padding: 3rem 1rem;
    }

    .no-words p {
      font-size: 1.1rem;
      color: #666;
      margin: 1rem 0;
    }

    .back-button {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .back-button:hover {
      background: #0056b3;
    }
  `]
})
export class FsrsGameComponent implements OnInit {
  gameState: GameState = {
    currentQuestion: null,
    isAnswered: false,
    isCorrect: null,
    selectedAnswer: null,
    isLoading: true
  };

  stats: SessionStats = {
    totalReviewed: 0,
    correctCount: 0,
    accuracy: 0
  };

  private audioElement: HTMLAudioElement | null = null;

  constructor(
    private learningService: LearningService,
    private kbService: KnowledgeBaseService
  ) {}

  async ngOnInit() {
    try {
      this.gameState.isLoading = true;
      
      // Load knowledge base
      const kb = await firstValueFrom(this.kbService.getKnowledgeBase());
      
      if (kb && kb.vocabulary && kb.vocabulary.length > 0) {
        const vocabWithRank = kb.vocabulary.map((v: any, idx: number) => ({
          ...v,
          usage_rank: idx
        }));
        await this.learningService.seedData(vocabWithRank);
      }

      // Load first question
      await this.loadNextQuestion();
    } catch (error) {
      console.error('Failed to initialize game:', error);
      this.gameState.isLoading = false;
    }
  }

  private async loadNextQuestion() {
    this.gameState.isLoading = true;
    try {
      this.gameState.currentQuestion = await this.learningService.getNextQuestion();
      this.gameState.isAnswered = false;
      this.gameState.isCorrect = null;
      this.gameState.selectedAnswer = null;
      
      // Auto-play audio
      if (this.gameState.currentQuestion) {
        this.playAudio();
      }
    } catch (error) {
      console.error('Failed to load next question:', error);
    } finally {
      this.gameState.isLoading = false;
    }
  }

  playAudio() {
    if (!this.gameState.currentQuestion) return;

    if (this.audioElement) {
      this.audioElement.pause();
    }

    this.audioElement = new Audio(this.gameState.currentQuestion.audioUrl);
    this.audioElement.play().catch(err => {
      console.error('Audio playback error:', err);
    });
  }

  selectAnswer(choice: string) {
    if (this.gameState.isAnswered) return;

    this.gameState.selectedAnswer = choice;
    this.gameState.isCorrect = choice === this.gameState.currentQuestion?.word.english;
    this.gameState.isAnswered = true;

    // Update stats
    this.stats.totalReviewed++;
    if (this.gameState.isCorrect) {
      this.stats.correctCount++;
    }
    this.stats.accuracy = Math.round((this.stats.correctCount / this.stats.totalReviewed) * 100);

    // If wrong, auto-submit with Rating.Again (1) after 3 seconds to show the answer
    if (!this.gameState.isCorrect) {
      setTimeout(() => this.submitRating(1), 3000); // Auto-continue after 3 seconds
    }
  }

  async submitRating(rating: number) {
    if (!this.gameState.currentQuestion) return;

    await this.learningService.processResult(
      this.gameState.currentQuestion.word.id,
      this.gameState.isCorrect || false
    );

    await this.nextQuestion();
  }

  async nextQuestion() {
    await this.loadNextQuestion();
  }
}
