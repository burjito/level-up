// Bonus questions. key = question id ("<category>-<number>").
// multiply: winners get base points x value. add: winners get base points + value.
// Move a bonus to another question by changing its key.
// vo = optional voiceover that says the bonus name (file in public/vo). Missing files are skipped.
export const BONUS = {
  'scroll-5': { name: 'Double Up', kind: 'multiply', value: 2, vo: '/vo/bonus-double-up.m4a' },
  'bible-3': { name: 'Plus 50 points', kind: 'add', value: 50, vo: '/vo/bonus-plus-50.m4a' },
  'sino-7': { name: 'Triple Up', kind: 'multiply', value: 3, vo: '/vo/bonus-triple-up.m4a' },
  'trot-4': { name: 'Plus 100 points', kind: 'add', value: 100, vo: '/vo/bonus-plus-100.m4a' },
  'grade5-9': { name: 'Power Up (200 points)', kind: 'add', value: 200, vo: '/vo/bonus-power-up.m4a' },
};

export const bonusPoints = (b, base) => (b.kind === 'multiply' ? base * b.value : base + b.value);
