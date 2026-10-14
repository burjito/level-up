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
