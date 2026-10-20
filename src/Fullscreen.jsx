import { useEffect, useState } from 'react';

const supported = () => typeof document !== 'undefined' && document.fullscreenEnabled;

// Browsers only allow this from a click/tap, so call it inside a click handler.
export const enterFullscreen = () => {
  if (supported() && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
};

export function useFullscreen() {
  const [on, setOn] = useState(() => supported() && !!document.fullscreenElement);
  useEffect(() => {
    const update = () => setOn(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  const toggle = () => (on ? document.exitFullscreen() : enterFullscreen());
  return { supported: supported(), on, toggle };
}

export default function FullscreenButton({ className = '' }) {
  const { supported: ok, on, toggle } = useFullscreen();
  if (!ok) return null;
  return (
    <button onClick={toggle} aria-pressed={on} className={`btn-ghost px-4 py-1 text-sm ${className}`}>
      {on ? 'Exit full screen' : 'Full screen'}
    </button>
  );
}
