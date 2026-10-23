import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { playIntro, playBuzzer, playBeep, createTimerMusic, playBonusAlert, playBonusReveal, playBonusVoice, playAnswerReveal } from './sfx.js';
import QuestionMedia from './QuestionMedia.jsx';
import ControlsMenu from './ControlsMenu.jsx';

const FALLBACK_MS = 3000; // used when the voiceover can't play
const isClip = (src) => /\.(mp3|m4a|wav|ogg|mp4|webm|mov)$/i.test(src);

function BonusBadge({ name }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-poster-orange py-1 pl-4 pr-1.5 font-display text-lg text-white">
      Bonus question
      <span className="rounded-full bg-white px-3 text-base text-poster-orange">{name}</span>
    </span>
  );
}

export default function QuestionModal({ question: q, category: c, onProceed }) {
  // 'intro' -> ('bonus' for bonus questions) -> 'question'
  const [step, setStep] = useState('intro');
  const afterIntro = q.bonus ? 'bonus' : 'question';
  const [bonusShown, setBonusShown] = useState(false); // the big badge has popped in
  const [flying, setFlying] = useState(false); // the badge is flying to the question card
  const [landed, setLanded] = useState(!q.bonus); // question content + timer start once the badge has landed
  const [reveal, setReveal] = useState(false);
  const [left, setLeft] = useState(q.seconds);
  const [running, setRunning] = useState(true);
  // Question voiceover (public/vo-questions): the timer and any audio/video clip wait until it has finished
  const [voReady, setVoReady] = useState(false);
  const [voPlaying, setVoPlaying] = useState(false);
  const [voMissing, setVoMissing] = useState(false);
  const [voiceOn, setVoiceOn] = useState(() => {
    try { return localStorage.getItem('level-up-question-voice') !== 'off'; } catch { return true; }
  });
  const voiceRef = useRef(null);
  const [answerReady, setAnswerReady] = useState(false); // an answer audio/video clip waits a moment for the reveal sound
  const audio = useRef(null);
  const music = useRef(null);
  const flyRef = useRef(null);
  const badgeRef = useRef(null);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('level-up-timer-sound') !== 'off'; } catch { return true; }
  });
  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try { localStorage.setItem('level-up-timer-sound', next ? 'on' : 'off'); } catch {}
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next); // applies from the next question on
    try { localStorage.setItem('level-up-question-voice', next ? 'on' : 'off'); } catch {}
  };
  const skipVoice = () => { voiceRef.current?.pause(); setVoPlaying(false); setVoReady(true); };
  const replayVoice = () => {
    if (!q.questionVo) return;
    const a = voiceRef.current ?? (voiceRef.current = new Audio(q.questionVo));
    a.currentTime = 0;
    a.play().catch(() => setVoMissing(true));
  };

  const showAnswer = () => {
    voiceRef.current?.pause();
    setVoReady(true);
    setReveal(true);
    setRunning(false);
    playAnswerReveal();
    if (q.answerMedia && isClip(q.answerMedia)) setTimeout(() => setAnswerReady(true), 1000);
  };

  const toNext = () => setStep((s) => (s === 'intro' ? afterIntro : s));
  const skipIntro = () => { audio.current?.pause(); toNext(); };
  const skipBonus = () => { setFlying(false); setLanded(true); setStep('question'); };

  // Step A: chime, then the category voiceover; moves on when it ends
  useEffect(() => {
    playIntro();
    const a = new Audio(c.vo);
    audio.current = a;
    let fb;
    const fail = () => { fb = setTimeout(toNext, FALLBACK_MS); };
    a.addEventListener('ended', toNext);
    a.addEventListener('error', fail);
    const start = setTimeout(() => a.play().catch(fail), 900);
    return () => { clearTimeout(start); clearTimeout(fb); a.pause(); a.removeEventListener('ended', toNext); a.removeEventListener('error', fail); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [c.vo]);

  // Bonus reveal: screen blinks 3x with alert blips, then the "Bonus question" + name badge pops in with a game-show voice,
  // then (once the voice is done and the badge has been shown for a moment) it flies to the card
  useEffect(() => {
    if (step !== 'bonus') return;
    let cancelled = false;
    let stopVoice = () => {};
    playBonusAlert();
    const t1 = setTimeout(() => {
      setBonusShown(true);
      playBonusReveal();
      const voice = playBonusVoice(q.bonus);
      stopVoice = voice.stop;
      Promise.all([voice.done, new Promise((r) => setTimeout(r, 1700))]).then(() => {
        if (!cancelled) { setFlying(true); setStep('question'); }
      });
    }, 1200);
    return () => { cancelled = true; clearTimeout(t1); stopVoice(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Fly the big badge to the badge slot in the question header (FLIP), then reveal the question and start the timer
  useLayoutEffect(() => {
    if (!flying) return;
    const el = flyRef.current;
    const target = badgeRef.current;
    const done = () => { setFlying(false); setLanded(true); };
    if (!el || !target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { done(); return; }
    const from = el.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const s0 = from.width / el.offsetWidth;
    const s1 = to.width / el.offsetWidth;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const anim = el.animate(
      [{ transform: `translate(0px, 0px) scale(${s0})` }, { transform: `translate(${dx}px, ${dy}px) scale(${s1})` }],
      { duration: 800, easing: 'cubic-bezier(.3,.8,.2,1)', fill: 'forwards' }
    );
    anim.onfinish = done;
    return () => anim.cancel();
  }, [flying]);

  // Question voiceover: starts when the question is shown. A missing file or a blocked autoplay never holds up the game.
  useEffect(() => {
    if (!(step === 'question' && landed)) return;
    if (!voiceOn || !q.questionVo) { setVoReady(true); return; }
    const a = new Audio(q.questionVo);
    voiceRef.current = a;
    const open = () => { setVoPlaying(false); setVoReady(true); };
    a.addEventListener('playing', () => setVoPlaying(true));
    a.addEventListener('pause', () => setVoPlaying(false));
    a.addEventListener('ended', open);
    a.addEventListener('error', () => { setVoMissing(true); open(); });
    a.play().catch(open);
    const cap = setTimeout(open, 30000);
    return () => { clearTimeout(cap); a.pause(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, landed]);

  // Step B: countdown starts when the question is fully shown and its voiceover has finished
  const live = step === 'question' && landed && voReady;
  useEffect(() => {
    if (!live || !running || left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [live, running, left]);
  useEffect(() => { if (live && left === 0) playBuzzer(); }, [live, left]);

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
    const play = live && running && left > 0 && soundOn && (!hasClip || left <= 5);
    try {
      m.setUrgent(left <= 5);
      if (play) m.start(); else m.stop();
      if (play && left <= 3) playBeep(left === 1 ? 1175 : 880);
    } catch {}
  }, [live, running, left, soundOn, q]);

  const urgent = left <= 5;
  // question media first; if the question has an answer clip/photo, it replaces it on reveal
  const shownMedia = reveal && q.answerMedia ? q.answerMedia : q.mediaPlaceholder;
  const len = q.questionText.length;
  const size = len > 90 ? 'text-2xl sm:text-4xl' : len > 50 ? 'text-3xl sm:text-5xl' : 'text-4xl sm:text-6xl';

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-white/70 p-4 backdrop-blur-md">
      {step === 'intro' && (
        <div key="intro" className="relative h-[min(78vh,640px)] w-full max-w-4xl animate-pop overflow-hidden rounded-[2rem] border-[6px] border-white shadow-2xl motion-reduce:animate-none" style={{ background: c.color }}>
          <img src={c.img} alt={c.name} className="h-full w-full object-contain" />
          <span className="absolute bottom-5 left-5 rounded-full bg-white px-5 py-2 font-display text-xl" style={{ color: c.color }}>{q.points} pts</span>
          <button onClick={skipIntro} className="btn-ghost absolute bottom-5 right-5 px-5 py-2 text-base">Skip intro</button>
        </div>
      )}

      {step === 'bonus' && (
        <>
          <p role="status" className="sr-only">Bonus question: {q.bonus.name}</p>
          <div aria-hidden className="pointer-events-none absolute inset-0 animate-blink bg-poster-orange/35 motion-reduce:animate-none" />
          {bonusShown && <span aria-hidden className="absolute h-56 w-56 animate-ping rounded-full border-8 border-poster-orange/60 motion-reduce:animate-none" />}
          <button onClick={skipBonus} className="btn-ghost absolute bottom-5 right-5 z-20 px-5 py-2 text-base">Skip</button>
        </>
      )}

      {step === 'question' && (
        <div key="question" className={`glass flex max-h-[94vh] w-full max-w-5xl flex-col gap-5 overflow-y-auto rounded-[2rem] border-t-[12px] p-6 motion-reduce:animate-none sm:p-9 ${q.bonus ? 'animate-fade' : 'animate-pop'}`} style={{ borderTopColor: c.color }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="h-16 w-[5.2rem] overflow-hidden rounded-xl" style={{ background: c.color }}><img src={c.img} alt="" className="h-full w-full object-contain" /></span>
              <span className="rounded-full px-4 py-1 font-display text-lg text-white" style={{ background: c.color }}>{q.points} pts</span>
              {q.bonus && <span ref={badgeRef} className={`inline-flex ${landed ? '' : 'invisible'}`}><BonusBadge name={q.bonus.name} /></span>}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <span role="timer" className={`min-w-[2.5ch] text-right font-display text-6xl tabular-nums ${left === 0 || urgent ? 'animate-pulse text-poster-red motion-reduce:animate-none' : ''}`} style={!urgent ? { color: c.color } : undefined}>{left}</span>
              <button onClick={() => setRunning((r) => !r)} disabled={left === 0} className="btn-ghost px-4 py-1.5 text-sm">{running ? 'Pause' : 'Resume'}</button>
              <ControlsMenu
                items={[
                  { label: 'Reset timer', onSelect: () => { setLeft(q.seconds); setRunning(true); } },
                  { label: 'Replay voice', onSelect: replayVoice, hidden: voMissing || !voReady || voPlaying },
                  { label: 'Countdown sound', onSelect: toggleSound, toggle: true, on: soundOn },
                  { label: 'Question voice', onSelect: toggleVoice, toggle: true, on: voiceOn },
                ]}
              />
            </div>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full transition-[width] duration-1000 ease-linear" style={{ width: `${(left / q.seconds) * 100}%`, background: urgent ? '#dd0000' : c.color }} />
          </div>

          {landed && !voReady && (
            <div className="flex items-center gap-3 text-sm font-semibold text-ink/60">
              Listen to the question…
              {voPlaying && <button onClick={skipVoice} className="rounded-full px-3 py-0.5 text-poster-violet ring-1 ring-poster-violet/40 hover:bg-poster-violet/10">Skip</button>}
            </div>
          )}

          {/* hidden until the bonus badge has landed (the layout is already in place, so nothing jumps) */}
          <div className={`contents ${landed ? '' : 'invisible'}`}>
            {left === 0 && <p className="font-display text-3xl text-poster-red">Time's up!</p>}

            {landed && shownMedia && (!isClip(shownMedia) || (reveal && q.answerMedia ? answerReady : voReady)) && (
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
              {!reveal ? <button onClick={showAnswer} className="btn-primary">Show answer</button>
                : <button onClick={onProceed} className="btn-primary">Proceed to scoring</button>}
            </div>
          </div>
        </div>
      )}

      {/* the big bonus badge: pops in at the center, then flies to the question header */}
      {q.bonus && (step === 'bonus' || flying) && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div ref={flyRef} style={{ transform: 'scale(2.6)' }}>
            {(bonusShown || flying) && <div className="animate-bonus-in motion-reduce:animate-none"><BonusBadge name={q.bonus.name} /></div>}
          </div>
        </div>
      )}
    </div>
  );
}
