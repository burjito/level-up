import { useEffect, useRef, useState } from 'react';
import Confetti from './Confetti.jsx';
import Stars from './Stars.jsx';
import { textOn } from './TeamRank.jsx';
import { playPodiumStep, playDrumRoll, playFanfare } from './sfx.js';

// index 0 = winner. Gold / silver / bronze.
const STYLE = [
  { bg: 'linear-gradient(180deg,#fde68a,#f59e0b)', h: '36vh' },
  { bg: 'linear-gradient(180deg,#f1f5f9,#94a3b8)', h: '27vh' },
  { bg: 'linear-gradient(180deg,#fdba74,#b45309)', h: '20vh' },
];
const ORDINAL = ['1st', '2nd', '3rd'];

// Final results: 3rd place rises first, then 2nd, then a drum roll and the winner with confetti and a fanfare.
export default function Podium({ teams, onClose }) {
  const ranked = [...teams].sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, 3);
  const n = top.length;
  const [stage, setStage] = useState(0); // how many places are showing
  const [rolling, setRolling] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [run, setRun] = useState(0);
  const timers = useRef([]);

  useEffect(() => {
    if (!n) return;
    const at = (ms, fn) => timers.current.push(setTimeout(fn, ms));
    setStage(0);
    setRolling(false);
    setCelebrate(false);
    for (let j = 0; j < n - 1; j++) at(600 + j * 1800, () => { setStage(j + 1); playPodiumStep(n - j); });
    const firstAt = 600 + (n - 1) * 1800 + 1200;
    at(firstAt - 1300, () => { setRolling(true); playDrumRoll(1.3); });
    at(firstAt, () => { setRolling(false); setStage(n); setCelebrate(true); playFanfare(); });
    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
  }, [run, n]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const skip = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRolling(false);
    setStage(n);
    setCelebrate(true);
    playFanfare();
  };
  const done = stage >= n;
  const rankOf = (t) => ranked.findIndex((x) => x.score === t.score) + 1; // ties share a rank

  return (
    <div role="dialog" aria-modal="true" aria-label="Final results" className="fixed inset-0 z-[80] flex flex-col items-center justify-between overflow-hidden bg-white/90 p-6 backdrop-blur-md">
      <Stars />
      <Confetti run={celebrate} />

      <div className="relative z-10 text-center">
        <h2 className="font-display text-5xl text-poster-orange sm:text-6xl">Final results</h2>
        <p className="mt-2 h-8 font-display text-2xl text-poster-violet">{rolling ? 'And the winner is…' : ''}</p>
      </div>

      {/* podium order: 2nd, 1st, 3rd. Names and colors sit below the podium. */}
      <div className="relative z-10 flex w-full max-w-4xl items-end justify-center gap-3 sm:gap-6">
        {[1, 0, 2].filter((i) => i < n).map((i) => {
          const t = top[i];
          const shown = stage >= n - i;
          const rank = rankOf(t);
          return (
            <div key={t.id} className="flex w-1/3 max-w-[16rem] flex-col items-center">
              <div className="relative w-full">
                {i === 0 && shown && <img src="/elements/star-orange.webp" alt="" aria-hidden className="absolute -top-12 left-1/2 h-12 w-12 -translate-x-1/2 animate-float" />}
                <div className="overflow-hidden rounded-t-3xl shadow-xl" style={{ height: shown ? STYLE[i].h : 0, background: STYLE[i].bg, transition: 'height .9s cubic-bezier(.2,.9,.3,1.15)' }}>
                  <p className="pt-4 text-center font-display text-5xl text-white [text-shadow:0_3px_0_rgba(0,0,0,.2)] sm:text-6xl">{ORDINAL[rank - 1] ?? `${rank}th`}</p>
                </div>
              </div>
              <div className={`mt-3 w-full text-center transition-opacity duration-700 ${shown ? 'opacity-100' : 'opacity-0'}`}>
                <p className="truncate rounded-2xl px-4 py-2 font-display text-xl sm:text-2xl" style={{ background: t.color, color: textOn(t.color) }}>{t.name}</p>
                <p className="mt-1 text-sm font-semibold text-ink/60">{t.score} pts</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex gap-3">
        {done
          ? <button onClick={() => setRun((r) => r + 1)} className="btn-ghost">Replay</button>
          : <button onClick={skip} className="btn-ghost">Skip</button>}
        <button onClick={onClose} className="btn-primary">Close</button>
      </div>
    </div>
  );
}
