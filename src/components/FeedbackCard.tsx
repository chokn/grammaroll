import type { GradeResponse } from '../lib/scoring'

export default function FeedbackCard({result, tokens}:{result: GradeResponse; tokens: string[]}){
  const pct = (x:number)=> Math.round(x*100)
  return (
    <section className="feedback">
      <div className="badge">
        Subject IoU: <strong>{pct(result.correctness.complete_subject)}%</strong> ·
        Predicate IoU: <strong>{pct(result.correctness.complete_predicate)}%</strong>
      </div>
      <div className="split">
        <div><strong>Correct split:</strong></div>
        <div><span className="lhs">{result.prettySplit.subject}</span> &nbsp;|&nbsp; <span className="rhs">{result.prettySplit.predicate}</span></div>
      </div>
      {result.tips.length>0 && (
        <ul style={{marginTop:8}}>
          {result.tips.map((t,i)=>(<li key={i}>{t}</li>))}
        </ul>
      )}
    </section>
  )
}
