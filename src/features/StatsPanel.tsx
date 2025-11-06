import React from 'react';
import { useGrammaroll } from './useGrammaroll';

/**
 * Stats panel component showing Eleanor's progress
 */
export function StatsPanel() {
  const {
    progress,
    currentLevel,
    getRecentStats,
    getTodayStats,
    getWeekStats,
  } = useGrammaroll();

  const todayStats = getTodayStats();
  const weekStats = getWeekStats();
  const recentStats = getRecentStats();

  const overallAccuracy = progress.totalQuestions > 0
    ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100)
    : 0;

  return (
    <div className="stats-panel">
      {/* Current Level */}
      <div className="level-indicator">
        <h3>Current Level</h3>
        <div className="level-stars">
          {[1, 2, 3, 4, 5].map((level) => (
            <span
              key={level}
              className={`star ${level <= currentLevel ? 'filled' : 'empty'}`}
              aria-label={`Level ${level}${level <= currentLevel ? ' completed' : ''}`}
            >
              {level <= currentLevel ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <p className="level-name">
          {currentLevel === 1 && 'Getting Started'}
          {currentLevel === 2 && 'Building Skills'}
          {currentLevel === 3 && 'Doing Great'}
          {currentLevel === 4 && 'Almost Expert'}
          {currentLevel === 5 && 'Grammar Master!'}
        </p>
      </div>

      {/* Streak */}
      <div className="streak-box">
        <h3>🔥 Current Streak</h3>
        <p className="streak-number">{progress.currentStreak}</p>
        <p className="streak-label">in a row</p>
        {progress.longestStreak > progress.currentStreak && (
          <p className="best-streak">
            Best: {progress.longestStreak}
          </p>
        )}
      </div>

      {/* Today's Performance */}
      <div className="today-stats">
        <h3>Today</h3>
        <div className="stat-row">
          <span className="stat-label">Questions:</span>
          <span className="stat-value">{todayStats.totalQuestions}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Correct:</span>
          <span className="stat-value">{todayStats.correctAnswers}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">
            {todayStats.totalQuestions > 0
              ? `${Math.round(todayStats.accuracy)}%`
              : '--'}
          </span>
        </div>
      </div>

      {/* This Week */}
      <div className="week-stats">
        <h3>This Week</h3>
        <div className="stat-row">
          <span className="stat-label">Questions:</span>
          <span className="stat-value">{weekStats.totalQuestions}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">
            {weekStats.totalQuestions > 0
              ? `${Math.round(weekStats.accuracy)}%`
              : '--'}
          </span>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="overall-stats">
        <h3>All Time</h3>
        <div className="stat-row">
          <span className="stat-label">Total Questions:</span>
          <span className="stat-value">{progress.totalQuestions}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Accuracy:</span>
          <span className="stat-value">{overallAccuracy}%</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Longest Streak:</span>
          <span className="stat-value">{progress.longestStreak}</span>
        </div>
      </div>

      {/* Recent Performance Indicator */}
      {recentStats.questionsInWindow > 0 && (
        <div className="recent-performance">
          <h4>Recent Questions</h4>
          <div className="performance-dots">
            {Array.from({ length: recentStats.questionsInWindow }).map((_, i) => {
              // Note: This is simplified - you'd need to track actual results
              return (
                <span
                  key={i}
                  className={`dot ${i < recentStats.correctCount ? 'correct' : 'incorrect'}`}
                  aria-label={i < recentStats.correctCount ? 'Correct' : 'Incorrect'}
                >
                  {i < recentStats.correctCount ? '✓' : '✗'}
                </span>
              );
            })}
          </div>
          <p className="performance-hint">
            {recentStats.questionsUntilEvaluation > 0
              ? `${recentStats.questionsUntilEvaluation} more to check your level!`
              : 'Keep going!'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Compact stats badge for showing during gameplay
 */
export function StatsBadge() {
  const { progress, currentLevel } = useGrammaroll();

  return (
    <div className="stats-badge">
      <div className="badge-item">
        <span className="badge-icon">⭐</span>
        <span className="badge-value">{currentLevel}</span>
      </div>
      <div className="badge-item">
        <span className="badge-icon">🔥</span>
        <span className="badge-value">{progress.currentStreak}</span>
      </div>
      <div className="badge-item">
        <span className="badge-icon">✓</span>
        <span className="badge-value">
          {progress.totalQuestions > 0
            ? Math.round((progress.totalCorrect / progress.totalQuestions) * 100)
            : 0}%
        </span>
      </div>
    </div>
  );
}
