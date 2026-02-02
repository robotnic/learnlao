import { Card as FSRSCard, State } from '@squeakyrobot/fsrs';

export enum Difficulty { Standard = 'standard', Expert = 'expert' }
export enum Mode { L1ToL2 = 'l1tol2', L2ToL1 = 'l2tol1' }

export interface VocabEntry {
  id: number;
  originalId: string;
  l1: string;
  l2: string;
  category?: string;
  usage_rank?: number;
  phonetic?: string;
}

export interface MemoryState extends FSRSCard {
  id: string;
  entryId: number;
  level: Difficulty;
  mode: Mode;
  state: State;
  stability: number; // Indexed property
}

export interface AppStats {
  grey: number;       // S < 1
  orange: number;     // 1 <= S < 3
  yellow: number;     // 3 <= S < 10
  lightgreen: number; // 10 <= S < 30
  cyan: number;       // S >= 30
  total: number;
  latestAction: string;
}

export interface QuizChallenge {
  state: MemoryState;
  entry: VocabEntry;
  challenge: string;
  solution: string;
  choices: string[];
  isStandard: boolean;
}
