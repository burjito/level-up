import { useState } from 'react';

// readable text color on a team's color
const textOn = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1c1650' : '#ffffff';
};

export default function Scoreboard({ question: q, teams, onAward, onReturn }) {
  const [picked, setPicked] = useState([]);
  const [awarded, setAwarded] = useState(false);
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 p-4 backdrop-blur-md">
      <div className="glass grid max-h-[94vh] w-full max-w-5xl animate-pop gap-8 overflow-y-auto rounded-[2rem] p-6 motion-reduce:animate-none sm:p-9 md:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl text-poster-blue">Who got it right?</h2>
          <p className="mt-1 text-ink/60">Each correct team earns {q.points} points.</p>
          <ul className="mt-5 space-y-2">
            {teams.map((t) => {
              const on = picked.includes(t.id);
              return (
                <li key={t.id}>
                  <button onClick={() => toggle(t.id)} disabled={awarded} aria-pressed={on}
                    style={on ? { background: t.color, color: textOn(t.color), borderColor: t.color } : undefined}
                    className="flex w-full items-center justify-between rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-left font-semibold transition disabled:cursor-default">
                    <span className="flex items-center gap-3">{!on && <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />}{t.name}</span>
                    <span className="font-display">{on ? `+${q.points}` : 'Tap if correct'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => { onAward(picked); setAwarded(true); }} disabled={awarded} className="btn-primary mt-5 w-full">
            {awarded ? 'Points awarded' : picked.length ? `Award ${q.points} to ${picked.length} team${picked.length > 1 ? 's' : ''}` : 'Award points'}
          </button>
        </section>

        <section>
          <h2 className="font-display text-3xl text-poster-orange">Leaderboard</h2>
          <ol className="mt-5 space-y-2">
            {ranked.map((t, i) => (
              <li key={t.id} className={`flex items-center justify-between rounded-2xl bg-white px-4 py-3 ${i === 0 ? 'ring-4 ring-poster-orange' : 'ring-1 ring-ink/10'}`}>
                <span className="flex items-center gap-3 font-semibold">
                  <span className="w-6 font-display text-poster-violet">{i + 1}</span>
                  <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />{t.name}
                </span>
                <span className="font-display text-2xl tabular-nums text-poster-blue">{t.score}</span>
              </li>
            ))}
          </ol>
          <button onClick={onReturn} disabled={!awarded} className="btn-ghost mt-5 w-full">Return to board</button>
          {!awarded && <p className="mt-2 text-sm text-ink/55">Award points first. Choose no teams if nobody got it.</p>}
        </section>
      </div>
    </div>
  );
}
