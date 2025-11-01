import { useEffect, useState, type CSSProperties } from 'react'
import { useDiagramStore } from '../stores/diagramStore'
import DiagramPractice from './DiagramPractice'
import { LEVELS, getExercisesByLevel } from './exercises'

const gridStyle: CSSProperties = {
  display: 'grid',
  gap: '16px',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  marginTop: 24,
}

const cardStyle: CSSProperties = {
  border: '1px solid #d0d5dd',
  borderRadius: 12,
  padding: 16,
  background: '#ffffff',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}

const DiagrammingRoute = () => {
  const level = useDiagramStore((state) => state.level)
  const stats = useDiagramStore((state) => state.stats)
  const setLevel = useDiagramStore((state) => state.setLevel)
  const [showPicker, setShowPicker] = useState(level == null)

  useEffect(() => {
    if (level == null) {
      setShowPicker(true)
    }
  }, [level])

  const handleSelect = (nextLevel: 1 | 2 | 3) => {
    setLevel(nextLevel)
    setShowPicker(false)
  }

  const header = (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <div>
        <h1 style={{ marginBottom: 4 }}>Sentence Diagramming Practice</h1>
        <p style={{ margin: 0, color: '#475467' }}>Choose a level to start placing words on Reed–Kellogg diagrams.</p>
      </div>
      {level && !showPicker && (
        <button
          type="button"
          onClick={() => setShowPicker(true)}
          style={{
            padding: '8px 12px',
            borderRadius: 6,
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            cursor: 'pointer',
          }}
        >
          Change level
        </button>
      )}
    </header>
  )

  if (!level || showPicker) {
    return (
      <main style={{ maxWidth: 960, margin: '0 auto', padding: '24px' }}>
        {header}
        <div style={gridStyle}>
          {LEVELS.map((info) => {
            const levelStats = stats[info.id]
            const exercises = getExercisesByLevel(info.id)
            const completed = levelStats.attempts
            return (
              <button
                key={info.id}
                type="button"
                onClick={() => handleSelect(info.id)}
                style={{ ...cardStyle, textAlign: 'left', cursor: 'pointer' }}
                aria-label={`${info.title}. ${info.description}`}
              >
                <div>
                  <h2 style={{ margin: 0 }}>{info.title}</h2>
                  <p style={{ margin: '4px 0', color: '#475467' }}>{info.description}</p>
                </div>
                <div style={{
                  height: 120,
                  borderRadius: 8,
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748b',
                  fontSize: '0.85rem',
                }}>
                  Example: {info.example}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#475467' }}>
                  {completed > 0
                    ? `${levelStats.correct} correct out of ${levelStats.attempts} checks`
                    : `${exercises.length} exercises ready`}
                </div>
              </button>
            )
          })}
        </div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
      {header}
      <DiagramPractice />
    </main>
  )
}

export default DiagrammingRoute
