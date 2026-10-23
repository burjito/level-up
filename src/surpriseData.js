export const SURPRISE_PASSCODE = '111791';
export const SURPRISE_SECONDS = 10;

const ROOT = '/kuya-jem';

const QUESTIONS = [
  ['Anong Thai fashion staple na kilala sa bold block-letter branding at minimalist design nito ang naging massively popular across Asia?', 'Gentle Woman'],
  ['Saan sumakay si Yeng nang bigla siyang may nakatabi?', 'Jeepney'],
  ['Ano ang sinusuot ng tao na delikado kapag napatagal at nakatulugan?', 'Contact Lens'],
  ['Bukod sa UP at QC, saang kalsada pa baka biglang may makita si Maki?', 'BGC'],
  ['Anong Microsoft Office ang explicitly na biniblamе ng investigators dahil sa NASA Disaster noong 2003 sa Columbia Space Shuttle?', 'PPT'],
  ['Ano ang ginagawa ni Nadine Lustre sa ending ng pelikulang "Never Not Love You"?', 'Drive'],
  ['Guess the word! 🐑+😋-CK   😯+🛣️+👯‍♀️', 'Bali Oasis'],
  ['Around 4 billion na puno kada taon ang pinuputol at ito ay umaaccount sa halos 35% ng deforestation annually para makagawa ng ano?', 'Papel'],
  ['Ano ang trabaho ni kuya na nasa video?', 'Grab Driver'],
  ['Ano ang sikat na pagkain sa Japan ang may Chinese origin?', 'Ramen'],
  ['Kung ang Tagalog ng alive ay "may buhay" at ang English naman ng kanan ay "right", ano ang English ng "Buhay Gitna"?', 'Life Center'],
  ['Anong taon na-realease ang iPhone?', '2007'],
];

const VO_FILES = [
  'gentle-woman', 'jeepney', 'contact-lens', 'bgc', 'ppt', 'drive',
  'bali-oasis', 'papel', 'grab-driver', 'ramen', 'life-center', '2007',
];

const answerFiles = [
  'card-1-answer-gentle-woman.m4a',
  'card-2-answer-jeepney.mp4',
  'card-3-answer-contact-lens.m4a',
  'card-4-answer-bgc.aac',
  'card-5-answer-ppt.mp3',
  'card-6-answer-drive.m4a',
  'card-7-answer-bali-oasis.m4a',
  'card-8-answer-papel.m4a',
  'card-9-answer-grab-driver.mp4',
  'card-10-answer-ramen.mp4',
  'card-11-answer-life-center.mp4',
  'card-12-answer-2007.mp4',
];

export const SURPRISE_QUESTIONS = QUESTIONS.map(([questionText, answerText], index) => {
  const number = index + 1;
  return {
    id: `kuya-jem-${number}`,
    number,
    questionText,
    answerText,
    points: number * 100,
    questionVo: `${ROOT}/questions-audio/card-${number}-vo-${VO_FILES[index]}.m4a`,
    answerMedia: `${ROOT}/answers-media/${answerFiles[index]}`,
  };
});
