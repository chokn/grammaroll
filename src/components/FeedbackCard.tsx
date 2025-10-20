import type { GradeResponse } from '../lib/scoring'
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
  // Compute diffs
  const extraSubject = new Set([...studentSubject].filter(i=> !ansSub.has(i)))
  const extraPredicate = new Set([...studentPredicate].filter(i=> !ansPred.has(i)))
  const missingSubject = new Set([...ansSub].filter(i=> !studentSubject.has(i)))
  const missingPredicate = new Set([...ansPred].filter(i=> !studentPredicate.has(i)))
  return (
    <section className="feedback">
      <div className="badge">
        Subject IoU: <strong>{pct(result.correctness.complete_subject)}%</strong> ·
        Predicate IoU: <strong>{pct(result.correctness.complete_predicate)}%</strong>
      </div>
      <div className="answers">
        <div className="answers-row">
          <div className="answers-label">Your selection</div>
          <div className="tokens">
            <TokenChips
              tokens={tokens}
              selectedSubject={studentSubject}
              selectedPredicate={studentPredicate}
              onToggle={()=>{}}
              mode={'complete_subject'}
              readOnly
              diff={{ extraSubject, extraPredicate }}
            />
          </div>
        </div>
        <div className="answers-row">
          <div className="answers-label">Correct answer</div>
          <div className="tokens">
            <TokenChips
              tokens={tokens}
              selectedSubject={ansSub}
              selectedPredicate={ansPred}
              onToggle={()=>{}}
              mode={'complete_predicate'}
              readOnly
              diff={{ missingSubject, missingPredicate }}
            />
          </div>
        </div>
      </div>
      {result.tips.length>0 && (
        <ul style={{marginTop:8}}>
          {result.tips.map((t,i)=>(<li key={i}>{t}</li>))}
        </ul>
      )}
    </section>
  )
}
