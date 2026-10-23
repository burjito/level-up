import { useEffect, useRef, useState } from 'react';
import Confetti from './Confetti.jsx';
import Stars from './Stars.jsx';
import { textOn } from './TeamRank.jsx';
import { playPodiumStep, playDrumRoll, playFanfare } from './sfx.js';

// index 0 = winner. Gold / silver / bronze.
const STYLE = [
  { bg: 'linear-gradient(180deg,#fde68a,#f59e0b)', f: 1 },
  { bg: 'linear-gradient(180deg,#f1f5f9,#94a3b8)', f: 0.75 },
  { bg: 'linear-gradient(180deg,#fdba74,#b45309)', f: 0.55 },
];
const ORDINAL = ['1st', '2nd', '3rd'];
const EMPTY_F = 0.3; // height of a place that hasn't been revealed yet
// podium block height = share of the space above the name label (5.5rem), so it always fits the window
const blockH = (f) => `calc((100% - 5.5rem) * ${f})`;

function Trophy({ className }) {
  return (
    <svg viewBox="0 0 120 124" className={className} aria-hidden>
      <defs>
        <linearGradient id="trophyGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M28 22H10c0 26 10 40 30 44" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
      <path d="M92 22h18c0 26-10 40-30 44" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
      <path d="M26 8h68v36c0 24-14 40-34 40S26 68 26 44z" fill="url(#trophyGold)" stroke="#d97706" strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 18v28c0 10 4 20 10 26" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="6" strokeLinecap="round" />
      <path d="M60 22l5 10 11 1.6-8 7.8 1.9 11L60 47l-9.9 5.4 1.9-11-8-7.8L55 32z" fill="#fff" fillOpacity=".9" />
      <rect x="52" y="84" width="16" height="20" fill="#f59e0b" stroke="#d97706" strokeWidth="4" />
      <rect x="34" y="104" width="52" height="16" rx="5" fill="url(#trophyGold)" stroke="#d97706" strokeWidth="4" />
    </svg>
  );
}

