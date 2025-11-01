import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Navigate } from 'react-router-dom'
import { useDiagramStore } from '../stores/diagramStore'
import type { GroundTruthMapping } from './exercises'
import { getExercisesByLevel } from './exercises'
import DiagramCanvas, { type SlotStatus } from './DiagramCanvas'
import TokenTray from './TokenTray'
import Toolbox from './Toolbox'
import Progress from './Progress'
import { useAnnouncer } from './a11y'
import { validate, type Placement, type ValidationResult } from './validation'

const actionsStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginTop: '16px',
}

const actionButton = (kind: 'primary' | 'secondary' | 'ghost'): CSSProperties => ({
  padding: '10px 16px',
  borderRadius: 6,
  border: kind === 'ghost' ? '1px solid #cbd5e1' : '1px solid #2563eb',
  background:
    kind === 'primary' ? '#2563eb' : kind === 'secondary' ? '#f8fafc' : '#ffffff',
  color: kind === 'primary' ? '#fff' : '#1f2937',
  fontWeight: 600,
  cursor: 'pointer',
})

const feedbackStyle: CSSProperties = {
  minHeight: 32,
  marginTop: 8,
  color: '#1d4ed8',
  fontSize: '0.95rem',
}

const toastStyle: CSSProperties = {
  padding: '12px 16px',
  borderRadius: 8,
  background: '#dcfce7',
  color: '#14532d',
  fontWeight: 600,
}

const instructionsStyle: CSSProperties = {
  marginTop: 8,
  fontSize: '0.9rem',
  color: '#475467',
}

const buildStatusMap = (
  placements: Placement[],
  validation: ValidationResult | null,
): Map<string, SlotStatus> => {
  const map = new Map<string, SlotStatus>()
  if (!validation) return map
  if (validation.correct) {
    placements.forEach((placement) => {
      map.set(placement.slotId.path, 'correct')
    })
    return map
  }
  const incorrectSlots = new Set(validation.extras.map((placement) => placement.slotId.path))
  incorrectSlots.forEach((slotPath) => map.set(slotPath, 'incorrect'))
  return map
}

const roleHint = (role: string | undefined) => {
  switch (role) {
    case 'subject':
      return 'Look for the subject slot on the left of the main line.'
    case 'verb':
      return 'Check the predicate slot to the right of the vertical bar.'
    case 'directObject':
      return 'Try the spot on the main line after the verb.'
    case 'predicateAdjective':
    case 'predicateNoun':
      return 'Follow the linking verb across the main line to place the complement.'
    case 'subjectModifier':
      return 'Adjectives lean diagonally beneath the subject.'
    case 'verbModifier':
      return 'Adverbs lean beneath the verb on a diagonal line.'
    default:
      return 'Find the slot whose label matches this word.'
  }
}

