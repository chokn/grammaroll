import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { GroundTruthMapping, SlotId } from '../diagramming/exercises'

type Level = 1 | 2 | 3

export interface Placement {
  tokenId: string
  slotId: SlotId
}

export interface LevelStats {
  attempts: number
  correct: number
  totalTimeMs: number
  hintCount: number
}

const STORAGE_KEY = 'grammaroll.diagramming.v1'

const defaultStats = (): Record<Level, LevelStats> => ({
  1: { attempts: 0, correct: 0, totalTimeMs: 0, hintCount: 0 },
  2: { attempts: 0, correct: 0, totalTimeMs: 0, hintCount: 0 },
  3: { attempts: 0, correct: 0, totalTimeMs: 0, hintCount: 0 },
})

const loadStats = (): Record<Level, LevelStats> => {
  if (typeof window === 'undefined') {
    return defaultStats()
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultStats()
    const parsed = JSON.parse(raw) as Partial<Record<Level, LevelStats>>
    return {
      1: { ...defaultStats()[1], ...parsed[1] },
      2: { ...defaultStats()[2], ...parsed[2] },
      3: { ...defaultStats()[3], ...parsed[3] },
    }
  } catch (err) {
    console.warn('Failed to load diagramming stats', err)
    return defaultStats()
  }
}

const saveStats = (stats: Record<Level, LevelStats>) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
}

export interface DiagramState {
  level: Level | null
  exerciseIndex: number
  placements: Placement[]
  history: Placement[]
  failedChecks: number
  hintStep: number
  hintUsage: number
  startTime: number | null
  stats: Record<Level, LevelStats>
  setLevel: (level: Level) => void
  setPlacement: (placement: Placement) => void
  setPlacements: (placements: GroundTruthMapping['placements']) => void
  removePlacement: (slotId: SlotId) => void
  resetExercise: () => void
  undo: () => void
  nextExercise: (total: number) => void
  incrementFailedChecks: () => number
  clearFailedChecks: () => void
  useHint: () => number
  resetHints: () => void
  startTimer: () => void
  stopTimer: () => number
  recordAttempt: (level: Level, data: { correct: boolean; durationMs: number }) => void
}

const initialStats = loadStats()

export const useDiagramStore = create<DiagramState>()(
  devtools((set, get) => ({
    level: null,
    exerciseIndex: 0,
    placements: [],
    history: [],
    failedChecks: 0,
    hintStep: 0,
    hintUsage: 0,
    startTime: null,
    stats: initialStats,
    setLevel: (level) => {
      set({ level, exerciseIndex: 0 })
      get().resetExercise()
    },
    setPlacement: ({ tokenId, slotId }) => {
      set((state) => {
        const filtered = state.placements.filter(
          (p) => p.slotId.path !== slotId.path && p.tokenId !== tokenId,
        )
        return {
          placements: [...filtered, { tokenId, slotId }],
          history: [...state.history, { tokenId, slotId }],
        }
      }, false, 'diagram/setPlacement')
    },
    setPlacements: (placements) => {
      set(
        {
          placements: placements.map((p) => ({ tokenId: p.tokenId, slotId: p.slotId })),
        },
        false,
        'diagram/setPlacements',
      )
    },
    removePlacement: (slotId) => {
      set((state) => ({
        placements: state.placements.filter((p) => p.slotId.path !== slotId.path),
      }), false, 'diagram/removePlacement')
    },
    resetExercise: () => {
      set({ placements: [], history: [], failedChecks: 0, hintStep: 0, hintUsage: 0 })
      get().startTimer()
    },
    undo: () => {
      set((state) => {
        if (state.history.length === 0) return state
        const history = [...state.history]
        const last = history.pop()!
        const placements = state.placements.filter((p) => p.slotId.path !== last.slotId.path)
        return { placements, history }
      }, false, 'diagram/undo')
    },
    nextExercise: (total) => {
      set((state) => ({
        exerciseIndex: (state.exerciseIndex + 1) % total,
      }), false, 'diagram/nextExercise')
      get().resetExercise()
    },
    incrementFailedChecks: () => {
      const current = get().failedChecks + 1
      set({ failedChecks: current })
      return current
    },
    clearFailedChecks: () => set({ failedChecks: 0 }),
    useHint: () => {
      let { hintStep, hintUsage } = get()
      if (hintStep >= 3) return hintStep
      hintStep += 1
      hintUsage += 1
      set({ hintStep, hintUsage })
      const { level, stats } = get()
      if (level) {
        const nextStats = {
          ...stats,
          [level]: {
            ...stats[level],
            hintCount: stats[level].hintCount + 1,
          },
        }
        set({ stats: nextStats })
        saveStats(nextStats)
      }
      return hintStep
    },
    resetHints: () => set({ hintStep: 0, hintUsage: 0 }),
    startTimer: () => {
      set({ startTime: Date.now() })
    },
    stopTimer: () => {
      const start = get().startTime
      const elapsed = start ? Date.now() - start : 0
      set({ startTime: null })
      return elapsed
    },
    recordAttempt: (level, { correct, durationMs }) => {
      set((state) => {
        const levelStats = state.stats[level]
        const nextStats = {
          ...state.stats,
          [level]: {
            attempts: levelStats.attempts + 1,
            correct: levelStats.correct + (correct ? 1 : 0),
            totalTimeMs: levelStats.totalTimeMs + durationMs,
            hintCount: levelStats.hintCount,
          },
        }
        saveStats(nextStats)
        return { stats: nextStats }
      })
    },
  }))
)

export default useDiagramStore
