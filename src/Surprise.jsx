import { useEffect, useState } from 'react';
import { createTimerMusic, playAnswerReveal, playBeep, playBuzzer } from './sfx.js';
import QuestionMedia from './QuestionMedia.jsx';
import Confetti from './Confetti.jsx';
import SettingsMenu from './SettingsMenu.jsx';
import { SURPRISE_PASSCODE, SURPRISE_QUESTIONS, SURPRISE_SECONDS } from './surpriseData.js';

const CARD_COLORS = ['#dd0000', '#512dc3', '#0cb820', '#0040ff'];
const getCardColor = (questionNumber) => CARD_COLORS[Math.floor((questionNumber - 1) / 3)];

export function PasscodeModal({ onUnlock, onClose }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (code === SURPRISE_PASSCODE) onUnlock();
    else { setError(true); setCode(''); }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 p-4 backdrop-blur-md">
      <form onSubmit={submit} className="glass w-full max-w-md animate-pop rounded-[2rem] p-8 text-center motion-reduce:animate-none">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-poster-orange">Oops! Forbidden Area</p>
        <h2 className="mt-2 font-display text-3xl text-poster-violet">Authorized personnel only</h2>
        <p className="mt-2 text-ink/65">Enter the access code if you know what you’re doing.</p>
        <input type="password" autoFocus inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={code}
          onChange={(event) => { setCode(event.target.value.replace(/\D/g, '')); setError(false); }}
          aria-label="6-digit passcode" className="mt-6 w-full rounded-2xl border-2 border-poster-violet/30 px-4 py-3 text-center font-display text-3xl tracking-[.5em] outline-none focus:border-poster-orange" />
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-poster-red">Wrong passcode. Try again.</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={code.length !== 6} className="btn-primary flex-1">Unlock</button>
        </div>
      </form>
    </div>
  );
}

export function NameModal({ onConfirm, onClose }) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (name.trim().toLowerCase() === 'jemuel') onConfirm('Jemuel');
    else { setError(true); setName(''); }
  };

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-white/75 p-4 backdrop-blur-md">
      <form onSubmit={submit} className="glass w-full max-w-md animate-pop rounded-[2rem] p-8 text-center motion-reduce:animate-none">
        <p className="text-sm font-semibold uppercase tracking-[.2em] text-poster-orange">One last check</p>
        <h2 className="mt-2 font-display text-3xl text-poster-violet">Who is playing?</h2>
        <p className="mt-2 text-ink/65">Enter the player name to continue.</p>
        <input autoFocus value={name} onChange={(event) => { setName(event.target.value); setError(false); }}
          aria-label="Player name" className="mt-6 w-full rounded-2xl border-2 border-poster-violet/30 px-4 py-3 text-center font-display text-2xl outline-none focus:border-poster-orange" />
        {error && <p role="alert" className="mt-2 text-sm font-semibold text-poster-red">That name is not authorized.</p>}
        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button type="submit" disabled={!name.trim()} className="btn-primary flex-1">Continue</button>
        </div>
      </form>
    </div>
  );
}

