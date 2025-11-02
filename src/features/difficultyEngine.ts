import { DIFFICULTY_CONFIGS, type DifficultyParameters } from './types';

/**
 * Adaptive difficulty engine that adjusts based on performance
 * Uses a sliding window approach for responsive difficulty changes
 */
export class DifficultyEngine {
  private currentLevel: number;
  private recentResults: boolean[] = [];
  private readonly WINDOW_SIZE = 5; // Last 5 questions
  private readonly MIN_LEVEL = 1;
  private readonly MAX_LEVEL = 5;

  // Thresholds for level changes
  private readonly LEVEL_UP_THRESHOLD = 0.8;   // 80% accuracy to level up
  private readonly LEVEL_DOWN_THRESHOLD = 0.4; // 40% accuracy to level down

  constructor(startingLevel: number = 1) {
    this.currentLevel = Math.max(
      this.MIN_LEVEL,
      Math.min(this.MAX_LEVEL, startingLevel)
    );
  }

  /**
   * Record a question result and potentially adjust difficulty
   */
  recordAnswer(isCorrect: boolean): {
    newLevel: number;
    levelChanged: boolean;
    direction?: 'up' | 'down';
  } {
    const previousLevel = this.currentLevel;

    // Add to recent results
    this.recentResults.push(isCorrect);
    if (this.recentResults.length > this.WINDOW_SIZE) {
      this.recentResults.shift();
    }

    // Adjust difficulty if we have enough data
    if (this.recentResults.length >= Math.min(3, this.WINDOW_SIZE)) {
      this.adjustDifficulty();
    }

    const levelChanged = previousLevel !== this.currentLevel;
    const direction = levelChanged
      ? (this.currentLevel > previousLevel ? 'up' : 'down')
      : undefined;

    return {
      newLevel: this.currentLevel,
      levelChanged,
      direction,
    };
  }

  /**
   * Adjust difficulty based on recent performance
   */
  private adjustDifficulty(): void {
    const correctCount = this.recentResults.filter(Boolean).length;
    const accuracy = correctCount / this.recentResults.length;

    // Level up if doing well and not at max
    if (accuracy >= this.LEVEL_UP_THRESHOLD && this.currentLevel < this.MAX_LEVEL) {
      this.currentLevel++;
      this.recentResults = []; // Reset window after level change
    }
    // Level down if struggling and not at min
    else if (accuracy <= this.LEVEL_DOWN_THRESHOLD && this.currentLevel > this.MIN_LEVEL) {
      this.currentLevel--;
      this.recentResults = []; // Reset window after level change
    }
  }

  /**
   * Get current difficulty level (1-5)
   */
  getCurrentLevel(): number {
    return this.currentLevel;
  }

  /**
   * Get difficulty parameters for current level
   */
  getDifficultyParams(): DifficultyParameters {
    return DIFFICULTY_CONFIGS[this.currentLevel];
  }

  /**
   * Get recent performance stats
   */
  getRecentStats(): {
    questionsInWindow: number;
    correctCount: number;
    accuracy: number;
    questionsUntilEvaluation: number;
  } {
    const correctCount = this.recentResults.filter(Boolean).length;
    const questionsInWindow = this.recentResults.length;
    const accuracy = questionsInWindow > 0 ? correctCount / questionsInWindow : 0;
    const questionsUntilEvaluation = Math.max(
      0,
      Math.min(3, this.WINDOW_SIZE) - questionsInWindow
    );

    return {
      questionsInWindow,
      correctCount,
      accuracy,
      questionsUntilEvaluation,
    };
  }

  /**
   * Can we level up? (for UI hints)
   */
  canLevelUp(): boolean {
    return this.currentLevel < this.MAX_LEVEL;
  }

  /**
   * Can we level down? (for UI hints)
   */
  canLevelDown(): boolean {
    return this.currentLevel > this.MIN_LEVEL;
  }

  /**
   * Get encouragement message based on performance
   */
  getEncouragementMessage(): string {
    const stats = this.getRecentStats();

    if (stats.questionsInWindow < 3) {
      return "Let's get started! 🚀";
    }

    if (stats.accuracy >= 0.8) {
      if (this.canLevelUp()) {
        return `Great job! Keep it up to reach level ${this.currentLevel + 1}! ⭐`;
      }
      return "You're a grammar master! 🎉";
    }

    if (stats.accuracy <= 0.4) {
      return "Take your time and think it through! 💪";
    }

    return "You're doing well! Keep practicing! 👍";
  }

  /**
   * Set level manually (for testing or parent override)
   */
  setLevel(level: number): void {
    this.currentLevel = Math.max(
      this.MIN_LEVEL,
      Math.min(this.MAX_LEVEL, level)
    );
    this.recentResults = []; // Reset window when manually changing level
  }

  /**
   * Get state for persistence
   */
  getState(): { level: number; recentResults: boolean[] } {
    return {
      level: this.currentLevel,
      recentResults: [...this.recentResults],
    };
  }

  /**
   * Restore state from persistence
   */
  setState(state: { level: number; recentResults: boolean[] }): void {
    this.currentLevel = state.level;
    this.recentResults = [...state.recentResults];
  }
}
