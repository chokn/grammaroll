export default function TokenChips({
  tokens,
  selected,
  onToggle,
  verbHint
}: {
  tokens: string[];
  selected: Set<number>;
  onToggle: (i:number)=>void;
  verbHint?: Set<number>;
}) {
  const isPunct = (tok: string) => tok.length === 1 && ",.;:!?()[]{}'\"-—–".includes(tok)
  return (
    <>
      {tokens.map((t, i) => {
        const isSel = selected.has(i);
        const isVerb = verbHint?.has(i);
        const punct = isPunct(t)
        return (
          <button
            key={i}
            onClick={()=>!punct && onToggle(i)}
            aria-pressed={isSel}
            disabled={punct}
            className={`token${isVerb ? ' verb-hint':''}`}
            title={isVerb ? 'Main verb' : undefined}
          >
            {t}
          </button>
        );
      })}
    </>
  );
}
