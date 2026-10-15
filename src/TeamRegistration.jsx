import { useState } from 'react';
import Stars from './Stars.jsx';

export const SWATCHES = ['#dd0000', '#0040ff', '#512dc3', '#0cb820', '#ff8a00', '#ec4899', '#0d9488', '#eab308'];

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
    <main className="relative flex min-h-full items-center overflow-hidden px-6 py-10">
      <Stars />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2">
        <section className="flex flex-col items-center text-center">
          <h1 className="sr-only">Level Up!</h1>
          <img src="/elements/logo.webp" alt="Level Up!" className="w-full max-w-md drop-shadow-[0_10px_0_rgba(0,64,255,0.12)]" />
          <p className="font-display text-4xl text-poster-orange">Oct 24 <span className="ml-2 rounded-full bg-poster-violet px-4 py-1 align-middle text-xl text-white">3:30 PM</span></p>
          <p className="mt-2 font-display text-lg uppercase tracking-wide text-poster-orange">Jesus' Flock Gateway Church</p>
          <p className="mt-1 font-display text-xl"><span className="text-poster-red">RadGen</span> <span className="text-poster-violet">Yth Nyt</span></p>
        </section>

        <section className="glass rounded-[2rem] p-6 sm:p-8">
          <h2 className="font-display text-3xl text-poster-blue">Register your teams</h2>
          <form onSubmit={addTeam} className="mt-5 space-y-5">
            <div>
              <label htmlFor="team" className="mb-1.5 block text-sm font-semibold">Team name</label>
              <input id="team" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Team Grace"
                className="w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-lg outline-none placeholder:text-ink/35 focus:border-poster-blue" />
            </div>
            <div>
              <span className="mb-1.5 block text-sm font-semibold">Team color</span>
              <div className="flex flex-wrap items-center gap-3">
                {SWATCHES.map((c) => (
                  <button type="button" key={c} aria-label={`Color ${c}`} aria-pressed={color === c} onClick={() => setColor(c)}
                    style={{ background: c }}
                    className={`h-9 w-9 rounded-full border-2 border-white shadow transition ${color === c ? 'scale-125 ring-4 ring-ink' : 'hover:scale-110'}`} />
                ))}
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Custom color" className="h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent" />
              </div>
            </div>
            <button type="submit" className="btn-ghost w-full" disabled={!name.trim()}>Add team</button>
          </form>

          <ul className="mt-5 max-h-48 space-y-2 overflow-y-auto">
            {teams.length === 0 && <li className="text-ink/55">No teams yet. Add your first team above.</li>}
            {teams.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-ink/10">
                <span className="flex items-center gap-3 font-semibold"><span className="h-4 w-4 rounded-full" style={{ background: t.color }} />{t.name}</span>
                <button onClick={() => setTeams(teams.filter((x) => x.id !== t.id))} className="text-sm text-ink/50 hover:text-poster-red">Remove</button>
              </li>
            ))}
          </ul>
          <button onClick={onStart} disabled={teams.length === 0} className="btn-primary mt-5 w-full text-xl">Start game</button>
        </section>
      </div>
    </main>
  );
}
