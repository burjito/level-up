// Bonus questions. key = question id ("<category>-<number>").
// multiply: winners get base points x value. add: winners get base points + value.
// Move a bonus to another question by changing its key.
export const BONUS = {
  'scroll-5': { name: 'Double Up', kind: 'multiply', value: 2 },
  'bible-3': { name: 'Plus 50 points', kind: 'add', value: 50 },
  'sino-2': { name: 'Triple Up', kind: 'multiply', value: 3 },
  'trot-4': { name: 'Plus 100 points', kind: 'add', value: 100 },
  'grade5-9': { name: 'Power Up (200 points)', kind: 'add', value: 200 },
};

export const bonusPoints = (b, base) => (b.kind === 'multiply' ? base * b.value : base + b.value);
