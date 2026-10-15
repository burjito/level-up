// Fits the viewport exactly: no scrolling. Sizes come from the grid tracks.
export default function GameBoard({ categories, questions, teams, onPick }) {
  const find = (catId, n) => questions.find((q) => q.id === `${catId}-${n}`);
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <main className="flex h-full flex-col gap-2 overflow-hidden p-3 sm:p-4">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <p className="font-display text-lg text-poster-violet"><span className="text-poster-red">RadGen</span> Yth Nyt</p>
        <ul className="flex min-w-0 gap-2 overflow-x-auto">
          {ranked.map((t) => (
            <li key={t.id} className="glass flex shrink-0 items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold">
              <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />{t.name}
              <b className="font-display text-base text-poster-blue">{t.score}</b>
            </li>
          ))}
        </ul>
      </header>

      <div className="grid min-h-0 flex-1 gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: 'minmax(0,1.5fr) repeat(10,minmax(0,1fr))', gridTemplateRows: 'minmax(0,.5fr) repeat(5,minmax(0,1fr))' }}>
        <div className="flex items-center justify-center"><img src="/elements/logo.webp" alt="Level Up!" className="h-full w-full scale-125 object-contain" /></div>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="flex items-center justify-center font-display text-[clamp(16px,3.4vh,36px)] text-poster-violet">{i + 1}</div>
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
          <button key={q.id} onClick={() => onPick(q)} aria-label={`${c.name}, question ${i + 1}, ${q.points} points`}
            style={{ borderColor: c.color, color: c.color, boxShadow: `0 4px 0 ${c.color}` }}
            className="flex items-center justify-center rounded-2xl border-[3px] bg-white font-display text-[clamp(20px,5.5vh,60px)] leading-none transition hover:-translate-y-0.5 hover:scale-[1.05] active:translate-y-[3px] focus-visible:outline focus-visible:outline-4 focus-visible:outline-poster-orange">
            ?
          </button>
        );
      })}
    </>
  );
}
