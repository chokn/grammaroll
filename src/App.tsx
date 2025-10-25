import { useEffect, useState } from 'react'
import logo from './assets/logo.svg'
import { BANK, type Sentence } from './data/bank'
import { grade, type GradeResponse } from './lib/scoring'
import TokenChips from './components/TokenChips'
import FeedbackCard from './components/FeedbackCard'
import Celebration from './components/Celebration'

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
  const [step, setStep] = useState<0 | 1 | 2>(0) // 0: subject, 1: predicate, 2: review
  const [celebrate, setCelebrate] = useState(false)

  const next = () => {
    const pick = BANK[Math.floor(Math.random() * BANK.length)]
    setItem(pick)
    setSel({ complete_subject: new Set(), complete_predicate: new Set() })
    setResult(null)
    setRevealVerb(false)
    setMode('complete_subject')
    setStep(0)
    setCelebrate(false)
  }

  useEffect(() => { next() }, [])

  const toggle = (idx: number) => {
    const currentMode = mode
    const otherMode = mode === 'complete_subject' ? 'complete_predicate' : 'complete_subject'

    const nextSel = new Set(sel[currentMode])
    const otherSel = new Set(sel[otherMode])

    // If clicking a token already selected in current mode, deselect it
    if (nextSel.has(idx)) {
      nextSel.delete(idx)
    } else {
      // Otherwise, add to current mode and remove from other mode
      nextSel.add(idx)
      otherSel.delete(idx)
    }

    setSel({
      [currentMode]: nextSel,
      [otherMode]: otherSel
    } as typeof sel)
  }

  const clearSelections = () => {
    setSel({ complete_subject: new Set(), complete_predicate: new Set() })
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
    setStep(2)
    if(res.isCorrect) setCelebrate(true)
  }

  return (
    <div className="container">
      <Celebration visible={celebrate} onDone={()=> setCelebrate(false)} />
      <div className="card">
        <div className="logo-title">
          <img src={logo} alt="Grammaroll cloud logo"/>
          <div>
            <div className="brand">Grammaroll</div>
            <div className="tagline">Learn grammar on cloud nine ☁️</div>
          </div>
        </div>
        <h1>Subject vs. Predicate (Grade 5)</h1>
        <div className="sub">Follow the steps: first select the complete subject, then the complete predicate, then check.</div>

        <div className="stepper" role="group" aria-label="Steps">
          <div className={`step ${step === 0 ? 'active' : step > 0 ? 'done' : ''}`} aria-current={step === 0 ? 'step' : undefined}>1<span>Subject</span></div>
          <div className="bar"/>
          <div className={`step ${step === 1 ? 'active' : step > 1 ? 'done' : ''}`} aria-current={step === 1 ? 'step' : undefined}>2<span>Predicate</span></div>
          <div className="bar"/>
          <div className={`step ${step === 2 ? 'active' : ''}`} aria-current={step === 2 ? 'step' : undefined}>3<span>Check</span></div>
        </div>

        {item && (
          <div style={{marginTop: 14}}>
            <div className="legend" aria-hidden>
              <span className="swatch subject"/>
              <span>Subject</span>
              <span className="gap"/>
              <span className="swatch predicate"/>
              <span>Predicate</span>
            </div>
            <div className={`tokens mode--${mode}`}>
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
              <button
                className="button ghost"
                onClick={()=>setRevealVerb(true)}
                disabled={revealVerb || step===0}
                aria-label={revealVerb ? "Main verb hint already shown" : "Show main verb hint"}
              >
                Hint: Show main verb
              </button>
              {step < 2 && (
                <button
                  className="button ghost"
                  onClick={clearSelections}
                  disabled={sel.complete_subject.size === 0 && sel.complete_predicate.size === 0}
                  aria-label="Clear all selections"
                >
                  Clear
                </button>
              )}
              {step > 0 && (
                <button
                  className="button"
                  onClick={()=>{ setStep((s)=> (s>0 ? (s-1) as 0|1|2 : s)); setMode('complete_subject'); setResult(null); }}
                  aria-label="Go back to previous step"
                >
                  Back
                </button>
              )}
              {step === 0 && (
                <button
                  className="button primary"
                  disabled={sel.complete_subject.size === 0}
                  onClick={()=>{ setStep(1); setMode('complete_predicate'); }}
                  aria-label="Continue to select predicate"
                >
                  Next: Predicate
                </button>
              )}
              {step === 1 && (
                <button
                  className="button primary"
                  disabled={sel.complete_predicate.size === 0}
                  onClick={submit}
                  aria-label="Check your answer"
                >
                  Check
                </button>
              )}
              {step === 2 && (
                <button
                  className="button primary"
                  onClick={next}
                  aria-label={result?.isCorrect ? 'Move to next sentence' : 'Try another sentence'}
                >
                  {result?.isCorrect ? 'Next sentence' : 'Try another'}
                </button>
              )}
              {step < 2 && (
                <button
                  className="button"
                  onClick={next}
                  aria-label="Skip this sentence and try a new one"
                >
                  Skip
                </button>
              )}
            </div>

            {result && (
              <div role="status" aria-live="polite" aria-atomic="true">
                <div className="sr-only">
                  {result.isCorrect
                    ? 'Correct! You identified both the subject and predicate correctly.'
                    : `Incorrect. Subject accuracy: ${Math.round(result.correctness.complete_subject * 100)}%, Predicate accuracy: ${Math.round(result.correctness.complete_predicate * 100)}%. Please review the feedback below.`}
                </div>
                <FeedbackCard
                  result={result}
                  tokens={item.tokens}
                  studentSubject={sel.complete_subject}
                  studentPredicate={sel.complete_predicate}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="footer">Made for Eleanor 💙</div>
    </div>
  )
}
