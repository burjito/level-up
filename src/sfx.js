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

export function createWarningAlarm() {
  let timer = null;
  const siren = () => {
    try {
      const a = ac();
      const start = a.currentTime;
      const oscillator = a.createOscillator();
      const gain = a.createGain();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(430, start);
      oscillator.frequency.linearRampToValueAtTime(980, start + 0.48);
      oscillator.frequency.linearRampToValueAtTime(430, start + 0.96);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(0.24, start + 0.04);
      gain.gain.setValueAtTime(0.24, start + 0.82);
      gain.gain.linearRampToValueAtTime(0.0001, start + 0.98);
      oscillator.connect(gain).connect(a.destination);
      oscillator.start(start);
      oscillator.stop(start + 1.02);
      tone(215, 0, 0.72, 'square', 0.16);
    } catch {}
  };
  return {
    start() {
      if (timer) return;
      siren();
      timer = setInterval(siren, 1400);
    },
    stop() {
      if (!timer) return;
      clearInterval(timer);
      timer = null;
    },
  };
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

// Bonus question voiceover: public/vo/bonus.m4a ("Bonus question!"), then the bonus's own callout (bonus.vo, optional).
// If bonus.m4a is missing, the browser's built-in voice says it instead. Returns { done, stop }.
const BONUS_VO = '/vo/bonus.m4a';

export function playBonusVoice(bonus) {
  let stopped = false;
  let current = null;
  const playFile = (src) =>
    new Promise((resolve) => {
      const a = new Audio(src);
      current = a;
      a.addEventListener('ended', () => resolve(true));
      a.addEventListener('error', () => resolve(false));
      a.play().catch(() => resolve(false));
    });
  const speak = (text) =>
    new Promise((resolve) => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.05;
        u.pitch = 1.35;
        u.onend = u.onerror = () => resolve();
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(u);
      } catch { resolve(); }
    });

  const run = (async () => {
    const ok = await playFile(BONUS_VO);
    if (stopped) return;
    if (!ok) return speak(`Bonus question! ${bonus.name.replace(/\(.*?\)/g, '')}`);
    if (bonus.vo) await playFile(bonus.vo);
  })();

  return {
    // resolves when the voice is finished (or after 6s at most, so the game never gets stuck)
    done: Promise.race([run, new Promise((r) => setTimeout(r, 6000))]),
    stop() {
      stopped = true;
      current?.pause();
      try { window.speechSynthesis.cancel(); } catch {}
    },
  };
}

// "Ta-da": rising pickup, then a bright chord with a sparkle, when the answer is revealed
export function playAnswerReveal() {
  try {
    [392, 523.25, 659.25].forEach((f, i) => tone(f, i * 0.09, 0.18, 'triangle', 0.14));
    [523.25, 659.25, 783.99, 1046.5].forEach((f) => tone(f, 0.3, 0.7, 'triangle', 0.1));
    tone(2093, 0.32, 0.6, 'sine', 0.05);
  } catch {}
}

// ---- Final results podium ----
const snareHit = (t, peak) => {
  const a = ac();
  const s = a.createBufferSource();
  const f = a.createBiquadFilter();
  const g = a.createGain();
  s.buffer = noiseBuffer();
  f.type = 'bandpass';
  f.frequency.value = 1800;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
  s.connect(f).connect(g).connect(a.destination);
  s.start(t);
  s.stop(t + 0.08);
};

// A bright "ding" as 3rd / 2nd place appears
export function playPodiumStep(place) {
  try {
    const base = place === 3 ? 523.25 : 659.25;
    tone(base, 0, 0.5, 'triangle', 0.16);
    tone(base * 1.5, 0.1, 0.6, 'triangle', 0.12);
    tone(base * 2, 0.2, 0.7, 'sine', 0.06);
  } catch {}
}

// Drum roll that builds up before the winner is shown
export function playDrumRoll(seconds = 1.3) {
  try {
    const a = ac();
    const hits = Math.floor(seconds * 24);
    for (let i = 0; i < hits; i++) snareHit(a.currentTime + (i / hits) * seconds, 0.05 + 0.25 * (i / hits));
  } catch {}
}

// Winner fanfare: rising brass-like arpeggio, a big chord, bass and a cymbal crash
export function playFanfare() {
  try {
    [[523.25, 0], [659.25, 0.12], [783.99, 0.24], [1046.5, 0.36]].forEach(([f, t]) => tone(f, t, 0.25, 'sawtooth', 0.07));
    [523.25, 659.25, 783.99, 1046.5].forEach((f) => {
      tone(f, 0.55, 1.6, 'sawtooth', 0.06);
      tone(f * 2, 0.55, 1.2, 'triangle', 0.05);
    });
    tone(130.81, 0.55, 1.6, 'sawtooth', 0.12);
    const a = ac();
    const s = a.createBufferSource();
    const f = a.createBiquadFilter();
    const g = a.createGain();
    const t = a.currentTime + 0.55;
    s.buffer = noiseBuffer();
    f.type = 'highpass';
    f.frequency.value = 6000;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    s.connect(f).connect(g).connect(a.destination);
    s.start(t);
    s.stop(t + 1.5);
  } catch {}
}
