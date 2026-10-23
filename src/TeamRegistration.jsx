import { useState } from 'react';
import Stars from './Stars.jsx';
import SettingsMenu from './SettingsMenu.jsx';

export const SWATCHES = ['#dd0000', '#0040ff', '#512dc3', '#0cb820', '#ff8a00', '#ec4899', '#0d9488', '#eab308'];

export default function TeamRegistration({ teams, setTeams, onStart, onNewGame, onRegisterTeam, registrationLabel, onClose, isAdding = false, showForm = true }) {
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
    <main role={isAdding ? 'dialog' : undefined} aria-modal={isAdding || undefined} className={`relative flex min-h-full items-center overflow-hidden px-6 py-10 ${isAdding ? 'fixed inset-0 z-[70] justify-center overflow-y-auto bg-poster-blue/30 p-4 backdrop-blur-md sm:p-6' : ''}`}>
      <Stars />
      {!isAdding && <div className="fixed right-4 top-4 z-20"><SettingsMenu onNewGame={teams.length ? onNewGame : undefined} onRegisterTeam={onRegisterTeam} registrationLabel={registrationLabel} /></div>}
      <div className={`relative z-10 mx-auto grid w-full items-center gap-8 ${showForm ? 'max-w-6xl lg:grid-cols-[1.2fr_1fr]' : 'max-w-2xl'}`}>
        <section className={showForm ? '' : 'flex items-center justify-center'}>
          <h1 className="sr-only">Level Up! Youth Night, Oct 24, 3:30 PM</h1>
          <div className="p-3 sm:p-5">
            <img src="/elements/logo.webp" alt="Level Up!" className="mx-auto w-full max-w-2xl animate-heartbeat motion-reduce:animate-none" />
          </div>
        </section>

        {showForm && <section className="glass rounded-[2rem] p-6 sm:p-8">
          {isAdding && <button type="button" onClick={onClose} className="btn-ghost float-right px-3 py-1 text-sm">Close</button>}
          <h2 className="font-display text-3xl text-poster-blue">Register your teams</h2>
          <form onSubmit={addTeam} className="mt-5 space-y-5">
            <div>
              <label htmlFor="team" className="mb-1.5 block text-sm font-semibold">Team name</label>
              <input id="team" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jesus' Flock"
                className="w-full rounded-2xl border-2 border-ink/15 bg-white px-4 py-3 text-lg outline-none placeholder:text-ink/35 focus:border-poster-blue" />
            </div>
            <div>
              <span className="mb-2.5 block text-sm font-semibold">Team color</span>
              <div className="flex flex-wrap items-center gap-2.5 p-1">
                {SWATCHES.map((c) => (
                  <button type="button" key={c} aria-label={`Color ${c}`} aria-pressed={color === c} onClick={() => setColor(c)} style={{ background: c }}
                    className={`h-7 w-7 rounded-full border-2 border-white shadow transition ${color === c ? 'ring-2 ring-ink ring-offset-2' : 'hover:scale-110'}`} />
                ))}
                <label title="Custom color" className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border-2 border-white shadow transition hover:scale-110"
                  style={{ background: 'conic-gradient(#dd0000,#ff8a00,#eab308,#0cb820,#0040ff,#512dc3,#dd0000)' }}>
                  <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Custom color" className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
                </label>
              </div>
            </div>
            <button type="submit" className="btn-ghost w-full" disabled={!name.trim()}>Add team</button>
          </form>

          <ul className="mt-4 max-h-[10.25rem] space-y-2 overflow-y-auto p-1">
            {teams.length === 0 && <li className="text-ink/55">No teams yet. Add your first team above.</li>}
            {teams.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 shadow-sm ring-1 ring-ink/10">
                <span className="flex items-center gap-3 font-semibold"><span className="h-4 w-4 rounded-full" style={{ background: t.color }} />{t.name}</span>
                <button onClick={() => setTeams(teams.filter((x) => x.id !== t.id))} className="text-sm text-ink/50 hover:text-poster-red">Remove</button>
              </li>
            ))}
          </ul>
          {!isAdding && <button onClick={onStart} disabled={teams.length === 0} className="btn-primary mt-5 w-full text-xl">Start game</button>}
        </section>}
      </div>
    </main>
  );
}
