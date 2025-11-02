import { type CSSProperties } from 'react'
import type { Exercise } from './exercises'

export interface ToolboxProps {
  exercise: Exercise
  hintStep: number
  onHint: () => void
  hintDisabled: boolean
  hintMessage: string | null
  onShowSolution: () => void
  canShowSolution: boolean
  failedChecks: number
}

const sectionStyle: CSSProperties = {
  border: '1px solid #d0d5dd',
  borderRadius: '8px',
  padding: '12px',
  background: '#ffffff',
}

const headingStyle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: 8,
  color: '#0f172a',
}

const listStyle: CSSProperties = {
  margin: 0,
  paddingLeft: 18,
  fontSize: '0.9rem',
  color: '#475467',
}

const Button = ({
  label,
  onClick,
  disabled,
  kind = 'default',
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  kind?: 'default' | 'ghost'
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px solid ' + (kind === 'ghost' ? '#cbd5e1' : '#2563eb'),
      background: disabled ? '#e2e8f0' : kind === 'ghost' ? '#f8fafc' : '#2563eb',
      color: disabled ? '#94a3b8' : kind === 'ghost' ? '#1e293b' : '#fff',
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: '100%',
      marginBottom: 8,
      fontWeight: 600,
    }}
  >
    {label}
  </button>
)

const definitions = [
  {
    term: 'Subject',
    text: 'Who or what the sentence is about. It sits on the left of the main line.',
  },
  {
    term: 'Predicate',
    text: 'The main verb. It lives to the right of the vertical bar.',
  },
  {
    term: 'Direct object',
    text: 'Receives the action of the verb and stays on the main line to the right.',
  },
  {
    term: 'Predicate noun/adjective',
    text: 'Renames or describes the subject after a linking verb.',
  },
  {
    term: 'Modifiers',
    text: 'Adjectives and adverbs lean on diagonal lines under the word they describe.',
  },
]

const Toolbox = ({
  exercise,
  hintStep,
  onHint,
  hintDisabled,
  hintMessage,
  onShowSolution,
  canShowSolution,
  failedChecks,
}: ToolboxProps) => {
  return (
    <aside aria-label="Toolbox" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <section style={sectionStyle}>
        <h3 style={headingStyle}>Definitions</h3>
        <ul style={listStyle}>
          {definitions.map((definition) => (
            <li key={definition.term} style={{ marginBottom: 6 }}>
              <strong>{definition.term}:</strong> {definition.text}
            </li>
          ))}
        </ul>
      </section>
      <section style={sectionStyle}>
        <h3 style={headingStyle}>Need a boost?</h3>
        <Button
          label={hintStep === 0 ? 'Hint' : hintStep === 1 ? 'Hint: focus slot' : hintStep === 2 ? 'Hint: place it for me' : 'No more hints'}
          onClick={onHint}
          disabled={hintDisabled}
        />
        <div style={{ fontSize: '0.85rem', color: '#475467', minHeight: 24 }}>
          {hintMessage ?? 'Each hint gives more detail. Hint 3 places a word for you.'}
        </div>
        <Button
          label="Show solution"
          onClick={onShowSolution}
          disabled={!canShowSolution}
          kind="ghost"
        />
        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          {canShowSolution
            ? 'Solution ready—study the diagram, then try the next sentence.'
            : `Solution unlocks after two incorrect checks${failedChecks >= 2 ? '.' : '.'}`}
        </div>
      </section>
      {exercise.teachingNotes && exercise.teachingNotes.length > 0 && (
        <section style={sectionStyle}>
          <h3 style={headingStyle}>Teacher tip</h3>
          <ul style={listStyle}>
            {exercise.teachingNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  )
}

export default Toolbox
