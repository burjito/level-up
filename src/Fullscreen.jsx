import { useEffect, useState } from 'react';

const supported = () => typeof document !== 'undefined' && document.fullscreenEnabled;

// Browsers only allow this from a click/tap, so call it inside a click handler.
export const enterFullscreen = () => {
  if (supported() && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
};

export default function FullscreenButton({ className = '' }) {
  const [on, setOn] = useState(() => supported() && !!document.fullscreenElement);
  useEffect(() => {
    const update = () => setOn(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);
  if (!supported()) return null;
  return (
    <button onClick={() => (on ? document.exitFullscreen() : enterFullscreen())} aria-pressed={on} className={`btn-ghost px-4 py-1 text-sm ${className}`}>
      {on ? 'Exit full screen' : 'Full screen'}
    </button>
  );
}
