import { toggleBedMusic, useBedMusic } from './bedMusic.js';

// Hidden when there are no music files in public/music
export default function MusicButton({ className = '' }) {
  const { enabled, missing } = useBedMusic();
  if (missing) return null;
  return (
    <button onClick={toggleBedMusic} aria-pressed={enabled} className={`btn-ghost px-4 py-1 text-sm ${className}`}>
      {enabled ? 'Music on' : 'Music off'}
    </button>
  );
}
