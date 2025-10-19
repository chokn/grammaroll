type Mode = 'complete_subject' | 'complete_predicate'

export default function ModeToggle({mode, setMode}:{mode:Mode; setMode:(m:Mode)=>void}){
  const mk = (m: Mode, label: string) => (
    <button
      onClick={()=>setMode(m)}
      aria-pressed={mode===m}
      className="button"
    >
      {label}
    </button>
  )
  return <div className="row">{mk('complete_subject','Complete Subject')}{mk('complete_predicate','Complete Predicate')}</div>
}