const DiagramPractice = () => {
  const level = useDiagramStore((state) => state.level)
  const exerciseIndex = useDiagramStore((state) => state.exerciseIndex)
  const placements = useDiagramStore((state) => state.placements)
  const hintStep = useDiagramStore((state) => state.hintStep)
  const failedChecks = useDiagramStore((state) => state.failedChecks)
  const stats = useDiagramStore((state) => state.stats)
  const {
    setPlacement,
    setPlacements,
    removePlacement,
    resetExercise,
    undo,
    nextExercise,
    incrementFailedChecks,
    clearFailedChecks,
    useHint,
    startTimer,
    stopTimer,
    recordAttempt,
  } = useDiagramStore((state) => ({
    setPlacement: state.setPlacement,
    setPlacements: state.setPlacements,
    removePlacement: state.removePlacement,
    resetExercise: state.resetExercise,
    undo: state.undo,
    nextExercise: state.nextExercise,
    incrementFailedChecks: state.incrementFailedChecks,
    clearFailedChecks: state.clearFailedChecks,
    useHint: state.useHint,
    startTimer: state.startTimer,
    stopTimer: state.stopTimer,
    recordAttempt: state.recordAttempt,
  }))

  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [hintMessage, setHintMessage] = useState<string | null>(null)
  const [highlightedSlots, setHighlightedSlots] = useState<Set<string>>(new Set())
  const [success, setSuccess] = useState(false)

  const { announce, region } = useAnnouncer()

  useEffect(() => {
    startTimer()
    setSelectedTokenId(null)
    setValidationResult(null)
    setFeedback(null)
    setHintMessage(null)
    setHighlightedSlots(new Set())
    setSuccess(false)
  }, [exerciseIndex, level, startTimer])

  if (!level) {
    return <Navigate to="/diagramming" replace />
  }

  const exercises = useMemo(() => getExercisesByLevel(level), [level])
  const exercise = exercises[exerciseIndex]
  const tokens = exercise.tokens

  const placedTokenIds = useMemo(() => new Set(placements.map((placement) => placement.tokenId)), [placements])

  const statusBySlot = useMemo(
    () => buildStatusMap(placements, validationResult),
    [placements, validationResult],
  )

  const handleDrop = (tokenId: string, slotId: GroundTruthMapping['placements'][number]['slotId']) => {
    setPlacement({ tokenId, slotId })
    setSelectedTokenId(null)
    setValidationResult(null)
    setFeedback(null)
    setHighlightedSlots(new Set())
    announce(`${tokens.find((token) => token.id === tokenId)?.text ?? 'Word'} placed.`)
  }

  const handleClear = (slotId: GroundTruthMapping['placements'][number]['slotId']) => {
    removePlacement(slotId)
    setValidationResult(null)
    setHighlightedSlots(new Set())
    announce('Placement removed.')
  }

  const runValidation = () =>
    validate(placements, exercise.answer, exercise.acceptedVariants, {
      tokens: exercise.tokens,
      roles: exercise.roles,
    })

  const handleCheck = () => {
    const result = runValidation()
    setValidationResult(result)
    const elapsed = stopTimer()
    recordAttempt(level, { correct: result.correct, durationMs: elapsed })
    startTimer()
    if (result.correct) {
      setFeedback('Great job! Everything is in the right spot.')
      setSuccess(true)
      clearFailedChecks()
      announce('Diagram complete. Nice work!')
      return
    }
    const attempts = incrementFailedChecks()
    const tip = result.tips[0] ?? 'Check the labels and try again.'
    setFeedback(tip)
    announce(tip)
    if (attempts >= 2) {
      setHintMessage('Need help? Show solution is unlocked.')
    }
  }

  const handleHint = () => {
    const step = useHint()
    if (step > 3) return
    const result = runValidation()
    if (result.correct) {
      setHintMessage('Everything already looks correct!')
      return
    }
    const firstMissing = result.missing[0]
    if (!firstMissing) {
      setHintMessage('Focus on the misplaced words highlighted in red.')
      return
    }
    const targetRoles = exercise.roles[firstMissing.tokenId]
    const message = roleHint(targetRoles?.[0])

    if (step === 1) {
      const eligible = exercise.diagram.constraints
        .filter((constraint) => constraint.accepts.some((role) => targetRoles?.includes(role)))
        .map((constraint) => constraint.slotId.path)
      setHighlightedSlots(new Set(eligible))
      setHintMessage(message)
    } else if (step === 2) {
      setHighlightedSlots(new Set([firstMissing.slotId.path]))
      setHintMessage(`Try placing it on the highlighted slot.`)
    } else if (step === 3) {
      setHighlightedSlots(new Set())
      handleDrop(firstMissing.tokenId, firstMissing.slotId)
      setHintMessage(`Placed ${exercise.tokens.find((token) => token.id === firstMissing.tokenId)?.text}.`)
    }
  }

  const handleReset = () => {
    resetExercise()
    setValidationResult(null)
    setFeedback(null)
    setHintMessage(null)
    setHighlightedSlots(new Set())
    setSelectedTokenId(null)
    setSuccess(false)
    announce('Diagram reset.')
  }

  const handleUndo = () => {
    undo()
    setSelectedTokenId(null)
  }

  const handleSkip = () => {
    nextExercise(getExercisesByLevel(level).length)
  }

  const handleShowSolution = () => {
    setPlacements(exercise.answer.placements)
    setValidationResult({ correct: true, missing: [], extras: [], tips: [] })
    setFeedback('Solution shown. Study the layout before moving on!')
    setHighlightedSlots(new Set())
    setSuccess(true)
    clearFailedChecks()
    announce('Solution filled in.')
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', alignItems: 'start' }}>
        <div>
          <h2>{exercise.sentence}</h2>
          <div style={instructionsStyle}>Drag each word onto the diagram or select a token and press Enter on a slot.</div>
          <TokenTray
            tokens={tokens}
            placedTokenIds={placedTokenIds}
            roles={exercise.roles}
            selectedTokenId={selectedTokenId}
            onSelectToken={setSelectedTokenId}
          />
          <div style={{ marginTop: 16 }}>
            <DiagramCanvas
              spec={exercise.diagram}
              placements={placements}
              tokens={tokens}
              roles={exercise.roles}
              highlightedSlots={highlightedSlots}
              statusBySlot={statusBySlot}
              onDropToken={handleDrop}
              onClearSlot={handleClear}
              selectedTokenId={selectedTokenId}
              announce={announce}
            />
          </div>
          <div style={feedbackStyle} aria-live="polite">
            {feedback}
          </div>
          {success && (
            <div style={{ ...toastStyle, marginTop: 8 }} role="status">
              🎉 Sentence diagrammed! Ready for the next one?
            </div>
          )}
          <div style={actionsStyle}>
            <button
              type="button"
              onClick={handleCheck}
              disabled={placements.length === 0}
              style={{
                ...actionButton('primary'),
                opacity: placements.length === 0 ? 0.6 : 1,
                cursor: placements.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Check
            </button>
            <button
              type="button"
              onClick={handleUndo}
              disabled={placements.length === 0}
              style={{
                ...actionButton('secondary'),
                opacity: placements.length === 0 ? 0.6 : 1,
                cursor: placements.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Undo
            </button>
            <button type="button" style={actionButton('secondary')} onClick={handleReset}>
              Reset
            </button>
            <button type="button" style={actionButton('ghost')} onClick={handleSkip}>
              Skip
            </button>
            {success && (
              <button type="button" style={actionButton('primary')} onClick={() => nextExercise(exercises.length)}>
                Next sentence
              </button>
            )}
          </div>
          <Progress stats={stats[level]} level={level} />
        </div>
        <div>
          <Toolbox
            exercise={exercise}
            hintStep={hintStep}
            onHint={handleHint}
            hintDisabled={hintStep >= 3 || success}
            hintMessage={hintMessage}
            onShowSolution={handleShowSolution}
            canShowSolution={failedChecks >= 2 || success}
            failedChecks={failedChecks}
          />
        </div>
      </div>
      {region}
    </DndProvider>
  )
}

export default DiagramPractice
