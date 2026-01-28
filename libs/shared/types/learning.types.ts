/**
 * Learning Activity Types
 * Represents user interactions with learning applications
 */

export interface LearningActivity {
  appId: string;
  title: string;
  lessonId: string;
  step: number;
  totalSteps: number;
  path: string;
  level: number;
  activityData?: Record<string, unknown>;
  result: number; // 0 = failed, 1 = passed
  timestamp?: number; // Unix timestamp in seconds
  durationSeconds?: number; // Total time taken to complete the lesson
}

export interface ActivityStats {
  totalActivities: number;
  completedActivities: number;
  averageAccuracy: number;
  totalTimeInSeconds: number;
}

/**
 * Lesson Types
 * Complete type definitions for lesson content and structure
 */

export interface LessonPath {
  id: string;
  name: string;
}

export interface LessonLevel {
  id: string;
  name: string;
}

export interface VocabularyItem {
  id: number;
  laoScript: string;
  romanization: string;
  ipa: string;
  english: string;
  notes: string;
}

export interface GameDefinition {
  id: string;
  name: string;
  type: string; // e.g., "Recognition", "Production"
  duration: number; // minutes
  purpose: string;
  difficulty: string;
  description: string;
}

export interface ActivityFlowStep {
  step: number;
  name: string;
  duration: number; // minutes
  gameId: string;
}

export interface SessionContent {
  description: string;
  videoDescription?: string;
  additionalContent?: string;
}

export interface LessonSession {
  id: number;
  name: string;
  duration: number; // minutes
  day: number | string; // e.g., 1 or "2-3"
  content: SessionContent;
  activity: string;
  accuracyTarget: number; // percentage
  notes: string;
}

export interface QuizOption {
  letter: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  type: 'recognition' | 'production-speaking' | 'context' | 'application' | 'listening';
  prompt: string;
  options?: QuizOption[];
  answer?: string;
  expected?: string;
  audioPhrase?: string;
}

export interface Quiz {
  format: string;
  passingScore: number;
  duration: number; // minutes
  questions: QuizQuestion[];
}

export interface NextLesson {
  id: string;
  title: string;
}

export interface Celebration {
  title: string;
  subtitle: string;
  reward: string;
  animations: string[];
  celebratoryMessage: string;
  statsDisplayed: string[];
  nextLesson: NextLesson;
  actions: string[];
}

export interface ReviewScheduleItem {
  timing: string;
  activity: string;
}

export interface SpacedRepetition {
  carryForwardItems: string;
  reviewSchedule: ReviewScheduleItem[];
}

export interface GameRationale {
  [gameId: string]: string;
}

export interface DifficultyProgressionStep {
  session: number;
  description: string;
}

export interface PedagogicalNotes {
  gameRationale: GameRationale;
  difficultyProgression: DifficultyProgressionStep[];
  motivationFactors: string[];
  toneLanguageConsideration: string;
}

export interface Implementation {
  checklist: string[];
}

export interface Lesson {
  id: string;
  title: string;
  path: LessonPath;
  level: LessonLevel;
  duration: number; // minutes
  proficiencyGoal: string;
  introText: string;
  learningObjectives: string[];
  vocabulary: VocabularyItem[];
  culturalContext: string;
  games: GameDefinition[];
  activityFlow: ActivityFlowStep[];
  sessions: LessonSession[];
  quiz: Quiz;
  celebration: Celebration;
  spacedRepetition: SpacedRepetition;
  pedagogicalNotes: PedagogicalNotes;
  implementation: Implementation;
}

export interface LessonPayload {
  lesson: Lesson;
}
