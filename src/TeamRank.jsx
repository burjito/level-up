// readable text color on a team's color
export const textOn = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1c1650' : '#ffffff';
};

// Solid team-color pill: rank circle on the left, name, white score pill on the right.
export default function TeamRank({ team: t, rank, size = 'lg' }) {
  const fg = textOn(t.color);
  const sm = size === 'sm';
  return (
    <div style={{ background: t.color, color: fg }}
      className={`flex items-center rounded-full ring-white ${sm ? 'gap-2 p-1 shadow-sm ring-2' : 'gap-3 p-2 ring-2'}`}>
      <span style={{ color: fg === '#ffffff' ? t.color : '#1c1650' }}
        className={`grid shrink-0 place-items-center rounded-full bg-white font-display ${sm ? 'h-6 w-6 text-sm' : 'h-10 w-10 text-xl'}`}>
        {rank}
      </span>
      <span className={`min-w-0 flex-1 truncate font-semibold ${sm ? 'max-w-[9rem] text-sm' : 'text-lg'}`}>{t.name}</span>
      <span className={`rounded-full bg-white font-display tabular-nums text-ink ${sm ? 'px-3 py-0.5 text-base' : 'px-4 py-1 text-2xl'}`}>{t.score}</span>
    </div>
  );
}
