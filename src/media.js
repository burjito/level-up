// Media per question, from public/media-questions/. Naming: q<number>-<category-slug>[-correct].<ext>
//  mediaPlaceholder = shown with the question; answerMedia = shown instead when the answer is revealed.
const D = '/media-questions/';
const f = (n, slug, ext = 'png', correct = false) => `${D}q${n}-${slug}${correct ? '-correct' : ''}.${ext}`;
const K = 'kakascroll-mo-yan';
const S = 'sino-yarn';
const T = 'trot-o-charot';
const B = 'bible';

export const MEDIA = {
  // Kaka-scroll Mo Yan!: photo first, video plays as the answer
  'scroll-1': { type: 'photo', mediaPlaceholder: f(1, K), answerMedia: f(1, K, 'mp4', true) },
  'scroll-6': { type: 'photo', mediaPlaceholder: f(6, K), answerMedia: f(6, K, 'mp4', true) },
  'scroll-9': { type: 'photo', mediaPlaceholder: f(9, K), answerMedia: f(9, K, 'mp4', true) },
  // Sino Yarn?
  'sino-1': { type: 'audio', mediaPlaceholder: f(1, S, 'mp3') },
  'sino-2': { type: 'photo', mediaPlaceholder: f(2, S), answerMedia: f(2, S, 'jpg', true) },
  'sino-3': { type: 'audio', mediaPlaceholder: f(3, S, 'mp3'), answerMedia: f(3, S, 'mp4', true) }, // quote audio plays after the question voiceover; the video plays on reveal
  'sino-4': { type: 'audio', mediaPlaceholder: f(4, S, 'mp3'), answerMedia: f(4, S, 'mp4', true) },
  'sino-5': { type: 'photo', mediaPlaceholder: f(5, S), answerMedia: f(5, S, 'mp4', true) },
  // Trot o Charot
  'trot-8': { type: 'photo', mediaPlaceholder: f(8, T), answerMedia: f(8, T, 'mp4', true) },
  'trot-9': { type: 'video', mediaPlaceholder: f(9, T, 'mp4') },
  'trot-10': { type: 'photo', mediaPlaceholder: f(10, T), answerMedia: f(10, T, 'mp4', true) },
  // Bible
  'bible-3': { type: 'photo', mediaPlaceholder: f(3, B) },
  'bible-2': { type: 'photo', mediaPlaceholder: f(2, B) },
};
