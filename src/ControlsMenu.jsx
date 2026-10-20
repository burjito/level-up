import { useEffect, useRef, useState } from 'react';

// "Controls" dropdown that keeps the question header uncluttered.
// items: [{ label, onSelect, toggle?: true, on?: boolean, hidden?: boolean }]
export default function ControlsMenu({ items, label = 'Controls', buttonClassName = 'px-4 py-1.5 text-sm' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (items.every((i) => i.hidden)) return null;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} className={`btn-ghost flex items-center gap-2 ${buttonClassName}`}>
        {label}
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className={`transition ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-30 mt-2 w-60 animate-pop rounded-2xl bg-white p-2 shadow-[0_12px_40px_rgba(81,45,195,0.25)] ring-1 ring-ink/10 motion-reduce:animate-none">
          {items.filter((i) => !i.hidden).map((i) => (
            <button key={i.label} role={i.toggle ? 'menuitemcheckbox' : 'menuitem'} aria-checked={i.toggle ? !!i.on : undefined}
              onClick={() => { i.onSelect(); setOpen(false); }}
              className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left text-sm font-semibold transition hover:bg-poster-violet/10">
              {i.label}
              {i.toggle && <span className={`rounded-full px-2.5 py-0.5 text-xs ${i.on ? 'bg-poster-green text-white' : 'bg-ink/10 text-ink/60'}`}>{i.on ? 'On' : 'Off'}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
