import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { db } from '@bootlao/shared/services/lao-database';

interface Vocabulary {
  id: string;
  lao: string;
  english: string;
  phonetic: string;
  category: string;
}

interface Question {
  laoWord: string;
  meaning: string;
  options: string[];
  correctAnswer: string;
  wordId: string;
}

@Component({
  selector: 'app-fsrs-game',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './fsrs-game.component.html',
  styleUrls: ['./fsrs-game.component.css']
})
export class FsrsGameComponent implements OnInit {
  currentQuestion: Question | null = null;
  answered = false;
  selectedCorrect = false;
  accuracy = 0;
  totalAnswered = 0;
  correctAnswers = 0;
  waitingSeconds = 3;
  private waitingInterval: any;
  private vocabulary: Vocabulary[] = [];
  private availableAudioIds = new Set<string>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAvailableAudioIds();
  }

  private loadAvailableAudioIds() {
    // Load list of available audio file IDs
    this.http.get('/assets/audio-ids.txt', { responseType: 'text' }).subscribe(
      (data) => {
        this.availableAudioIds = new Set(
          data.split('\n').map(id => id.trim()).filter(id => id.length > 0)
        );
        this.loadVocabulary();
      },
      (error) => {
        console.warn('Could not load audio IDs list, loading all vocabulary:', error);
        this.loadVocabulary();
      }
    );
  }

  loadVocabulary() {
    this.http.get<any>('/assets/knowledge_base.json').subscribe(
      (data) => {
        let allVocab = data.vocabulary || [];
        
        // Filter to only words with available audio
        if (this.availableAudioIds.size > 0) {
          this.vocabulary = allVocab.filter((v: Vocabulary) => this.availableAudioIds.has(v.id));
        } else {
          this.vocabulary = allVocab;
        }
        
        if (this.vocabulary.length > 0) {
          this.loadNextQuestion();
        }
      },
      (error) => {
        console.error('Failed to load vocabulary:', error);
      }
    );
  }

  loadNextQuestion() {
    this.answered = false;
    this.selectedCorrect = false;
    this.waitingSeconds = 3;
    
    if (this.vocabulary.length === 0) return;

    const randomVocab = this.vocabulary[Math.floor(Math.random() * this.vocabulary.length)];
    const correctMeaning = randomVocab.english;
    
    const otherMeanings = this.vocabulary
      .filter(v => v.id !== randomVocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(v => v.english);

    const options = [correctMeaning, ...otherMeanings].sort(() => Math.random() - 0.5);

    this.currentQuestion = {
      laoWord: randomVocab.lao,
      meaning: correctMeaning,
      options,
      correctAnswer: correctMeaning,
      wordId: randomVocab.id
    };

    // Auto-play audio
    setTimeout(() => this.playAudio(), 100);
  }

  playAudio() {
    if (!this.currentQuestion) return;
    
    const audioElement = document.querySelector('audio') as HTMLAudioElement;
    if (audioElement && this.currentQuestion.wordId) {
      const audioPath = `assets/audio/${this.currentQuestion.wordId}_male.mp3`;
      audioElement.src = audioPath;
      audioElement.play().catch(e => {
        // Silently fail if audio doesn't exist - not all words have audio
        console.debug('Audio unavailable:', audioPath);
      });
    }
  }

  selectAnswer(answer: string) {
    if (this.answered) return;

    this.answered = true;
    this.selectedCorrect = answer === this.currentQuestion?.correctAnswer;
    this.totalAnswered++;

    if (this.selectedCorrect) {
      this.correctAnswers++;
    }

    this.updateAccuracy();

    // Auto advance on wrong answer after 3 seconds
    if (!this.selectedCorrect) {
      this.startWaitingTimer();
    }
  }

  rateCard(rating: string) {
    if (!this.currentQuestion) return;

    // Map rating to FSRS state
    let state = 'Learning';
    if (rating === 'Easy') {
      state = 'Review'; // Mastered
    } else if (rating === 'Good') {
      state = 'Review'; // Keep in review
    } else if (rating === 'Hard') {
      state = 'Learning';
    } else if (rating === 'Again') {
      state = 'Relearning'; // Lapse
    }

    // Save to database
    const now = Date.now();
    db.progress.put({
      id: this.currentQuestion.wordId,
      state,
      due: now + 86400000, // Due tomorrow
      stability: 2,
      difficulty: 5,
      elapsed_days: 0,
      scheduled_days: 1,
      reps: 1,
      lapses: state === 'Relearning' ? 1 : 0,
      last_review: now
    }).then(() => {
      console.log('Saved progress for:', this.currentQuestion!.wordId);
      this.loadNextQuestion();
    }).catch(err => {
      console.error('Error saving progress:', err);
      this.loadNextQuestion();
    });
  }

  private startWaitingTimer() {
    if (this.waitingInterval) clearInterval(this.waitingInterval);
    this.waitingInterval = setInterval(() => {
      this.waitingSeconds--;
      if (this.waitingSeconds <= 0) {
        clearInterval(this.waitingInterval);
        this.loadNextQuestion();
      }
    }, 1000);
  }

  private updateAccuracy() {
    this.accuracy = this.totalAnswered > 0 
      ? Math.round((this.correctAnswers / this.totalAnswered) * 100)
      : 0;
  }
}
