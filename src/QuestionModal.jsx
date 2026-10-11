import { useEffect, useRef, useState } from 'react';

const INTRO_MS = 3500;

export default function QuestionModal({ question: q, category: c, onProceed }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'question'
  const [reveal, setReveal] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current?.play().catch(() => {}); // autoplay may be blocked until first click; the board click usually unlocks it
    const t = setTimeout(() => setStep('question'), INTRO_MS);
    return () => clearTimeout(t);
  }, []);

  const goToQuestion = () => {
    audioRef.current?.pause();
    setStep('question');
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 flex items-center justify-center bg-[#080a14]/80 p-4 backdrop-blur-md">
      {/* Voiceover placeholder: drop the file in /public/audio/ */}
      <audio ref={audioRef} src={c.voiceover} preload="auto" />

      {step === 'intro' ? (
        <div
          key="intro"
          className="glass relative flex h-[70vh] w-full max-w-4xl animate-pop flex-col items-center justify-center overflow-hidden rounded-3xl text-center motion-reduce:animate-none"
          style={{ backgroundImage: `linear-gradient(rgba(8,10,20,.6), rgba(8,10,20,.8)), url(${c.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <span className="text-7xl" aria-hidden>{c.emoji}</span>
          <h2 className="mt-4 text-5xl font-extrabold sm:text-6xl">{c.name}</h2>
          <p className="mt-3 text-xl text-cyan-200">{q.points} points</p>
          <button onClick={goToQuestion} className="btn-ghost absolute bottom-6 right-6 text-sm">Skip intro</button>
        </div>
      ) : (
        <div key="question" className="glass flex max-h-[92vh] w-full max-w-5xl animate-pop flex-col gap-6 overflow-y-auto rounded-3xl p-6 motion-reduce:animate-none sm:p-10">
          <p className="text-white/60">{c.name} · {q.points} points</p>

          {q.type === 'video' && (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/40">
              {/* swap for <video src={q.mediaPlaceholder} controls className="h-full w-full rounded-2xl" /> */}
              <span className="text-white/50">Video placeholder: {q.mediaPlaceholder}</span>
            </div>
          )}
          {q.type === 'photo' && (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/40">
              {/* swap for <img src={q.mediaPlaceholder} alt="" className="h-full w-full rounded-2xl object-contain" /> */}
              <span className="text-white/50">Image placeholder: {q.mediaPlaceholder}</span>
            </div>
          )}

          <h2 className={`font-extrabold leading-tight ${q.type === 'text' || q.type === 'truefalse' ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-3xl'}`}>
            {q.questionText}
          </h2>

          {q.type === 'truefalse' && (
            <div className="flex gap-4">
              <span className="flex-1 rounded-2xl bg-emerald-400/20 py-4 text-center text-2xl font-bold text-emerald-200">True</span>
              <span className="flex-1 rounded-2xl bg-rose-400/20 py-4 text-center text-2xl font-bold text-rose-200">False</span>
            </div>
          )}

          {reveal && (
            <div className="animate-pop rounded-2xl border border-cyan-300/40 bg-cyan-300/10 p-5 motion-reduce:animate-none">
              <p className="text-sm text-cyan-200">Answer</p>
              <p className="text-3xl font-extrabold">{q.answerText}</p>
            </div>
          )}

          <div className="mt-auto flex justify-end gap-3">
            {!reveal ? (
              <button onClick={() => setReveal(true)} className="btn-primary">Show answer</button>
            ) : (
              <button onClick={onProceed} className="btn-primary">Proceed to scoring</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
