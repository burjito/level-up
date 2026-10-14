import { useState } from 'react';

export const SWATCHES = ['#7c5cff', '#22d3ee', '#f472b6', '#facc15', '#34d399', '#fb923c', '#60a5fa', '#f87171'];

export default function TeamRegistration({ teams, setTeams, onStart }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(SWATCHES[0]);

  const addTeam = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    setTeams([...teams, { id: crypto.randomUUID(), name: n, color, score: 0 }]);
    setName('');
    setColor(SWATCHES[(teams.length + 1) % SWATCHES.length]);
  };

  return (
    <main className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-5">
      <section className="lg:col-span-3">
        <h1 className="sr-only">Level Up!</h1>
        <img src="/media/level-up.webp" alt="Level Up! Youth Night, Oct 23, 5:30 PM, Jesus' Flock Gateway Church" className="w-full rounded-3xl shadow-2xl shadow-black/50 ring-1 ring-white/20" />
      </section>

      <section className="glass rounded-3xl p-6 sm:p-8 lg:col-span-2">
        <form onSubmit={addTeam} className="space-y-5">
          <div>
            <label htmlFor="team" className="mb-2 block text-sm text-white/70">Team name</label>
            <input
              id="team"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Team Grace"
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-lg outline-none placeholder:text-white/30 focus:border-cyan-300"
            />
          </div>
          <div>
            <span className="mb-2 block text-sm text-white/70">Team color</span>
            <div className="flex flex-wrap items-center gap-3">
              {SWATCHES.map((c) => (
                <button
                  type="button"
                  key={c}
                  aria-label={`Color ${c}`}
                  aria-pressed={color === c}
                  onClick={() => setColor(c)}
                  style={{ background: c }}
                  className={`h-9 w-9 rounded-full transition ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#080a14] scale-110' : 'opacity-80 hover:opacity-100'}`}
                />
              ))}
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Custom color" className="h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent" />
            </div>
          </div>
          <button type="submit" className="btn-ghost w-full" disabled={!name.trim()}>Add team</button>
        </form>

        <ul className="mt-6 max-h-64 space-y-2 overflow-y-auto">
          {teams.length === 0 && <li className="text-white/50">No teams yet. Add your first team above.</li>}
          {teams.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span className="flex items-center gap-3 font-semibold">
                <span className="h-4 w-4 rounded-full" style={{ background: t.color }} />
                {t.name}
              </span>
              <button onClick={() => setTeams(teams.filter((x) => x.id !== t.id))} className="text-sm text-white/50 hover:text-white">
                Remove
              </button>
            </li>
          ))}
        </ul>

        <button onClick={onStart} disabled={teams.length === 0} className="btn-primary mt-6 w-full text-lg">
          Start game
        </button>
      </section>
    </main>
  );
}
