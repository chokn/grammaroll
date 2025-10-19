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
  return (
    <>
      {tokens.map((t, i) => {
        const isSel = selected.has(i);
        const isVerb = verbHint?.has(i);
        return (
          <button
            key={i}
            onClick={()=>onToggle(i)}
            aria-pressed={isSel}
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
