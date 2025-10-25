import { useEffect, useMemo } from 'react'
import yayGif from '../assets/cinnamoroll-sanrio-yay.gif'

export default function Celebration({ visible, onDone }:{ visible:boolean; onDone?:()=>void }){
  const emojis = ['☁️','✨','💙','🐶','🐾','🎀','⭐️','🍥']
  const pieces = 40

  const items = useMemo(()=> Array.from({length: pieces}).map((_,i)=>{
    const left = Math.random()*100
    const size = 18 + Math.random()*20
    const delay = Math.random()*0.8
    const dur = 2.2 + Math.random()*1.4
    const rotate = (Math.random()*2-1)*120
    const emoji = emojis[i % emojis.length]
    return { id:i, left, size, delay, dur, rotate, emoji }
  }),[])

  useEffect(()=>{
    if(!visible) return
    const t = setTimeout(()=> onDone && onDone(), 3400)
    return ()=> clearTimeout(t)
  },[visible, onDone])

  if(!visible) return null
  return (
    <div className="celebration-overlay" aria-live="polite" role="status">
      <div className="sr-only">Congratulations! Perfect score! 100% correct!</div>
      <div className="celebration-sky" aria-hidden="true"/>
      {items.map(it=> (
        <span
          key={it.id}
          className="celebration-emoji"
          aria-hidden="true"
          style={{
            left: `${it.left}%`,
            fontSize: `${it.size}px`,
            animationDelay: `${it.delay}s`,
            animationDuration: `${it.dur}s`,
            rotate: `${it.rotate}deg`,
          }}
        >{it.emoji}</span>
      ))}
      <div className="celebration-message">
        <img
          src={yayGif}
          alt="Cinnamoroll cheering 'Yay'"
          className="celebration-gif"
        />
        <div className="pop" style={{marginTop: 10}}>Perfect! Cinnamoroll cheers for you! ☁️💙</div>
        <div className="sub">100% correct — cloud nine vibes ✨</div>
      </div>
    </div>
  )
}
