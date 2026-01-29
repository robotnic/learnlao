import { Card } from 'ts-fsrs';

export interface Vocabulary {
  id: string;
  lao: string;
  english: string;
  level_id: string;
  phonetic: string;
  category: string;
  usage_rank: number;
  emoji: string;
}

export interface Progress extends Card {
  id: string;
}

export interface Question {
  word: Vocabulary;
  choices: string[];
  audioUrl: string;
}

export interface GameState {
  currentQuestion: Question | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selectedAnswer: string | null;
  isLoading: boolean;
}

export interface SessionStats {
  totalReviewed: number;
  correctCount: number;
  accuracy: number;
}
