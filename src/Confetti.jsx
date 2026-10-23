import { useEffect, useRef } from 'react';

const COLORS = ['#dd0000', '#0040ff', '#512dc3', '#0cb820', '#ff8a00', '#fbbf24', '#ec4899'];

// Confetti cannons from both bottom corners plus a shower from the top. Starts when `run` becomes true.
export default function Confetti({ run }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!run || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const parts = [];
    const add = (x, y, vx, vy) =>
      parts.push({ x, y, vx, vy, w: 6 + Math.random() * 8, h: 4 + Math.random() * 6, r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.35, c: COLORS[(Math.random() * COLORS.length) | 0] });
    for (let i = 0; i < 110; i++) {
      add(0, canvas.height, 5 + Math.random() * 10, -(12 + Math.random() * 14));
      add(canvas.width, canvas.height, -(5 + Math.random() * 10), -(12 + Math.random() * 14));
    }

    let frame = 0;
    let raf;
    const tick = () => {
      frame++;
      if (frame < 200 && frame % 2 === 0) for (let i = 0; i < 4; i++) add(Math.random() * canvas.width, -10, (Math.random() - 0.5) * 2, 2 + Math.random() * 3);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.vy += 0.38;
        p.vx *= 0.992;
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.vr;
        if (p.y > canvas.height + 20) { parts.splice(i, 1); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (frame < 200 || parts.length) raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [run]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[90]" />;
}
