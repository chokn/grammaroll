import { useState, type CSSProperties } from 'react'
import type { LevelStats } from '../stores/diagramStore'

export interface ProgressProps {
  stats: LevelStats
  level: 1 | 2 | 3
}

const barContainer: CSSProperties = {
  width: '100%',
  height: 10,
  background: '#e2e8f0',
  borderRadius: 999,
  overflow: 'hidden',
}

const barFill = (value: number): CSSProperties => ({
  width: `${Math.min(100, Math.round(value * 100))}%`,
  height: '100%',
  background: '#38bdf8',
})

const modalStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(15, 23, 42, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 30,
}

const modalCard: CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 24,
  maxWidth: 360,
  width: '90%',
  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.2)',
}

const formatTime = (milliseconds: number) => {
  if (milliseconds <= 0) return '—'
  const seconds = milliseconds / 1000
  return `${seconds.toFixed(1)} s`
}

const Progress = ({ stats, level }: ProgressProps) => {
  const [open, setOpen] = useState(false)
  const successRate = stats.attempts > 0 ? stats.correct / stats.attempts : 0
  const avgTime = stats.attempts > 0 ? stats.totalTimeMs / stats.attempts : 0
  const averageHints = stats.attempts > 0 ? stats.hintCount / stats.attempts : 0

  return (
    <div aria-label={`Progress for level ${level}`} style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontWeight: 600, color: '#0f172a' }}>Level {level} progress</div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            border: '1px solid #cbd5e1',
            borderRadius: 20,
            padding: '2px 10px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            background: '#fff',
          }}
        >
          Details
        </button>
      </div>
      <div style={{ fontSize: '0.8rem', color: '#475467', marginBottom: 4 }}>
        {stats.correct} / {stats.attempts} correct
      </div>
      <div style={barContainer}>
        <div style={barFill(successRate)} aria-hidden />
      </div>
      {open && (
        <div role="dialog" aria-modal="true" aria-label={`Level ${level} progress details`} style={modalStyle}>
          <div style={modalCard}>
            <h3 style={{ marginTop: 0, marginBottom: 12 }}>Level {level} summary</h3>
            <p style={{ margin: '8px 0', color: '#475467' }}>Attempts: {stats.attempts}</p>
            <p style={{ margin: '8px 0', color: '#475467' }}>Correct: {stats.correct}</p>
            <p style={{ margin: '8px 0', color: '#475467' }}>Average time: {formatTime(avgTime)}</p>
            <p style={{ margin: '8px 0', color: '#475467' }}>Average hints used: {averageHints.toFixed(1)}</p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                marginTop: 12,
                padding: '8px 12px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Progress
