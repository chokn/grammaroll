import type { Sentence } from '../data/bank'
import { isPunct } from './text'

export type GradeRequest = {
  sentenceId: string
  student: {
    complete_subject: number[]
    complete_predicate: number[]
  }
}
export type GradeResponse = {
  correctness: { complete_subject: number; complete_predicate: number }
  isCorrect: boolean
  answer: Sentence['spans']
  tips: string[]
  prettySplit: { subject: string; predicate: string }
}

const asSet = (arr:number[]) => new Set(arr)
const iou = (a:number[], b:number[]) => {
  const A = asSet(a), B = asSet(b)
  let inter = 0
  A.forEach(x=>{ if(B.has(x)) inter++ })
  const union = new Set([...a,...b]).size
  return union ? inter/union : 0
}

const filterNonPunct = (indices:number[], tokens:string[]) => indices.filter(i => !isPunct(tokens[i]))

export function grade(req: GradeRequest, item: Sentence): GradeResponse {
  const ans = item.spans
  // Ignore punctuation for scoring fairness
  const sSub = filterNonPunct(req.student.complete_subject, item.tokens)
  const sPred = filterNonPunct(req.student.complete_predicate, item.tokens)
  const aSub = filterNonPunct(ans.complete_subject, item.tokens)
  const aPred = filterNonPunct(ans.complete_predicate, item.tokens)
  const iSub = iou(sSub, aSub)
  const iPred = iou(sPred, aPred)

  const tips: string[] = []
  if (iSub < 0.8) tips.push('Keep every word that tells more about the subject, including attached prepositional or relative clauses.')
  if (iPred < 0.8) tips.push('The complete predicate begins at the main verb and includes its objects, complements, and modifiers.')
  const crossesVerb =
    sSub.some(i => ans.simple_predicate.includes(i)) ||
    sPred.some(i => ans.simple_subject.includes(i))
  if (crossesVerb) tips.push('Find the main verb first; the subject is before it, and the predicate begins with it.')

  const subjectText = item.tokens.filter((_,i)=> ans.complete_subject.includes(i)).join(' ')
  const predicateText = item.tokens.filter((_,i)=> ans.complete_predicate.includes(i)).join(' ')

  return {
    correctness: { complete_subject: iSub, complete_predicate: iPred },
    isCorrect: iSub >= 0.8 && iPred >= 0.8,
    answer: ans,
    tips,
    prettySplit: { subject: subjectText, predicate: predicateText }
  }
}
