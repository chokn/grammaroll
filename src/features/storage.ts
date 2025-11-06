import type { UserProgress, QuestionResult, SessionStats } from './types';

const STORAGE_KEY = 'grammaroll_progress';
const CURRENT_SESSION_KEY = 'grammaroll_current_session';

export class StorageService {
  /**
   * Get user's complete progress data
   */
  static getProgress(): UserProgress {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.getInitialProgress();
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error loading progress:', error);
      return this.getInitialProgress();
    }
  }

  /**
   * Save complete progress data
   */
  static saveProgress(progress: UserProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  /**
   * Add a question result and update stats
   */
  static recordQuestionResult(result: QuestionResult): UserProgress {
    const progress = this.getProgress();

    // Add to history (keep last 500 questions)
    progress.history.unshift(result);
    if (progress.history.length > 500) {
      progress.history = progress.history.slice(0, 500);
    }

    // Update totals
    progress.totalQuestions++;
    if (result.isCorrect) {
      progress.totalCorrect++;
      progress.currentStreak++;
      if (progress.currentStreak > progress.longestStreak) {
        progress.longestStreak = progress.currentStreak;
      }
    } else {
      progress.totalIncorrect++;
      progress.currentStreak = 0;
    }

    progress.lastPlayedDate = new Date().toISOString();
    progress.currentDifficultyLevel = result.difficultyLevel;

    this.saveProgress(progress);
    return progress;
  }

  /**
   * Start a new session
   */
  static startSession(): SessionStats {
    const session: SessionStats = {
      sessionId: `session_${Date.now()}`,
      startTime: new Date().toISOString(),
      questionsAttempted: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      averageTimePerQuestion: 0,
      startDifficulty: this.getProgress().currentDifficultyLevel,
      endDifficulty: this.getProgress().currentDifficultyLevel,
    };

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
    return session;
  }

  /**
   * Get current session or start a new one
   */
  static getCurrentSession(): SessionStats {
    try {
      const stored = localStorage.getItem(CURRENT_SESSION_KEY);
      if (!stored) {
        return this.startSession();
      }
      return JSON.parse(stored);
    } catch {
      return this.startSession();
    }
  }

  /**
   * Update current session with question result
   */
  static updateSession(result: QuestionResult): void {
    const session = this.getCurrentSession();

    session.questionsAttempted++;
    if (result.isCorrect) {
      session.correctAnswers++;
    } else {
      session.incorrectAnswers++;
    }

    // Update average time
    const totalTime = session.averageTimePerQuestion * (session.questionsAttempted - 1) + result.timeSpent;
    session.averageTimePerQuestion = totalTime / session.questionsAttempted;

    session.endDifficulty = result.difficultyLevel;

    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  }

  /**
   * End current session and save to history
   */
  static endSession(): void {
    const session = this.getCurrentSession();
    session.endTime = new Date().toISOString();

    const progress = this.getProgress();
    progress.sessions.unshift(session);

    // Keep last 50 sessions
    if (progress.sessions.length > 50) {
      progress.sessions = progress.sessions.slice(0, 50);
    }

    this.saveProgress(progress);
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }

  /**
   * Get stats for a date range
   */
  static getStatsForDateRange(startDate: Date, endDate: Date): {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageLevel: number;
  } {
    const progress = this.getProgress();
    const filtered = progress.history.filter(q => {
      const qDate = new Date(q.timestamp);
      return qDate >= startDate && qDate <= endDate;
    });

    const totalQuestions = filtered.length;
    const correctAnswers = filtered.filter(q => q.isCorrect).length;
    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
    const averageLevel = totalQuestions > 0
      ? filtered.reduce((sum, q) => sum + q.difficultyLevel, 0) / totalQuestions
      : 1;

    return { totalQuestions, correctAnswers, accuracy, averageLevel };
  }

  /**
   * Export data as JSON (for backup or cloud sync)
   */
  static exportData(): string {
    return JSON.stringify(this.getProgress(), null, 2);
  }

  /**
   * Import data from JSON
   */
  static importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString) as UserProgress;
      this.saveProgress(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Reset all progress (with confirmation!)
   */
  static resetProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }

  private static getInitialProgress(): UserProgress {
    return {
      totalQuestions: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      currentStreak: 0,
      longestStreak: 0,
      currentDifficultyLevel: 1,
      history: [],
      sessions: [],
      lastPlayedDate: new Date().toISOString(),
    };
  }
}
