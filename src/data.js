// Mock game data. Types: 'text' | 'photo' | 'truefalse' | 'video'
// Replace mediaPlaceholder paths with files placed in /public/media/...
export const CATEGORIES = [
  { id: 'pop', name: 'Pop Culture', emoji: '🎬', bg: '/media/pop/cover.jpg', voiceover: '/audio/pop.mp3' },
  { id: 'bible', name: 'Bible Questions', emoji: '📖', bg: '/media/bible/cover.jpg', voiceover: '/audio/bible.mp3' },
  { id: 'gaming', name: 'Gaming', emoji: '🎮', bg: '/media/gaming/cover.jpg', voiceover: '/audio/gaming.mp3' },
  { id: 'ph', name: 'Filipino Life', emoji: '🇵🇭', bg: '/media/ph/cover.jpg', voiceover: '/audio/ph.mp3' },
  { id: 'mix', name: 'Youth Night Mix', emoji: '🔥', bg: '/media/mix/cover.jpg', voiceover: '/audio/mix.mp3' },
];

const SET = 'Set your answer';
// [type, questionText, answerText] — index 0..9 = question 1..10
const RAW = {
  pop: [
    ['text', "Who is known as the 'Queen of Pop'?", 'Madonna'],
    ['truefalse', "Taylor Swift's Eras Tour became the highest-grossing tour of all time.", 'True'],
    ['photo', 'Name the superhero in this silhouette.', SET],
    ['text', "Which Disney film features 'Let It Go'?", 'Frozen'],
    ['video', 'Name the movie this clip is from.', SET],
    ['text', "Which series has a place called 'the Upside Down'?", 'Stranger Things'],
    ['truefalse', 'BTS is from Japan.', 'False — South Korea'],
    ['text', "Who sings 'Shape of You'?", 'Ed Sheeran'],
    ['photo', 'Name the brand logo shown.', SET],
    ['text', "Which group sings 'Dynamite'?", 'BTS'],
  ],
  bible: [
    ['text', 'What is the first book of the Bible?', 'Genesis'],
    ['truefalse', 'David defeated Goliath with a sword.', 'False — a sling and a stone'],
    ['text', 'How many disciples did Jesus choose?', '12'],
    ['photo', 'Which Bible story does this picture show?', SET],
    ['text', 'Who built the ark?', 'Noah'],
    ['truefalse', "The shortest verse in the Bible is 'Jesus wept.'", 'True'],
    ['video', 'Which parable is acted out in this clip?', SET],
    ['text', 'Who was swallowed by a great fish?', 'Jonah'],
    ['text', 'On which mountain did Moses receive the Ten Commandments?', 'Mount Sinai'],
    ['text', 'Who betrayed Jesus for thirty pieces of silver?', 'Judas Iscariot'],
  ],
  gaming: [
    ['text', 'Which plumber rescues Princess Peach?', 'Mario'],
    ['truefalse', 'Minecraft was created by Mojang.', 'True'],
    ['photo', 'Name this game character.', SET],
    ['text', 'Which console is the best-selling of all time?', 'PlayStation 2'],
    ['text', 'In Among Us, what are the bad players called?', 'Impostors'],
    ['video', 'Guess the game from this gameplay clip.', SET],
    ['truefalse', 'Pikachu is a Water-type Pokémon.', 'False — Electric'],
    ['text', 'What color is Sonic the Hedgehog?', 'Blue'],
    ['text', 'Which game has the Battle Bus?', 'Fortnite'],
    ['text', 'Mobile Legends belongs to which genre (3 letters + 1)?', 'MOBA'],
  ],
  ph: [
    ['text', 'What is the national fruit of the Philippines?', 'Mango'],
    ['truefalse', 'Jollibee started as an ice cream parlor.', 'True'],
    ['photo', 'Which Philippine landmark is this?', SET],
    ['text', 'What are the Christmas dawn masses called?', 'Simbang Gabi'],
    ['text', 'About how many islands does the Philippines have?', '7,641'],
    ['video', 'Name the jingle or commercial.', SET],
    ['truefalse', "'Kuya' is used to address an older sister.", 'False — older brother'],
    ['text', 'Who is the national hero of the Philippines?', 'José Rizal'],
    ['text', 'Which province is famous for the Chocolate Hills?', 'Bohol'],
    ['text', 'Which dish is meat stewed in vinegar and soy sauce?', 'Adobo'],
  ],
  mix: [
    ['text', "Finish it: 'Faith, hope, and ___'", 'Love'],
    ['truefalse', 'Our theme tonight is Level Up!', 'True'],
    ['photo', 'Who is this youth leader?', SET],
    ['text', 'Which fruit of the Spirit comes first in Galatians 5:22?', 'Love'],
    ['text', 'How many books are in the Bible?', '66'],
    ['video', 'Throwback clip: which youth event is this?', SET],
    ['truefalse', 'Mercury is the planet closest to the sun.', 'True'],
    ['text', 'What is 12 × 12?', '144'],
    ['text', "Joshua 1:9 — 'Be strong and ___'", 'Courageous'],
    ['text', 'What is the capital of the Philippines?', 'Manila'],
  ],
};

export const buildQuestions = () =>
  CATEGORIES.flatMap((c) =>
    RAW[c.id].map(([type, questionText, answerText], i) => ({
      id: `${c.id}-${i + 1}`,
      categoryId: c.id,
      points: (i + 1) * 100,
      type,
      questionText,
      answerText,
      mediaPlaceholder:
        type === 'photo' ? `/media/${c.id}/${i + 1}.jpg` : type === 'video' ? `/media/${c.id}/${i + 1}.mp4` : null,
      isAnswered: false,
    }))
  );
