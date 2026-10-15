import { useEffect } from 'react';

// Full tally, ranked high to low. Ties share a rank.
export default function FullScoreboard({ teams, onClose }) {
  const ranked = [...teams].sort((a, b) => b.score - a.score);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label="Scoreboard" onClick={onClose} className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 p-4 backdrop-blur-md">
      <div onClick={(e) => e.stopPropagation()} className="glass flex max-h-[90vh] w-full max-w-xl animate-pop flex-col rounded-[2rem] p-6 motion-reduce:animate-none sm:p-8">
        <h2 className="font-display text-3xl text-poster-orange">Scoreboard</h2>
        <ol className="mt-4 space-y-2 overflow-y-auto p-1">
          {ranked.map((t) => {
            const rank = ranked.findIndex((x) => x.score === t.score) + 1;
            return (
              <li key={t.id} className={`flex items-center justify-between rounded-2xl bg-white px-4 py-2.5 ${rank === 1 ? 'ring-4 ring-poster-orange' : 'ring-1 ring-ink/10'}`}>
                <span className="flex items-center gap-3 font-semibold">
                  <span className="w-7 font-display text-lg text-poster-violet">{rank}</span>
                  <span className="h-3 w-3 rounded-full" style={{ background: t.color }} />{t.name}
                </span>
                <span className="font-display text-2xl tabular-nums text-poster-blue">{t.score}</span>
              </li>
            );
          })}
        </ol>
        <button onClick={onClose} className="btn-primary mt-5">Close</button>
      </div>
    </div>
  );
}
