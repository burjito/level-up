import { useEffect, useState } from 'react';
import { playIntro, playBuzzer } from './sfx.js';

const INTRO_MS = 3500;

export default function QuestionModal({ question: q, category: c, onProceed }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'question'
  const [reveal, setReveal] = useState(false);
  const [left, setLeft] = useState(q.seconds);
  const [running, setRunning] = useState(true);

  // Step A: sticker + sound effect, then auto-advance
  useEffect(() => {
    playIntro(c.sfx);
    const t = setTimeout(() => setStep('question'), INTRO_MS);
    return () => clearTimeout(t);
  }, [c.sfx]);

  // Step B: countdown starts when the question appears
  useEffect(() => {
    if (step !== 'question' || !running || left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, running, left]);

  useEffect(() => {
    if (step === 'question' && left === 0) playBuzzer();
  }, [step, left]);

  const urgent = left <= 5;
  const isUrl = q.mediaPlaceholder?.startsWith('http');

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 flex items-center justify-center bg-[#080a14]/80 p-4 backdrop-blur-md">
      {step === 'intro' ? (
        <div
          key="intro"
          className="relative flex h-[70vh] w-full max-w-4xl animate-pop flex-col items-center justify-center overflow-hidden rounded-3xl ring-1 ring-white/30 motion-reduce:animate-none"
          style={{ background: c.color }}
        >
          <img src={c.img} alt={c.name} className="h-full w-full object-contain" />
          <p className="absolute bottom-6 left-6 rounded-full bg-black/40 px-4 py-2 text-lg font-semibold backdrop-blur">{q.points} points</p>
          <button onClick={() => setStep('question')} className="btn-ghost absolute bottom-6 right-6 text-sm">Skip intro</button>
        </div>
      ) : (
        <div key="question" className="glass flex max-h-[92vh] w-full max-w-5xl animate-pop flex-col gap-6 overflow-y-auto rounded-3xl p-6 motion-reduce:animate-none sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-white/60">{c.name} · {q.points} points</p>
            <div className="flex items-center gap-3">
              <span
                role="timer"
                aria-live="off"
                className={`min-w-[3ch] text-right text-5xl font-extrabold tabular-nums ${left === 0 ? 'text-rose-400' : urgent ? 'text-amber-300' : 'text-white'}`}
              >
                {left}
              </span>
              <button onClick={() => setRunning((r) => !r)} disabled={left === 0} className="btn-ghost px-4 py-2 text-sm">{running ? 'Pause' : 'Resume'}</button>
              <button onClick={() => { setLeft(q.seconds); setRunning(true); }} className="btn-ghost px-4 py-2 text-sm">Reset</button>
            </div>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${urgent ? 'bg-amber-300' : 'bg-cyan-300'}`}
              style={{ width: `${(left / q.seconds) * 100}%` }}
            />
          </div>
          {left === 0 && <p className="text-2xl font-extrabold text-rose-400">Time's up!</p>}

          {(q.type === 'video' || q.type === 'photo') && (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/40">
              {/* swap for <video src={q.mediaPlaceholder} controls /> or <img src={q.mediaPlaceholder} alt="" /> */}
              {isUrl ? (
                <a href={q.mediaPlaceholder} target="_blank" rel="noreferrer" className="btn-primary">Open clip</a>
              ) : (
                <span className="text-white/50">{q.type === 'video' ? 'Video/audio' : 'Image'} placeholder: {q.mediaPlaceholder}</span>
              )}
              {q.note && <span className="ml-4 text-white/60">{q.note}</span>}
            </div>
          )}

          <h2 className={`font-extrabold leading-tight ${q.type === 'text' || q.type === 'truefalse' ? 'text-4xl sm:text-6xl' : 'text-2xl sm:text-3xl'}`}>
            {q.questionText}
          </h2>

          {q.choices && (
            <div className="flex gap-4">
              {q.choices.map((ch, i) => (
                <span key={ch} className={`flex-1 rounded-2xl py-4 text-center text-2xl font-bold ${i === 0 ? 'bg-emerald-400/20 text-emerald-200' : 'bg-rose-400/20 text-rose-200'}`}>{ch}</span>
              ))}
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
              <button onClick={() => { setReveal(true); setRunning(false); }} className="btn-primary">Show answer</button>
            ) : (
              <button onClick={onProceed} className="btn-primary">Proceed to scoring</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
