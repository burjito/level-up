import TeamRank from './TeamRank.jsx';
import FullscreenButton from './Fullscreen.jsx';
import MusicButton from './MusicButton.jsx';

// Fits the viewport exactly: no scrolling. Sizes come from the grid tracks.
export default function GameBoard({ categories, questions, teams, onPick, onShowTally }) {
  const find = (catId, n) => questions.find((q) => q.id === `${catId}-${n}`);
  const top3 = [...teams].sort((a, b) => b.score - a.score).slice(0, 3);
  const started = teams.some((t) => t.score > 0); // no top 3 until the first points are awarded

  return (
    <main className="flex h-full flex-col gap-2 overflow-hidden p-3 sm:p-4">
      <header className="flex shrink-0 items-center justify-end gap-2">
        {started && (
          <ul className="flex min-w-0 gap-2 overflow-hidden">
          {top3.map((t, i) => (
            <li key={t.id} className="shrink-0"><TeamRank team={t} rank={i + 1} size="sm" /></li>
          ))}
        </ul>
        )}
        <MusicButton className="shrink-0" />
        <FullscreenButton className="shrink-0" />
        <button onClick={onShowTally} className="btn-ghost shrink-0 px-4 py-1 text-sm">Scoreboard</button>
      </header>

      <div className="grid min-h-0 flex-1 gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: 'minmax(0,1.5fr) repeat(10,minmax(0,1fr))', gridTemplateRows: 'minmax(0,.8fr) repeat(5,minmax(0,1fr))' }}>
        <div className="flex items-center justify-center"><img src="/elements/logo-wide.webp" alt="Level Up!" className="h-[72%] w-[84%] object-contain" /></div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex flex-col items-center justify-center rounded-2xl border-2 border-poster-violet/20 bg-white leading-none shadow-[0_3px_0_rgba(81,45,195,.18)]">
            <span className="font-display text-[clamp(22px,5vh,52px)] text-poster-violet">{i + 1}</span>
            <span className="mt-0.5 text-[clamp(12px,2.2vh,22px)] font-semibold text-ink/55">{(i + 1) * 100} pts</span>
          </div>
        ))}
        {categories.map((c) => (
          <Row key={c.id} c={c} find={find} onPick={onPick} />
        ))}
      </div>
    </main>
  );
}

function Row({ c, find, onPick }) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border-2 border-white shadow-[0_4px_0_rgba(28,22,80,.2)]" style={{ background: c.color }}>
        <img src={c.img} alt={c.name} className="h-full w-full scale-[1.2] object-contain" />
      </div>
      {Array.from({ length: 10 }, (_, i) => {
        const q = find(c.id, i + 1);
        return q.isAnswered ? (
          <div key={q.id} aria-hidden className="rounded-2xl border-2 border-dashed border-ink/15 bg-white/40" />
        ) : (
          <button key={q.id} onClick={() => onPick(q)} aria-label={`${c.name}, question ${i + 1}, ${q.basePoints} points`}
            style={{ borderColor: c.color, color: c.color, boxShadow: `0 4px 0 ${c.color}` }}
            className="flex items-center justify-center rounded-2xl border-[3px] bg-white font-display text-[clamp(20px,5.5vh,60px)] leading-none transition hover:-translate-y-0.5 hover:scale-[1.05] active:translate-y-[3px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-poster-orange">
            ?
          </button>
        );
      })}
    </>
  );
}
