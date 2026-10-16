import { useEffect, useState } from 'react';
import Stars from './Stars.jsx';

// Phones and portrait tablets (narrow screens), plus touch-only devices like a tablet in landscape.
// Laptops, including touchscreen ones that still have a mouse/trackpad, are not affected.
const QUERY = '(max-width: 819px), (pointer: coarse) and (hover: none)';

export function useIsSmallScreen() {
  const [small, setSmall] = useState(() => window.matchMedia(QUERY).matches);
  useEffect(() => {
    const m = window.matchMedia(QUERY);
    const update = () => setSmall(m.matches);
    m.addEventListener('change', update);
    return () => m.removeEventListener('change', update);
  }, []);
  return small;
}

export default function DesktopOnly() {
  return (
    <main className="relative flex min-h-full items-center justify-center overflow-hidden px-6 py-10 text-center">
      <Stars />
      <div className="glass relative z-10 w-full max-w-md rounded-[2rem] p-7">
        <img src="/elements/logo.webp" alt="Level Up!" className="mx-auto w-full max-w-sm" />
        <h1 className="mt-4 font-display text-3xl text-poster-blue">Laptop view only</h1>
        <p className="mt-3 text-ink/70">Level Up! is only available on a laptop or desktop screen. Please open this link on a laptop or desktop computer.</p>
        <p className="mt-2 text-sm text-ink/50">Buksan ang link na ito sa laptop o desktop.</p>
      </div>
    </main>
  );
}
