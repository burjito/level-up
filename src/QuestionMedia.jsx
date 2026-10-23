import { useState } from 'react';

const kindOf = (src) =>
  /\.(mp4|webm|mov)$/i.test(src) ? 'video' : /\.(mp3|m4a|wav|ogg)$/i.test(src) ? 'audio' : 'image';

// Renders a photo, video or audio file. Audio/video start playing right away (controls stay for replay).
// onPlaybackComplete is used when the question timer must wait for the clip.
// Use key={src} so it resets when the source changes.
export default function QuestionMedia({ src, onPlaybackComplete }) {
  const [failed, setFailed] = useState(false);
  const kind = kindOf(src);

  if (src.startsWith('http')) {
    return <div className="flex justify-center"><a href={src} target="_blank" rel="noreferrer" className="btn-primary">Open clip</a></div>;
  }
  if (failed) {
    return (
      <div className="flex min-h-[8rem] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink/20 bg-ink/5 px-4 text-center text-ink/50">
        <span className="font-semibold">Answer clip unavailable</span>
        <span className="mt-1 text-sm">The answer above is still valid.</span>
      </div>
    );
  }
  if (kind === 'image') {
    return <img src={src} alt="" onError={() => setFailed(true)} className="mx-auto max-h-[42vh] w-auto max-w-full rounded-2xl object-contain" />;
  }
  if (kind === 'video') {
    return <video src={src} controls autoPlay playsInline onEnded={onPlaybackComplete} onError={() => { setFailed(true); onPlaybackComplete?.(); }} className="mx-auto max-h-[42vh] w-auto max-w-full rounded-2xl bg-black" />;
  }
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/10">
      <p className="mb-2 text-sm font-semibold text-ink/60">Listen</p>
      <audio src={src} controls autoPlay onEnded={onPlaybackComplete} onError={() => { setFailed(true); onPlaybackComplete?.(); }} className="w-full" />
    </div>
  );
}
