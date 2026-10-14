export default function GameBoard({ categories, questions, teams, onPick }) {
  const find = (catId, n) => questions.find((q) => q.id === `${catId}-${n}`);
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <main className="px-4 py-6 sm:px-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">Level Up!</h1>
        <ul className="flex flex-wrap gap-2">
          {ranked.map((t) => (
            <li key={t.id} className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />
              {t.name} <b>{t.score}</b>
            </li>
          ))}
        </ul>
      </header>

      <div className="overflow-x-auto pb-4">
        <div className="grid min-w-[980px] gap-2" style={{ gridTemplateColumns: 'minmax(180px,2fr) repeat(10, minmax(70px,1fr))' }}>
          <div className="glass flex items-center justify-center rounded-2xl p-3 text-center text-lg font-extrabold leading-tight">
            Level<br />Up!
          </div>
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.03] py-2">
              <span className="text-2xl font-extrabold">{i + 1}</span>
              <span className="text-xs text-white/50">{(i + 1) * 100} pts</span>
            </div>
          ))}
          {categories.map((c) => (
            <Row key={c.id} category={c} find={find} onPick={onPick} />
          ))}
        </div>
      </div>
    </main>
  );
}

function Row({ category: c, find, onPick }) {
  return (
    <>
      <div className="flex min-h-[96px] items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/20" style={{ background: c.color }}>
        {c.img ? (
          <img src={c.img} alt={c.name} className="h-full w-full object-contain" />
        ) : (
          <div className="p-3 text-center">
            <div className="text-4xl" aria-hidden>{c.emoji}</div>
            <div className="mt-1 text-lg font-extrabold leading-tight text-white">{c.name}</div>
          </div>
        )}
      </div>
      {Array.from({ length: 10 }, (_, i) => {
        const q = find(c.id, i + 1);
        return q.isAnswered ? (
          <div key={q.id} aria-hidden className="rounded-2xl border border-white/5 bg-black/30 backdrop-blur-sm" />
        ) : (
          <button
            key={q.id}
            onClick={() => onPick(q)}
            aria-label={`${c.name}, question ${i + 1}, ${q.points} points`}
            className="glass rounded-2xl text-3xl font-extrabold text-cyan-200 transition hover:-translate-y-0.5 hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
          >
            ?
          </button>
        );
      })}
    </>
  );
}