export function SurpriseBoard({ answered, playerName, onPick, onFinalResults, onClose, onShowTally, onNewGame, hideRanking, onToggleHide }) {
  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-white p-3 sm:p-5"
      style={{ backgroundImage: 'linear-gradient(#e4e4ea 1px, transparent 1px), linear-gradient(90deg, #e4e4ea 1px, transparent 1px)', backgroundSize: '28px 28px' }}>
      <Confetti run />
      <div className="mx-auto flex h-full max-w-[1400px] flex-col gap-3">
        <header className="flex shrink-0 items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-poster-orange">Happy Pastor's Appreciation Month!</p>
            <h1 className="font-display text-2xl text-poster-blue sm:text-4xl">Thank you, Kuya Jem!</h1>
            <p className="mt-1 text-sm font-semibold text-ink/55">Player: {playerName}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onFinalResults} className="btn flex h-9 shrink-0 items-center justify-center bg-poster-orange px-4 py-0 text-sm text-white shadow-[0_4px_0_#a85b00] hover:brightness-110">Final results</button>
            <button onClick={onShowTally} className="btn-ghost px-4 py-1.5 text-sm">Scoreboard</button>
            <SettingsMenu onNewGame={onNewGame} hideRanking={hideRanking} onToggleHide={onToggleHide} />
            <button onClick={onClose} className="btn-ghost px-4 py-1.5 text-sm">Back to Level Up</button>
          </div>
        </header>
        <div className="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(260px,.9fr)_2fr]">
          <div className="relative hidden overflow-hidden rounded-[2rem] bg-poster-orange shadow-[0_8px_0_#a85b00] lg:block">
            <img src="/kuya-jem/kuya-jem-photo.png" alt="Kuya Jem" className="h-full w-full object-contain animate-float motion-reduce:animate-none" />
          </div>
          <div className="grid min-h-0 grid-cols-3 grid-rows-4 gap-2 sm:gap-3">
            {SURPRISE_QUESTIONS.map((q) => {
              const color = getCardColor(q.number);
              return answered.includes(q.id) ? (
              <div key={q.id} aria-label={`Question ${q.number}, answered`} className="flex items-center justify-center rounded-2xl border-2 border-dashed border-ink/15 bg-ink/5 font-display text-3xl text-ink/25">{q.number}</div>
            ) : (
              <button key={q.id} onClick={() => onPick(q)} style={{ borderColor: color, color, boxShadow: `0 5px 0 ${color}` }} className="rounded-2xl border-[3px] bg-white font-display text-[clamp(24px,5vw,62px)] transition hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-[3px]">
                <span className="block">{q.number}</span><span className="block text-[clamp(11px,1.5vw,18px)] text-ink/50">{q.points} pts</span>
              </button>
            );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SurpriseFinalResults({ onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Surprise final results" className="fixed inset-0 z-[80] flex flex-col items-center justify-center overflow-hidden bg-white/90 p-5 backdrop-blur-md sm:p-8">
      <Confetti run />
      <button
        onClick={onClose}
        aria-label="Back to surprise board"
        title="Back to surprise board"
        className="btn-ghost absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center p-0 text-2xl sm:right-8 sm:top-8"
      >
        &larr;
      </button>
      <div className="relative z-10 flex h-full w-full max-w-6xl flex-col items-center justify-center gap-5">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-poster-orange">Happy Pastor's Appreciation Month!</p>
          <h2 className="font-display text-4xl text-poster-blue sm:text-6xl">Thank you, Kuya / Ptr. Jem!</h2>
        </div>
        <video src="/kuya-jem/grand-prize-compressed.mp4" controls autoPlay playsInline className="max-h-[72vh] w-full rounded-[2rem] bg-black object-contain shadow-[0_12px_40px_rgba(81,45,195,.25)]" />
      </div>
    </div>
  );
}

export function SurpriseQuestion({ question: q, playerName, onProceed, onShowTally, onNewGame, hideRanking, onToggleHide }) {
  const color = getCardColor(q.number);
  const [left, setLeft] = useState(SURPRISE_SECONDS);
  const [running, setRunning] = useState(true);
  const [introReady, setIntroReady] = useState(!q.introMedia);
  const [voReady, setVoReady] = useState(false);
  const [voPlaying, setVoPlaying] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [music] = useState(() => createTimerMusic());

  useEffect(() => {
    if (!introReady) return undefined;
    const a = new Audio(q.questionVo);
    const done = () => { setVoPlaying(false); setVoReady(true); };
    a.addEventListener('playing', () => setVoPlaying(true));
    a.addEventListener('pause', () => setVoPlaying(false));
    a.addEventListener('ended', done);
    a.addEventListener('error', done);
    a.play().catch(done);
    const cap = setTimeout(done, 30000);
    return () => { clearTimeout(cap); a.pause(); };
  }, [q.questionVo, introReady]);

  const live = voReady;
  useEffect(() => {
    if (!live || !running || left <= 0) return undefined;
    const timer = setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [live, running, left]);
  useEffect(() => { if (live && left === 0) playBuzzer(); }, [live, left]);
  useEffect(() => () => music.stop(), [music]);
  useEffect(() => {
    const play = live && running && left > 0;
    music.setUrgent(left <= 5);
    if (play) music.start(); else music.stop();
    if (play && left <= 3) playBeep(left === 1 ? 1175 : 880);
  }, [live, running, left, music]);

  const showAnswer = () => { setReveal(true); setRunning(false); playAnswerReveal(); };
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-white/75 p-4 backdrop-blur-md">
      <div className="glass flex max-h-[94vh] w-full max-w-5xl flex-col gap-5 overflow-y-auto rounded-[2rem] border-t-[12px] p-6 animate-pop motion-reduce:animate-none sm:p-9" style={{ borderTopColor: color }}>
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-sm font-semibold uppercase tracking-[.16em]" style={{ color }}>HIDDEN JEM</p><h2 className="font-display text-2xl" style={{ color }}>Question #{q.number}</h2><p className="text-sm font-semibold text-ink/55">Player: {playerName}</p></div>
          <div className="flex items-center gap-2">
            <span role="timer" className={`font-display text-6xl tabular-nums ${left <= 5 ? 'animate-pulse text-poster-red motion-reduce:animate-none' : ''}`} style={left > 5 ? { color } : undefined}>{left}</span>
            <button onClick={() => setRunning((value) => !value)} disabled={!voReady || left === 0} className="btn-ghost px-3 py-1.5 text-sm">{running ? 'Pause' : 'Resume'}</button>
            <button onClick={onShowTally} className="btn-ghost px-3 py-1.5 text-sm">Scoreboard</button>
            <SettingsMenu onNewGame={onNewGame} hideRanking={hideRanking} onToggleHide={onToggleHide} />
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${(left / SURPRISE_SECONDS) * 100}%`, background: left <= 5 ? '#dd0000' : color }}
          />
        </div>
        {!introReady && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-ink/60">Watch the clip first…</p>
            <video
              src={q.introMedia}
              autoPlay
              controls
              playsInline
              onEnded={() => setIntroReady(true)}
              onError={() => setIntroReady(true)}
              className="mx-auto max-h-[42vh] w-auto max-w-full rounded-2xl bg-black"
            />
          </div>
        )}
        {!introReady && !voReady ? null : !voReady && <p className="text-sm font-semibold text-ink/60">{voPlaying ? 'Listen to the question…' : 'Loading question…'}</p>}
        <p className="font-display text-3xl leading-tight sm:text-5xl">{q.questionText}</p>
        {!reveal ? <button onClick={showAnswer} disabled={!voReady} className="btn-primary mt-auto self-end">Show answer</button> : (
          <>
            {q.answerMedia && <div><p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color }}>Answer reveal</p><QuestionMedia key={q.answerMedia} src={q.answerMedia} /></div>}
            <div className="rounded-2xl border-[4px] border-poster-green bg-poster-green/10 p-6 shadow-[0_6px_0_rgba(12,184,32,.2)]"><p className="text-sm font-semibold uppercase tracking-wide text-poster-green">Correct answer</p><p className="mt-1 font-display text-4xl text-ink sm:text-6xl">{q.answerText}</p></div>
            <button onClick={onProceed} className="btn-primary self-end">Proceed to scoring</button>
          </>
        )}
      </div>
    </div>
  );
}