// Final results. You control the reveal: click the glowing place (or the button, Space or the right arrow)
// to show 3rd, then 2nd, then a drum roll and the winner with confetti and a fanfare.
export default function Podium({ teams, onClose, onRevealed }) {
  const ranked = [...teams].sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, 3);
  const n = top.length;
  const [stage, setStage] = useState(0); // how many places are showing
  const [rolling, setRolling] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const rollTimer = useRef(null);

  const done = stage >= n;
  const nextIndex = n - 1 - stage; // podium index revealed next: 2 (3rd), then 1 (2nd), then 0 (1st)
  const rankOf = (t) => ranked.findIndex((x) => x.score === t.score) + 1; // ties share a rank

  const next = () => {
    if (rolling || done) return;
    if (nextIndex > 0) {
      setStage(stage + 1);
      playPodiumStep(nextIndex + 1);
    } else {
      setRolling(true);
      playDrumRoll(1.3);
      rollTimer.current = setTimeout(() => { setRolling(false); setStage(n); setCelebrate(true); playFanfare(); }, 1300);
    }
  };
  const revealAll = () => {
    clearTimeout(rollTimer.current);
    setRolling(false);
    setStage(n);
    setCelebrate(true);
    playFanfare();
  };
  const replay = () => {
    clearTimeout(rollTimer.current);
    setRolling(false);
    setCelebrate(false);
    setStage(0);
  };

  // tell the app when all places are showing, so it can bring the background music back
  useEffect(() => { onRevealed?.(done); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') return onClose();
      if (e.target.closest?.('button, input')) return; // a focused button already handles Space/Enter itself
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); nextRef.current(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(rollTimer.current); };
  }, [onClose]);

  const small = 'h-9 px-4 py-0 text-sm';

  return (
    <div role="dialog" aria-modal="true" aria-label="Final results" className="fixed inset-0 z-[80] flex flex-col items-center justify-between overflow-y-auto overflow-x-hidden bg-white/90 p-6 pb-8 pt-14 backdrop-blur-md sm:pt-16">
      <Stars />
      <Confetti run={celebrate} />

      <div className="absolute right-5 top-5 z-20 flex gap-2">
        {!done && <button onClick={revealAll} className={`btn-ghost ${small}`}>Reveal all</button>}
        {stage > 0 && <button onClick={replay} className={`btn-ghost ${small}`}>Replay</button>}
        <button onClick={onClose} className={`btn-primary ${small}`}>Close</button>
      </div>

      <div className="relative z-10 text-center">
        <h2 className="font-display text-5xl text-poster-orange sm:text-6xl">Final results</h2>
        <p className="mt-2 h-8 font-display text-2xl text-poster-violet">{rolling ? 'And the winner is…' : stage === 0 ? 'Who made it to the top 3?' : ''}</p>
      </div>

      {/* podium order: 2nd, 1st, 3rd. Names and colors sit below the podium. The top padding is room for the trophy. */}
      <div className="relative z-10 flex min-h-[18rem] w-full max-w-4xl flex-1 justify-center gap-3 pt-[7.5rem] sm:gap-6">
        {[1, 0, 2].filter((i) => i < n).map((i) => {
          const t = top[i];
          const shown = stage >= n - i;
          const isNext = i === nextIndex && !rolling && !done;
          const Tag = isNext ? 'button' : 'div';
          const rank = rankOf(t);
          return (
            <div key={t.id} className="flex h-full w-1/3 max-w-[16rem] flex-col justify-end">
              <div className="relative w-full" style={{ height: blockH(shown ? STYLE[i].f : EMPTY_F), transition: 'height .9s cubic-bezier(.2,.9,.3,1.15)' }}>
                {i === 0 && shown && (
                  <div className="absolute bottom-full left-1/2 mb-1 -translate-x-1/2">
                    <Trophy className="w-24 animate-pop drop-shadow-lg motion-reduce:animate-none sm:w-28" />
                  </div>
                )}
                <Tag
                  {...(isNext ? { onClick: next, type: 'button', 'aria-label': `Reveal ${ORDINAL[i]} place` } : {})}
                  className={`block h-full w-full overflow-hidden rounded-t-3xl ${shown ? 'shadow-xl' : 'border-4 border-dashed border-ink/25 bg-white/50'} ${isNext ? 'cursor-pointer animate-pulse border-poster-orange/70 hover:bg-white/80 motion-reduce:animate-none' : ''}`}
                  style={shown ? { background: STYLE[i].bg } : undefined}
                >
                  {shown
                    ? <p className="pt-4 text-center font-display text-5xl text-white [text-shadow:0_3px_0_rgba(0,0,0,.2)] sm:text-6xl">{ORDINAL[rank - 1] ?? `${rank}th`}</p>
                    : <p className="pt-3 text-center font-display text-4xl text-ink/30">{ORDINAL[i]}</p>}
                </Tag>
              </div>
              <div className={`mt-3 w-full text-center transition-opacity duration-700 ${shown ? 'opacity-100' : 'opacity-0'}`}>
                <p className="truncate rounded-2xl px-4 py-2 font-display text-xl sm:text-2xl" style={{ background: t.color, color: textOn(t.color) }}>{t.name}</p>
                <p className="mt-1 text-sm font-semibold text-ink/60">{t.score} pts</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex min-h-[5.5rem] flex-col items-center justify-center gap-2">
        {!done && (
          <>
            <button autoFocus onClick={next} disabled={rolling} className="btn-primary px-10 py-3 text-xl">
              {rolling ? 'Drum roll…' : `Reveal ${ORDINAL[nextIndex]} place`}
            </button>
            <p className="text-sm text-ink/50">or click the glowing podium, or press Space</p>
          </>
        )}
      </div>
    </div>
  );
}
