import { isPunct } from '../lib/text'

export default function TokenChips({
  tokens,
  selectedSubject,
  selectedPredicate,
  onToggle,
  verbHint,
  mode,
  readOnly,
  diff
}: {
  tokens: string[];
  selectedSubject: Set<number>;
  selectedPredicate: Set<number>;
  onToggle: (i:number)=>void;
  verbHint?: Set<number>;
  mode: 'complete_subject' | 'complete_predicate'
  readOnly?: boolean;
  diff?: {
    extraSubject?: Set<number>
    extraPredicate?: Set<number>
    missingSubject?: Set<number>
    missingPredicate?: Set<number>
  }
}) {
  // use shared isPunct from lib/text
  return (
    <>
      {tokens.map((t, i) => {
        const inSub = selectedSubject.has(i);
        const inPred = selectedPredicate.has(i);
        const isVerb = verbHint?.has(i);
        const punct = isPunct(t)
        const selClass = inSub && inPred
          ? ' selected selected--both'
          : inSub
          ? ' selected selected--complete_subject'
          : inPred
          ? ' selected selected--complete_predicate'
          : ''
        const badge = inSub && inPred ? 'S/P' : inSub ? 'S' : inPred ? 'P' : ''
        const badgeClass = inSub && inPred ? ' both' : inSub ? ' subject' : inPred ? ' predicate' : ''
        const isExtra = (diff?.extraSubject?.has(i) || diff?.extraPredicate?.has(i)) ?? false
        const isMissing = (diff?.missingSubject?.has(i) || diff?.missingPredicate?.has(i)) ?? false
        const diffClass = isExtra ? ' diff-extra' : isMissing ? ' diff-missing' : ''

        // Build comprehensive aria-label for screen readers
        let ariaLabel = t;
        if (!punct && !readOnly) {
          // Add selection state
          if (inSub && inPred) {
            ariaLabel += ', selected as both subject and predicate';
          } else if (inSub) {
            ariaLabel += ', selected as subject';
          } else if (inPred) {
            ariaLabel += ', selected as predicate';
          } else {
            ariaLabel += `, not selected. Currently selecting ${mode === 'complete_subject' ? 'subject' : 'predicate'}`;
          }
          // Add verb hint
          if (isVerb) {
            ariaLabel += ', main verb';
          }
        } else if (readOnly) {
          // In feedback mode, describe the state
          if (inSub && inPred) {
            ariaLabel += ', marked as both subject and predicate';
          } else if (inSub) {
            ariaLabel += ', marked as subject';
          } else if (inPred) {
            ariaLabel += ', marked as predicate';
          }
          // Add diff information
          if (isExtra) {
            ariaLabel += ', incorrectly selected';
          }
          if (isMissing) {
            ariaLabel += ', should have been selected';
          }
        }

        return (
          <button
            key={i}
            onClick={()=>{ if(!readOnly && !punct) onToggle(i) }}
            aria-pressed={inSub || inPred}
            aria-label={ariaLabel}
            disabled={punct || readOnly}
            className={`token${punct ? ' token--punct' : ''}${isVerb ? ' verb-hint':''}${selClass}${diffClass}`}
            title={isVerb ? 'Main verb' : undefined}
          >
            {t}
            {badge && <span className={`sel-badge${badgeClass}`} aria-hidden="true">{badge}</span>}
            {!punct && isExtra && <span className="diff-badge extra" aria-hidden="true" title="Extra">×</span>}
            {!punct && isMissing && <span className="diff-badge missing" aria-hidden="true" title="Missing">+</span>}
          </button>
        );
      })}
    </>
  );
}
