// Core types for grammaroll scoring and difficulty

export interface QuestionResult {
  id: string;
  timestamp: string;
  sentence: string;
  userAnswer: {
    subject: string;
    predicate: string;
  };
  correctAnswer: {
    subject: string;
    predicate: string;
  };
  isCorrect: boolean;
  difficultyLevel: number;
  timeSpent: number; // seconds
}

export interface SessionStats {
  sessionId: string;
  startTime: string;
  endTime?: string;
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  averageTimePerQuestion: number;
  startDifficulty: number;
  endDifficulty: number;
}

export interface UserProgress {
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  currentStreak: number;
  longestStreak: number;
  currentDifficultyLevel: number;
  history: QuestionResult[];
  sessions: SessionStats[];
  lastPlayedDate: string;
}

export interface DifficultyParameters {
  level: number;
  sentenceLength: [number, number]; // [min, max] words
  allowCompoundSubjects: boolean;
  allowCompoundPredicates: boolean;
  maxPrepositionalPhrases: number;
  allowSubordinateClauses: boolean;
}

export const DIFFICULTY_CONFIGS: Record<number, DifficultyParameters> = {
  1: {
    level: 1,
    sentenceLength: [3, 6],
    allowCompoundSubjects: false,
    allowCompoundPredicates: false,
    maxPrepositionalPhrases: 0,
    allowSubordinateClauses: false,
  },
  2: {
    level: 2,
    sentenceLength: [5, 8],
    allowCompoundSubjects: false,
    allowCompoundPredicates: false,
    maxPrepositionalPhrases: 1,
    allowSubordinateClauses: false,
  },
  3: {
    level: 3,
    sentenceLength: [6, 10],
    allowCompoundSubjects: true,
    allowCompoundPredicates: false,
    maxPrepositionalPhrases: 2,
    allowSubordinateClauses: false,
  },
  4: {
    level: 4,
    sentenceLength: [8, 12],
    allowCompoundSubjects: true,
    allowCompoundPredicates: true,
    maxPrepositionalPhrases: 2,
    allowSubordinateClauses: true,
  },
  5: {
    level: 5,
    sentenceLength: [10, 15],
    allowCompoundSubjects: true,
    allowCompoundPredicates: true,
    maxPrepositionalPhrases: 3,
    allowSubordinateClauses: true,
  },
};
