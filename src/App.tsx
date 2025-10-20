import { useEffect, useState } from 'react'
import logo from './assets/logo.svg'
import { BANK, type Sentence } from './data/bank'
import { grade, type GradeResponse } from './lib/scoring'
import ModeToggle from './components/ModeToggle'
import TokenChips from './components/TokenChips'
import FeedbackCard from './components/FeedbackCard'

type Mode = 'complete_subject' | 'complete_predicate'

export default function App(){
  const [item, setItem] = useState<Sentence | null>(null)
  const [mode, setMode] = useState<Mode>('complete_subject')
  const [sel, setSel] = useState<{complete_subject:Set<number>; complete_predicate:Set<number>}>({
    complete_subject: new Set(),
    complete_predicate: new Set()
  })
  const [result, setResult] = useState<GradeResponse | null>(null)
  const [revealVerb, setRevealVerb] = useState(false)

  const next = () => {
    const pick = BANK[Math.floor(Math.random() * BANK.length)]
    setItem(pick)
    setSel({ complete_subject: new Set(), complete_predicate: new Set() })
    setResult(null)
    setRevealVerb(false)
  }

  useEffect(() => { next() }, [])

  const toggle = (idx: number) => {
    const nextSel = new Set(sel[mode])
    nextSel.has(idx) ? nextSel.delete(idx) : nextSel.add(idx)
    setSel({ ...sel, [mode]: nextSel })
  }

  const submit = () => {
    if(!item) return
    const res = grade({
      sentenceId: item.id,
      student: {
        complete_subject: Array.from(sel.complete_subject).sort((a,b)=>a-b),
        complete_predicate: Array.from(sel.complete_predicate).sort((a,b)=>a-b),
      }
    }, item)
    setResult(res)
  }

  return (
    <div className="container">
      <div className="card">
        <div className="logo-title">
          <img src={logo} alt="Grammaroll cloud logo"/>
          <div>
            <div className="brand">Grammaroll</div>
            <div className="tagline">Learn grammar on cloud nine ☁️</div>
          </div>
        </div>
        <h1>Subject vs. Predicate (Grade 5)</h1>
        <div className="sub">Tap the words that belong to the selected part.</div>

        <ModeToggle mode={mode} setMode={setMode} />

        {item && (
          <div style={{marginTop: 14}}>
            <div className="legend" aria-hidden>
              <span className="swatch subject"/>
              <span>Subject</span>
              <span className="gap"/>
              <span className="swatch predicate"/>
              <span>Predicate</span>
            </div>
            <div className="tokens">
              <TokenChips
                tokens={item.tokens}
                selectedSubject={sel.complete_subject}
                selectedPredicate={sel.complete_predicate}
                onToggle={toggle}
                verbHint={revealVerb ? new Set(item.spans.simple_predicate) : undefined}
                mode={mode}
              />
            </div>

            <div className="row" style={{marginTop: 12}}>
              <button className="button ghost" onClick={()=>setRevealVerb(true)} disabled={revealVerb}>Hint: Show main verb</button>
              {result?.isCorrect ? (
                <button className="button primary" onClick={next}>Next sentence</button>
              ) : (
                <>
                  <button className="button primary" onClick={submit}>Check</button>
                  <button className="button" onClick={next}>Skip</button>
                </>
              )}
            </div>

            {result && <FeedbackCard result={result} tokens={item.tokens} />}
          </div>
        )}
      </div>
      <div className="footer">Made for Eleanor 💙</div>
    </div>
  )
}
