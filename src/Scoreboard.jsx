import { useState } from 'react';

const textOn = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1c1650' : '#ffffff';
};

export default function Scoreboard({ question: q, teams, onAward, onReturn, onShowTally }) {
  const [picked, setPicked] = useState([]);
  const [awarded, setAwarded] = useState(false);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 p-4 backdrop-blur-md">
      <div className="glass grid max-h-[94vh] w-full max-w-5xl animate-pop gap-8 overflow-y-auto rounded-[2rem] p-6 motion-reduce:animate-none sm:p-9 md:grid-cols-[1.2fr_1fr]">
        <section>
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

        <section>
          <h2 className="font-display text-3xl text-poster-orange">Top 3</h2>
          <ol className="mt-4 space-y-2">
            {ranked.slice(0, 3).map((t, i) => (
              <li key={t.id} className={`flex items-center justify-between rounded-2xl bg-white px-4 py-3 ${i === 0 ? 'ring-4 ring-poster-orange' : 'ring-1 ring-ink/10'}`}>
                <span className="flex min-w-0 items-center gap-3 font-semibold">
                  <span className="w-5 font-display text-poster-violet">{i + 1}</span>
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: t.color }} /><span className="truncate">{t.name}</span>
                </span>
                <span className="font-display text-2xl tabular-nums text-poster-blue">{t.score}</span>
              </li>
            ))}
          </ol>
          <button onClick={onShowTally} className="btn-ghost mt-4 w-full px-4 py-2 text-base">Full scoreboard{teams.length > 3 ? ` (${teams.length} teams)` : ''}</button>
          <button onClick={onReturn} disabled={!awarded} className="btn-primary mt-3 w-full">Return to board</button>
          {!awarded && <p className="mt-2 text-sm text-ink/55">Award points first. Choose no teams if nobody got it.</p>}
        </section>
      </div>
    </div>
  );
}
