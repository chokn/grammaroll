import { useState, useEffect, useCallback } from 'react';
import { StorageService } from './storage';
import { DifficultyEngine } from './difficultyEngine';
import type { UserProgress, QuestionResult } from './types';

/**
 * React hook for managing grammaroll game state, scoring, and difficulty
 */
export function useGrammaroll() {
  const [progress, setProgress] = useState<UserProgress>(() =>
    StorageService.getProgress()
  );
  const [difficultyEngine] = useState(() =>
    new DifficultyEngine(progress.currentDifficultyLevel)
  );
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Start session when component mounts
  useEffect(() => {
    StorageService.startSession();
    return () => {
      // End session when component unmounts (user closes tab/app)
      StorageService.endSession();
    };
  }, []);

  /**
   * Start a new question (for timing)
   */
  const startQuestion = useCallback(() => {
    setQuestionStartTime(Date.now());
  }, []);

  /**
   * Submit an answer
   */
  const submitAnswer = useCallback((
    sentence: string,
    userAnswer: { subject: string; predicate: string },
    correctAnswer: { subject: string; predicate: string }
  ) => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect =
      userAnswer.subject.trim().toLowerCase() === correctAnswer.subject.trim().toLowerCase() &&
      userAnswer.predicate.trim().toLowerCase() === correctAnswer.predicate.trim().toLowerCase();

    // Create result object
    const result: QuestionResult = {
      id: `q_${Date.now()}`,
      timestamp: new Date().toISOString(),
      sentence,
      userAnswer,
      correctAnswer,
      isCorrect,
      difficultyLevel: difficultyEngine.getCurrentLevel(),
      timeSpent,
    };

    // Update difficulty
    const { newLevel, levelChanged, direction } = difficultyEngine.recordAnswer(isCorrect);

    // Save to storage
    const updatedProgress = StorageService.recordQuestionResult(result);
    StorageService.updateSession(result);
    setProgress(updatedProgress);

    // Start timer for next question
    startQuestion();

    return {
      isCorrect,
      result,
      levelChanged,
      newLevel,
      direction,
      encouragementMessage: difficultyEngine.getEncouragementMessage(),
    };
  }, [difficultyEngine, questionStartTime, startQuestion]);

  /**
   * Get current difficulty parameters
   */
  const getDifficultyParams = useCallback(() => {
    return difficultyEngine.getDifficultyParams();
  }, [difficultyEngine]);

  /**
   * Get recent performance stats
   */
  const getRecentStats = useCallback(() => {
    return difficultyEngine.getRecentStats();
  }, [difficultyEngine]);

  /**
   * Get today's stats
   */
  const getTodayStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return StorageService.getStatsForDateRange(today, tomorrow);
  }, []);

  /**
   * Get this week's stats
   */
  const getWeekStats = useCallback(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return StorageService.getStatsForDateRange(weekAgo, now);
  }, []);

  /**
   * Manually set difficulty level (parent override)
   */
  const setDifficultyLevel = useCallback((level: number) => {
    difficultyEngine.setLevel(level);
  }, [difficultyEngine]);

  /**
   * Export progress data
   */
  const exportProgress = useCallback(() => {
    return StorageService.exportData();
  }, []);

  /**
   * Import progress data
   */
  const importProgress = useCallback((jsonString: string) => {
    const success = StorageService.importData(jsonString);
    if (success) {
      setProgress(StorageService.getProgress());
    }
    return success;
  }, []);

  /**
   * Reset all progress (with confirmation!)
   */
  const resetProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
      StorageService.resetProgress();
      setProgress(StorageService.getProgress());
      difficultyEngine.setLevel(1);
      return true;
    }
    return false;
  }, [difficultyEngine]);

  return {
    // Progress data
    progress,

    // Actions
    startQuestion,
    submitAnswer,

    // Difficulty
    currentLevel: difficultyEngine.getCurrentLevel(),
    getDifficultyParams,
    getRecentStats,
    setDifficultyLevel,

    // Stats
    getTodayStats,
    getWeekStats,

    // Data management
    exportProgress,
    importProgress,
    resetProgress,
  };
}
