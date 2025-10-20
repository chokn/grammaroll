export default function TokenChips({
  tokens,
  selectedSubject,
  selectedPredicate,
  onToggle,
  verbHint,
  mode
}: {
  tokens: string[];
  selectedSubject: Set<number>;
  selectedPredicate: Set<number>;
  onToggle: (i:number)=>void;
  verbHint?: Set<number>;
  mode: 'complete_subject' | 'complete_predicate'
}) {
  const isPunct = (tok: string) => tok.length === 1 && ",.;:!?()[]{}'\"-—–".includes(tok)
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
        return (
          <button
            key={i}
            onClick={()=>!punct && onToggle(i)}
            aria-pressed={inSub || inPred}
            disabled={punct}
            className={`token${isVerb ? ' verb-hint':''}${selClass}`}
            title={isVerb ? 'Main verb' : undefined}
          >
            {t}
            {badge && <span className={`sel-badge${badgeClass}`}>{badge}</span>}
          </button>
        );
      })}
    </>
  );
}
