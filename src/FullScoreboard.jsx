import { useEffect, useState } from 'react';
import ConfirmModal from './ConfirmModal.jsx';

const CHIPS = [50, 100, 200, 500, 1000];

// Full tally, ranked high to low (ties share a rank). "Edit scores" lets the host add or take off points per team.
export default function FullScoreboard({ teams, onClose, onAdjust, onNewGame }) {
  const [editing, setEditing] = useState(false);
  const [order, setOrder] = useState([]); // row order is frozen while editing so rows don't jump under finger
  const [amount, setAmount] = useState(100);
  const [history, setHistory] = useState([]); // [{ id, name, delta }] for undo
  const [confirming, setConfirming] = useState(false); // new game confirmation

  const byScore = [...teams].sort((a, b) => b.score - a.score);
  const rows = editing ? order.map((id) => teams.find((t) => t.id === id)).filter(Boolean) : byScore;
  const rank = (t) => byScore.findIndex((x) => x.score === t.score) + 1;
  const last = history[history.length - 1];

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && (confirming ? setConfirming(false) : onClose());
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, confirming]);

  const startEdit = () => { setOrder(byScore.map((t) => t.id)); setEditing(true); };
  const change = (t, sign) => {
    if (!amount) return;
    onAdjust(t.id, sign * amount);
    setHistory((h) => [...h, { id: t.id, name: t.name, delta: sign * amount }]);
  };
  const undo = () => {
    if (!last) return;
    onAdjust(last.id, -last.delta);
    setHistory((h) => h.slice(0, -1));
  };

  return (
    <>
    <div role="dialog" aria-modal="true" aria-label="Scoreboard" onClick={onClose} className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 p-4 backdrop-blur-md">
      <div onClick={(e) => e.stopPropagation()} className="glass flex max-h-[90vh] w-full max-w-xl animate-pop flex-col rounded-[2rem] p-6 motion-reduce:animate-none sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-3xl text-poster-orange">Scoreboard</h2>
          {editing
            ? <button onClick={() => setEditing(false)} className="btn-primary px-5 py-1.5 text-base">Done</button>
            : <button onClick={startEdit} className="btn-ghost px-5 py-1.5 text-base">Edit scores</button>}
        </div>

        {editing && (
          <div className="mt-4 rounded-2xl bg-poster-violet/10 p-3">
            <p className="text-sm font-semibold text-ink/70">Points to add or take off</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {CHIPS.map((c) => (
                <button key={c} onClick={() => setAmount(c)} aria-pressed={amount === c}
                  className={`rounded-full px-3 py-1 text-sm font-semibold transition ${amount === c ? 'bg-poster-violet text-white' : 'bg-white text-poster-violet ring-1 ring-poster-violet/30'}`}>{c}</button>
              ))}
              <input type="number" min="0" step="50" value={amount} aria-label="Custom points"
                onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-24 rounded-full border-2 border-ink/15 bg-white px-3 py-1 text-sm outline-none focus:border-poster-blue" />
              <button onClick={undo} disabled={!last} className="ml-auto rounded-full px-3 py-1 text-sm font-semibold text-poster-red ring-1 ring-poster-red/40 disabled:opacity-40">
                {last ? `Undo: ${last.name} ${last.delta > 0 ? '+' : '−'}${Math.abs(last.delta)}` : 'Undo'}
              </button>
            </div>
          </div>
        )}

        <ol className="mt-4 space-y-2 overflow-y-auto p-1">
          {rows.map((t) => {
            const r = rank(t);
            return (
              <li key={t.id} className={`flex items-center justify-between gap-2 rounded-2xl bg-white px-4 py-2.5 ${!editing && r === 1 ? 'ring-4 ring-poster-orange' : 'ring-1 ring-ink/10'}`}>
                <span className="flex min-w-0 items-center gap-3 font-semibold">
                  <span className="w-7 font-display text-lg text-poster-violet">{r}</span>
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: t.color }} /><span className="truncate">{t.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {editing && <button onClick={() => change(t, -1)} aria-label={`Take ${amount} points from ${t.name}`} className="h-9 w-9 rounded-full bg-poster-red font-display text-xl leading-none text-white active:translate-y-px">−</button>}
                  <span className="min-w-[3.5ch] text-right font-display text-2xl tabular-nums text-poster-blue">{t.score}</span>
                  {editing && <button onClick={() => change(t, 1)} aria-label={`Give ${amount} points to ${t.name}`} className="h-9 w-9 rounded-full bg-poster-green font-display text-xl leading-none text-white active:translate-y-px">+</button>}
                </span>
              </li>
            );
          })}
        </ol>
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            onClick={() => setConfirming(true)}
            className="text-sm font-semibold text-poster-red underline-offset-2 hover:underline">
            New game
          </button>
          <button onClick={onClose} className="btn-primary">Close</button>
        </div>
      </div>
    </div>
    {confirming && (
      <ConfirmModal
        title="Start a new game?"
        message="This clears all teams, scores and answered questions. This can't be undone."
        confirmLabel="Yes, start new game"
        onConfirm={() => { setConfirming(false); onNewGame(); }}
        onCancel={() => setConfirming(false)}
      />
    )}
    </>
  );
}
