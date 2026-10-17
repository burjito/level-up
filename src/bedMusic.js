import { useSyncExternalStore } from 'react';

// Background "bed" music for the waiting time (registration + board).
// Put your track at public/music/bed.mp3. It loops. (Add more paths here and they play one after another.)
const TRACKS = ['/music/bed.mp3'];
// Volume per phase (0 to 1). Any other phase (a question is open, small screen) is silent.
const LEVEL = { registration: 0.5, board: 0.45, scoreboard: 0.18 };
const KEY = 'level-up-music';

const readEnabled = () => {
  try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; }
};

let audio = null;
let index = 0;
let failures = 0;
let target = 0;
let tick = null;
let waiting = false;
let state = { enabled: readEnabled(), missing: false };
const listeners = new Set();
const setState = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
const goal = () => (state.enabled && !state.missing ? target : 0);

function next() {
  const a = getAudio();
  index = (index + 1) % TRACKS.length;
  a.src = TRACKS[index];
  if (goal() > 0) a.play().catch(() => {});
}

function getAudio() {
  if (audio) return audio;
  audio = new Audio(TRACKS[index]);
  audio.volume = 0;
  audio.loop = TRACKS.length === 1;
  audio.addEventListener('playing', () => { failures = 0; });
  audio.addEventListener('ended', next);
  audio.addEventListener('error', () => {
    failures += 1;
    if (failures >= TRACKS.length) setState({ missing: true }); // no usable file in public/music
    else next(); // skip a missing/broken track
  });
  return audio;
}

// fade toward the goal volume, pause when silent
function step() {
  const a = getAudio();
  const g = goal();
  const diff = g - a.volume;
  if (Math.abs(diff) <= 0.02) {
    a.volume = g;
    clearInterval(tick);
    tick = null;
    if (g === 0) a.pause();
    return;
  }
  a.volume = Math.min(1, Math.max(0, a.volume + Math.sign(diff) * 0.03));
}

// browsers block sound until the first click or key press, so wait for one
function waitForGesture() {
  if (waiting) return;
  waiting = true;
  const go = () => {
    waiting = false;
    window.removeEventListener('pointerdown', go);
    window.removeEventListener('keydown', go);
    update();
  };
  window.addEventListener('pointerdown', go);
  window.addEventListener('keydown', go);
}

function update() {
  const a = getAudio();
  if (goal() > 0 && a.paused) {
    a.play().catch((e) => { if (e?.name === 'NotAllowedError') waitForGesture(); });
  }
  if (!tick) tick = setInterval(step, 60);
}

export const setBedPhase = (phase) => {
  target = LEVEL[phase] ?? 0;
  update();
};

export const toggleBedMusic = () => {
  const enabled = !state.enabled;
  try { localStorage.setItem(KEY, enabled ? 'on' : 'off'); } catch {}
  setState({ enabled });
  update();
};

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const useBedMusic = () => useSyncExternalStore(subscribe, () => state);
