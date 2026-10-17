import { useEffect, useRef, useState } from 'react';
import { playIntro, playBuzzer, playBeep, createTimerMusic } from './sfx.js';
import QuestionMedia from './QuestionMedia.jsx';

const FALLBACK_MS = 3000; // used when the voiceover can't play

export default function QuestionModal({ question: q, category: c, onProceed }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'question'
  const [reveal, setReveal] = useState(false);
  const [left, setLeft] = useState(q.seconds);
  const [running, setRunning] = useState(true);
  const audio = useRef(null);
  const music = useRef(null);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('level-up-timer-sound') !== 'off'; } catch { return true; }
  });
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try { localStorage.setItem('level-up-timer-sound', next ? 'on' : 'off'); } catch {}
  };

  const toQuestion = () => { audio.current?.pause(); setStep('question'); };

  // Step A: chime, then the category voiceover; moves on when it ends
  useEffect(() => {
    playIntro();
    const a = new Audio(c.vo);
    audio.current = a;
    let fb;
    const next = () => setStep('question');
    const fail = () => { fb = setTimeout(next, FALLBACK_MS); };
    a.addEventListener('ended', next);
    a.addEventListener('error', fail);
    const start = setTimeout(() => a.play().catch(fail), 900);
    return () => { clearTimeout(start); clearTimeout(fb); a.pause(); a.removeEventListener('ended', next); a.removeEventListener('error', fail); };
  }, [c.vo]);

  // Step B: countdown starts when the question appears
  useEffect(() => {
    if (step !== 'question' || !running || left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [step, running, left]);
  useEffect(() => { if (step === 'question' && left === 0) playBuzzer(); }, [step, left]);

  // Countdown music: runs while the timer runs, speeds up and brightens in the last 5 seconds.
  // Questions with their own audio/video clip stay quiet until the last 5 seconds so the clip can be heard.
  useEffect(() => {
    music.current = createTimerMusic();
    return () => music.current.stop();
  }, []);
  useEffect(() => {
    const m = music.current;
    if (!m) return;
    const hasClip = /\.(mp3|m4a|wav|ogg|mp4|webm|mov)$/i.test(q.mediaPlaceholder ?? '');
    const play = step === 'question' && running && left > 0 && soundOn && (!hasClip || left <= 5);
    try {
      m.setUrgent(left <= 5);
      if (play) m.start(); else m.stop();
      if (play && left <= 3) playBeep(left === 1 ? 1175 : 880);
    } catch {}
  }, [step, running, left, soundOn, q]);

  const urgent = left <= 5;
  // question media first; if the question has an answer clip/photo, it replaces it on reveal
  const shownMedia = reveal && q.answerMedia ? q.answerMedia : q.mediaPlaceholder;
  const len = q.questionText.length;
  const size = len > 90 ? 'text-2xl sm:text-4xl' : len > 50 ? 'text-3xl sm:text-5xl' : 'text-4xl sm:text-6xl';

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 p-4 backdrop-blur-md">
      {step === 'intro' ? (
        <div key="intro" className="relative h-[min(78vh,640px)] w-full max-w-4xl animate-pop overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl motion-reduce:animate-none" style={{ background: c.color }}>
          <img src={c.img} alt={c.name} className="h-full w-full object-contain" />
          <span className="absolute bottom-5 left-5 rounded-full bg-white px-5 py-2 font-display text-xl" style={{ color: c.color }}>{q.points} pts</span>
          <button onClick={toQuestion} className="btn-ghost absolute bottom-5 right-5 px-5 py-2 text-base">Skip intro</button>
        </div>
      ) : (
        <div key="question" className="glass flex max-h-[94vh] w-full max-w-5xl animate-pop flex-col gap-5 overflow-y-auto rounded-[2rem] border-t-[12px] p-6 motion-reduce:animate-none sm:p-9" style={{ borderTopColor: c.color }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="h-16 w-[5.2rem] overflow-hidden rounded-xl" style={{ background: c.color }}><img src={c.img} alt="" className="h-full w-full object-contain" /></span>
              <span className="rounded-full px-4 py-1 font-display text-lg text-white" style={{ background: c.color }}>{q.points} pts</span>
              {q.bonus && (
                <span className="flex items-center gap-2 rounded-full bg-poster-orange py-1 pl-4 pr-1.5 font-display text-lg text-white">
                  Bonus question
                  <span className="rounded-full bg-white px-3 text-base text-poster-orange">{q.bonus.name}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span role="timer" className={`min-w-[2.5ch] text-right font-display text-6xl tabular-nums ${left === 0 || urgent ? 'animate-pulse text-poster-red motion-reduce:animate-none' : ''}`} style={!urgent ? { color: c.color } : undefined}>{left}</span>
              <button onClick={() => setRunning((r) => !r)} disabled={left === 0} className="btn-ghost px-4 py-1.5 text-sm">{running ? 'Pause' : 'Resume'}</button>
              <button onClick={() => { setLeft(q.seconds); setRunning(true); }} className="btn-ghost px-4 py-1.5 text-sm">Reset</button>
              <button onClick={toggleSound} aria-pressed={soundOn} className="btn-ghost px-4 py-1.5 text-sm">{soundOn ? 'Sound on' : 'Sound off'}</button>
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(left / q.seconds) * 100}%`, background: urgent ? '#dd0000' : c.color }} />
          </div>
          {left === 0 && <p className="font-display text-3xl text-poster-red">Time's up!</p>}

          {shownMedia && (
            <div className="space-y-2">
              <QuestionMedia key={shownMedia} src={shownMedia} />
              {q.note && <p className="text-center text-sm text-ink/60">{q.note}</p>}
            </div>
          )}

          <h2 className={`font-display leading-tight ${size}`}>{q.questionText}</h2>

          {q.choices && (
            <div className="flex gap-4">
              {q.choices.map((ch, i) => (
                <span key={ch} className={`flex-1 rounded-2xl py-4 text-center font-display text-2xl text-white ${i === 0 ? 'bg-poster-blue' : 'bg-poster-red'}`}>{ch}</span>
              ))}
            </div>
          )}

          {reveal && (
            <div className="animate-pop rounded-2xl border-[3px] border-poster-green bg-poster-green/10 p-5 motion-reduce:animate-none">
              <p className="text-sm font-semibold uppercase tracking-wide text-poster-green">Answer</p>
              <p className="font-display text-3xl sm:text-4xl">{q.answerText}</p>
            </div>
          )}

          <div className="mt-auto flex justify-end">
            {!reveal ? <button onClick={() => { setReveal(true); setRunning(false); }} className="btn-primary">Show answer</button>
              : <button onClick={onProceed} className="btn-primary">Proceed to scoring</button>}
          </div>
        </div>
      )}
    </div>
  );
}
