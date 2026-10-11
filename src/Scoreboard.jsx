import { useState } from 'react';

export default function Scoreboard({ question: q, teams, onAward, onReturn }) {
  const [picked, setPicked] = useState([]);
  const [awarded, setAwarded] = useState(false);

  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const award = () => {
    onAward(picked);
    setAwarded(true);
  };
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-[#080a14]/85 p-4 backdrop-blur-md">
      <div className="glass grid max-h-[92vh] w-full max-w-5xl animate-pop gap-8 overflow-y-auto rounded-3xl p-6 motion-reduce:animate-none sm:p-10 md:grid-cols-2">
        <section>
          <h2 className="text-3xl font-extrabold">Who got it right?</h2>
          <p className="mt-1 text-white/60">Each correct team earns {q.points} points.</p>
          <ul className="mt-5 space-y-2">
            {teams.map((t) => {
              const on = picked.includes(t.id);
              return (
                <li key={t.id}>
                  <button
                    onClick={() => toggle(t.id)}
                    disabled={awarded}
                    aria-pressed={on}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left font-semibold transition disabled:cursor-default ${on ? 'border-transparent text-slate-950' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                    style={on ? { background: t.color } : undefined}
                  >
                    <span className="flex items-center gap-3">
                      {!on && <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />}
                      {t.name}
                    </span>
                    <span>{on ? `+${q.points}` : 'Tap if correct'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={award} disabled={awarded} className="btn-primary mt-5 w-full">
            {awarded ? 'Points awarded' : picked.length ? `Award ${q.points} to ${picked.length} team${picked.length > 1 ? 's' : ''}` : 'Award points'}
          </button>
        </section>

        <section>
          <h2 className="text-3xl font-extrabold">Leaderboard</h2>
          <ol className="mt-5 space-y-2">
            {ranked.map((t, i) => (
              <li key={t.id} className={`flex items-center justify-between rounded-xl px-4 py-3 ${i === 0 ? 'bg-amber-300/15 ring-1 ring-amber-300/50' : 'bg-white/5'}`}>
                <span className="flex items-center gap-3 font-semibold">
                  <span className="w-6 text-white/50">{i + 1}</span>
                  <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />
                  {t.name}
                </span>
                <span className="text-2xl font-extrabold tabular-nums">{t.score}</span>
              </li>
            ))}
          </ol>
          <button onClick={onReturn} disabled={!awarded} className="btn-ghost mt-5 w-full">
            Return to board
          </button>
          {!awarded && <p className="mt-2 text-sm text-white/50">Award points first. Choose no teams if nobody got it.</p>}
        </section>
      </div>
    </div>
  );
}
