import type { GradeResponse } from '../lib/scoring'
import { isPunct } from '../lib/text'
import TokenChips from './TokenChips'

export default function FeedbackCard({
  result,
  tokens,
  studentSubject,
  studentPredicate,
}:{
  result: GradeResponse;
  tokens: string[];
  studentSubject: Set<number>;
  studentPredicate: Set<number>;
}){
  const pct = (x:number)=> Math.round(x*100)
  const ansSub = new Set(result.answer.complete_subject)
  const ansPred = new Set(result.answer.complete_predicate)
  const filterNonPunct = (set:Set<number>) => new Set([...set].filter(i => !isPunct(tokens[i])))

  // Filter out punctuation indices before computing diffs
  const fStudentSubject = filterNonPunct(studentSubject)
  const fStudentPredicate = filterNonPunct(studentPredicate)
  const fAnsSub = filterNonPunct(ansSub)
  const fAnsPred = filterNonPunct(ansPred)

  // Compute diffs (ignoring punctuation)
  const extraSubject = new Set([...fStudentSubject].filter(i=> !fAnsSub.has(i)))
  const extraPredicate = new Set([...fStudentPredicate].filter(i=> !fAnsPred.has(i)))
  const missingSubject = new Set([...fAnsSub].filter(i=> !fStudentSubject.has(i)))
  const missingPredicate = new Set([...fAnsPred].filter(i=> !fStudentPredicate.has(i)))
  return (
    <section className="feedback" aria-labelledby="feedback-heading">
      <h2 id="feedback-heading" style={{fontSize: '16px', fontWeight: 700, marginBottom: '8px', marginTop: 0}}>
        {result.isCorrect ? 'Great job!' : 'Review your answer'}
      </h2>
      <div
        className="badge"
        role="group"
        aria-label={`Accuracy scores: Subject ${pct(result.correctness.complete_subject)} percent, Predicate ${pct(result.correctness.complete_predicate)} percent. IoU means intersection over union, a measure of overlap accuracy.`}
      >
        Subject IoU: <strong>{pct(result.correctness.complete_subject)}%</strong> ·
        Predicate IoU: <strong>{pct(result.correctness.complete_predicate)}%</strong>
      </div>
      <div className="answers">
        <div className="answers-row">
          <h3 className="answers-label" id="your-selection-label">Your selection</h3>
          <div className="tokens" aria-labelledby="your-selection-label">
            <TokenChips
              tokens={tokens}
              selectedSubject={fStudentSubject}
              selectedPredicate={fStudentPredicate}
              onToggle={()=>{}}
              mode={'complete_subject'}
              readOnly
              diff={{ extraSubject, extraPredicate }}
            />
          </div>
        </div>
        <div className="answers-row">
          <h3 className="answers-label" id="correct-answer-label">Correct answer</h3>
          <div className="tokens" aria-labelledby="correct-answer-label">
            <TokenChips
              tokens={tokens}
              selectedSubject={fAnsSub}
              selectedPredicate={fAnsPred}
              onToggle={()=>{}}
              mode={'complete_predicate'}
              readOnly
              diff={{ missingSubject, missingPredicate }}
            />
          </div>
        </div>
      </div>
      {result.tips.length>0 && (
        <ul style={{marginTop:8}} aria-label="Tips to improve">
          {result.tips.map((t,i)=>(<li key={i}>{t}</li>))}
        </ul>
      )}
    </section>
  )
}
