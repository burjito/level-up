import { useState } from 'react';
import TeamRank, { textOn } from './TeamRank.jsx';

export default function Scoreboard({ question: q, teams, onAward, onReturn, onShowTally }) {
  const [picked, setPicked] = useState([]);
  const [awarded, setAwarded] = useState(false);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 p-4 backdrop-blur-md">
      <div className="grid max-h-[94vh] w-full max-w-5xl animate-pop overflow-y-auto rounded-[2rem] shadow-[0_20px_60px_rgba(0,64,255,0.3)] motion-reduce:animate-none md:grid-cols-[1.2fr_1fr]">
        {/* white half: scoring */}
        <section className="bg-white p-6 sm:p-9">
          <h2 className="font-display text-3xl text-poster-blue">Who got it right?</h2>
          <p className="mt-1 text-ink/60">Each correct team earns {q.points} points.</p>
          <ul className="mt-4 grid max-h-[40vh] gap-2 overflow-y-auto p-1 sm:grid-cols-2">
            {teams.map((t) => {
              const on = picked.includes(t.id);
              return (
                <li key={t.id}>
                  <button onClick={() => toggle(t.id)} disabled={awarded} aria-pressed={on}
                    style={on ? { background: t.color, color: textOn(t.color), borderColor: t.color } : undefined}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border-2 border-ink/15 bg-white px-3 py-2 text-left text-sm font-semibold transition disabled:cursor-default">
                    <span className="flex min-w-0 items-center gap-2">{!on && <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: t.color }} />}<span className="truncate">{t.name}</span></span>
                    <span className="shrink-0 font-display">{on ? `+${q.points}` : ''}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => { onAward(picked); setAwarded(true); }} disabled={awarded} className="btn-primary mt-4 w-full">
            {awarded ? 'Points awarded' : picked.length ? `Award ${q.points} to ${picked.length} team${picked.length > 1 ? 's' : ''}` : 'Award points'}
          </button>
        </section>

        {/* blue half: top 3 */}
        <section className="bg-poster-blue p-6 text-white sm:p-9">
          <h2 className="font-display text-3xl">Top 3</h2>
          <ol className="mt-5 space-y-3 p-1">
            {ranked.slice(0, 3).map((t, i) => (
              <li key={t.id}><TeamRank team={t} rank={i + 1} /></li>
            ))}
          </ol>
          <button onClick={onShowTally} className="btn mt-5 w-full border-2 border-white px-4 py-2 text-base text-white shadow-[0_4px_0_rgba(255,255,255,0.35)] hover:bg-white/10">
            Full scoreboard{teams.length > 3 ? ` (${teams.length} teams)` : ''}
          </button>
          <button onClick={onReturn} disabled={!awarded} className="btn mt-3 w-full bg-poster-orange text-white shadow-[0_5px_0_#a85b00] hover:brightness-110 disabled:bg-white disabled:text-ink/40 disabled:opacity-100 disabled:shadow-[0_5px_0_rgba(255,255,255,0.35)]">Return to board</button>
          {!awarded && <p className="mt-2 text-sm text-white/80">Award points first. Choose no teams if nobody got it.</p>}
          {awarded && <p className="mt-2 text-sm text-white/80">Wrong team? Fix it in Full scoreboard → Edit scores.</p>}
        </section>
      </div>
    </div>
  );
}
