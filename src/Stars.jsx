// [star, left, top, size(vmin), duration(s), delay(s)]
const STARS = [
  ['red', '3%', '5%', 15, 8, 0], ['orange', '85%', '3%', 17, 10, -2], ['violet', '1%', '58%', 19, 9, -4],
  ['green', '84%', '66%', 18, 11, -1], ['blue', '47%', '86%', 9, 7, -3], ['orange', '32%', '3%', 7, 6, -2],
  ['violet', '72%', '42%', 6, 8, -5], ['red', '20%', '80%', 6, 7, -1],
];

export default function Stars() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {STARS.map(([c, left, top, s, d, delay], i) => (
        <img key={i} src={`/elements/star-${c}.webp`} alt="" className="absolute animate-float"
          style={{ left, top, width: `${s}vmin`, animationDuration: `${d}s`, animationDelay: `${delay}s` }} />
      ))}
    </div>
  );
}
