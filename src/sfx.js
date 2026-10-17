// Built-in sound effects (no audio files needed). Pass a file path to playIntro to use your own mp3 instead.
let ctx;
const ac = () => {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function tone(freq, start, dur, type = 'triangle', vol = 0.15) {
  const a = ac();
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.value = freq;
  o.connect(g);
  g.connect(a.destination);
  const t = a.currentTime + start;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.start(t);
  o.stop(t + dur + 0.05);
}

// "Level up" arpeggio
export function playIntro(file) {
  if (file) return new Audio(file).play().catch(() => {});
  try {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.35));
    tone(1318.5, 0.5, 0.7, 'triangle', 0.12);
  } catch {}
}

// Time's up buzzer
export function playBuzzer() {
  try {
    tone(180, 0, 0.5, 'sawtooth', 0.12);
    tone(140, 0.2, 0.7, 'sawtooth', 0.1);
  } catch {}
}

// Short beep for the last seconds of the countdown
export function playBeep(freq = 880) {
  try { tone(freq, 0, 0.14, 'square', 0.09); } catch {}
}

// Countdown "thinking music": kick + hat + clap + bass groove (A minor).
// setUrgent(true) speeds it up and adds an alarm arpeggio. No audio files needed.
let noise;
const noiseBuffer = () => {
  if (noise) return noise;
  const a = ac();
  noise = a.createBuffer(1, Math.floor(a.sampleRate * 0.5), a.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
};

export function createTimerMusic() {
  let timer = null;
  let master = null;
  let nextTime = 0;
  let step = 0;
  let urgent = false;
  const BASS = [55, 0, 55, 55, 0, 65.41, 0, 73.42]; // one bar of eighth notes
  const ARP = [440, 523.25, 659.25, 880];

  const env = (g, t, peak, dur) => {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  };
  const osc = (type, freq, t, peak, dur, filterFreq) => {
    const a = ac();
    const o = a.createOscillator();
    const g = a.createGain();
    o.type = type;
    o.frequency.value = freq;
    env(g, t, peak, dur);
    if (filterFreq) {
      const f = a.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = filterFreq;
      o.connect(f).connect(g);
    } else o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  };
  const kick = (t) => {
    const a = ac();
    const o = a.createOscillator();
    const g = a.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    env(g, t, 1, 0.2);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.22);
  };
  const hit = (t, type, freq, peak, dur) => {
    const a = ac();
    const s = a.createBufferSource();
    const f = a.createBiquadFilter();
    const g = a.createGain();
    s.buffer = noiseBuffer();
    f.type = type;
    f.frequency.value = freq;
    env(g, t, peak, dur);
    s.connect(f).connect(g).connect(master);
    s.start(t);
    s.stop(t + dur + 0.02);
  };

  const schedule = () => {
    const a = ac();
    while (nextTime < a.currentTime + 0.12) {
      const s = step % 8;
      const dur = 60 / (urgent ? 160 : 126) / 2; // eighth note
      if (s % 2 === 0) kick(nextTime);
      if (s % 2 === 1 || urgent) hit(nextTime, 'highpass', 7000, 0.18, 0.05); // hats
      if (s === 2 || s === 6) hit(nextTime, 'bandpass', 1800, 0.35, 0.12); // clap on 2 and 4
      if (BASS[s]) osc('sawtooth', BASS[s], nextTime, 0.35, dur * 0.9, 380);
      if (urgent) osc('square', ARP[step % ARP.length], nextTime, 0.1, 0.09);
      nextTime += dur;
      step++;
    }
  };

  return {
    start() {
      if (timer) return;
      const a = ac();
      master = a.createGain();
      master.gain.value = 0.28;
      master.connect(a.destination);
      nextTime = a.currentTime + 0.05;
      schedule();
      timer = setInterval(schedule, 30);
    },
    stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
      const m = master;
      m.gain.setTargetAtTime(0, ac().currentTime, 0.03);
      setTimeout(() => m.disconnect(), 300);
    },
    setUrgent(v) { urgent = v; },
  };
}

// Bonus question reveal: three alert blips while the screen blinks, then a bright sparkle when the name appears
export function playBonusAlert() {
  try { [0, 0.4, 0.8].forEach((t, i) => tone(660 + i * 110, t, 0.18, 'square', 0.1)); } catch {}
}
export function playBonusReveal() {
  try {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.07, 0.5, 'triangle', 0.14));
    tone(2093, 0.4, 0.8, 'sine', 0.06);
  } catch {}
}
