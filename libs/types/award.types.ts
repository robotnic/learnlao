/**
 * Award System Types
 * Manages user progress, achievements, and statistics
 */

export interface LevelProgress {
  level: number;
  itemsMastered: number;
  totalItems: number;
  percentComplete: number;
}

export interface MedalCollection {
  silver: number;
  gold: number;
  platinum: number;
  master: number;
}

export interface AwardState {
  currentLevel: number;
  levelProgress: LevelProgress[];
  recentActivities: any[]; // LearningActivity[]
  currentStreak: number;
  totalItemsMastered: number;
  medals: MedalCollection;
  weeklyProgress: number[]; // 0-6 for each day of week (Mon-Sun), values 0+
  elapsedTimeSeconds: number; // Total elapsed time for current activity session
  isTimerRunning: boolean;
  activeLessonStopwatch?: { lessonId: string; lessonTitle: string; elapsedSeconds: number }; // Current running lesson stopwatch
  pausedLessons: Array<{ lessonId: string; lessonTitle: string; elapsedSeconds: number; currentStep: number; totalSteps: number }>; // Paused lessons
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: number; // Unix timestamp
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  unlockedAt?: number; // Unix timestamp
}
