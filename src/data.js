// Types: 'text' | 'photo' | 'truefalse' | 'video'
// Media files go in /public/media/<categoryId>/<n>.jpg|mp4 (or set `media` to a URL).
export const CATEGORIES = [
  { id: 'grade5', name: 'Kakasa Ka Ba Sa Grade 5?', color: '#dd0000', img: '/public/grade5.webp' },
  { id: 'scroll', name: 'Kaka-scroll Mo Yan!', color: '#512dc3', img: '/public/scroll.webp' },
  { id: 'sino', name: 'Sino Yarn?', color: '#0cb820', img: '/public/sino.webp' },
  { id: 'trot', name: 'Trot o Charot', color: '#0040ff', img: '/public/trot.webp' },
  { id: 'bible', name: 'Bible Questions', color: '#ff8a00', img: '/public/bible.webp' },
];

export const DEFAULT_SECONDS = 20; // default timer per question; override with { seconds: 30 } in a question's options
const TC = ['Trot', 'Charot'];
const TT = (code) => ({ media: `https://vt.tiktok.com/${code}/` });
const SET = 'Ilagay ang sagot';

// [type, questionText, answerText, options?] — index 0..9 = question 1..10
const RAW = {
  grade5: [
    ['truefalse', 'True or False. Ang araw ay isang bituin.', 'TRUE'],
    ['text', 'Anong bansa ang sumakop sa Pilipinas nang 333 years?', 'Spain / Espanya'],
    ['text', 'Ano ang title ng pambansang awit ng Pilipinas?', 'Lupang Hinirang'],
    ['text', 'Kailan ipinagdiriwang ang Araw ng Kalayaan?', 'June 12'],
    ['text', 'Ilang sides meron ang isang hexagon?', '6'],
    ['text', 'Ilang taon ang bumubuo sa isang siglo?', '100'],
    ['text', 'Ano ang sinasagisag ng tatlong bituin sa watawat ng Pilipinas?', 'Luzon, Visayas, Mindanao'],
    ['text', 'Anong tawag sa hayop na kumakain lamang ng halaman?', 'Herbivore'],
    ['text', 'Anong proseso ang ginagawa ng halaman gamit ang sikat ng araw, tubig, at hangin para makagawa ng pagkain?', 'Photosynthesis'],
    ['text', 'Ano ang 20% ng 250?', '50'],
  ],
  scroll: [
    ['video', 'Sa kanta ni Lyca, ano ang meron din naman palang ganda?', 'Buhay a.k.a Mariel', TT('ZSboMQskA')],
    ['text', 'Sa anong larangan sikat si Dwight Ramos?', 'Basketball'],
    ['text', 'Ilan ang miyembro ng Kpop group na Seventeen?', '13 members'],
    ['text', 'Sino ang bida sa teleseryeng Agua Bendita?', 'Xyriel Manabat'],
    ['text', 'Kung ang bumida sa teleseryeng Annaliza ay si Andrea Brillantes, sino naman ang CEO ng Brillant Skin?', 'Glenda Dela Cruz / Ms. Glenda'],
    ['video', 'Sa FlordeLiza, ano ang dapat mahawakan ni Flor para maging mabait na sa kanya si Liza?', 'Magkabilang dulo ng rainbow', TT('ZSgJNbXt4')],
    ['text', "Ilang years na simula unang ma-ere ang noontime tv show na It's Showtime?", '17 years'],
    ['text', 'Sino-sino ang tatlong lola ni Yaya Dub sa Kalyeserye?', 'Lola Nidora, Lola Tidora, Lola Tinidora'],
    ['video', 'Kumpletuhin ang linya ng sikat na meme: "Hi! I\'m (1)____ from Las Vegas (2)______. We\'re hiring new (3)______ (4)_______ to work in Las Vegas (5)______."', "Hi! I'm (1) LYN from Las Vegas (2) MODELS. We're hiring new (3) PROMOTIONAL (4) MODELS to work in Las Vegas (5) USA.", TT('ZSgJNeQmJ')],
    ['text', 'Sa sikat na kanta ng BINI na Karera, ilang beses binanggit ng kanta ang salitang "karera"?', '15 times'],
  ],
  sino: [
    ['video', 'Sino ang original na kumanta ng kantang ito? (audio)', 'Vhong Navarro'],
    ['photo', 'Bonus Question: Sino ito? (zoomed-in picture)', 'Jemuel Ocampo / Kuya Jem'],
    ['text', '"O... my... goodness! Ungkatan ng past! Kapag binalik ang past, magugulo ang present."', 'Toni Gonzaga / Teddy Salazar'],
    ['text', 'ActSong: Hulaan ang kanta! (ilagay dito ang lyrics mula sa sheet mo)', 'Cup of Joe'],
    ['photo', 'Sino ito?', 'Melai Cantiveros'],
    ['text', 'Sinong mga tao ang nasa lumang 500 Peso bill?', 'Corazon Aquino & Ninoy Aquino'],
    ['text', 'Sino ang babae sa septic tank?', 'Eugene Domingo'],
    ['text', 'Sino ang nag-deny kay Jesus nang tatlong beses?', 'Peter'],
    ['text', 'Sino ang Senate President sa kasalukuyan?', 'Win Gatchalian'],
    ['text', 'Sino ang Filipino TikToker na may pinakamaraming followers?', 'Niana Guerrero'],
  ],
  trot: [
    ['truefalse', "Ang 'nonchalant' ay taong hindi nagpapakita ng emosyon, habang ang 'chalant' ay taong expressive.", 'Trot', { choices: TC }],
    ['truefalse', 'Kapag in-unfollow mo ang isang tao sa Instagram, automatic siyang makakatanggap ng notification.', 'Charot', { choices: TC }],
    ['truefalse', 'Kapag nag-delete ka ng message sa Messenger gamit ang "Remove for you," mawawala rin ito sa inbox ng ka-chat mo.', 'Charot', { choices: TC }],
    ['truefalse', 'Kapag naka-off ang "Profile view history" mo sa TikTok, makikita mo pa rin kung sino ang bumisita sa profile mo.', 'Charot', { choices: TC }],
    ['truefalse', 'Ang "www" sa website address ay nangangahulugang "World Wide Web."', 'Trot', { choices: TC }],
    ['truefalse', 'Sa Instagram, makikita ng isang tao kung ilang beses mong pinanood ang kanyang Story.', 'Charot', { choices: TC }],
    ['truefalse', 'Ang "Ctrl + F" ay shortcut para maghanap ng salita o phrase sa maraming computer applications at web browsers.', 'Trot', { choices: TC }],
    ['video', 'Ito ay totoong cabbage.', 'Trot', { choices: TC, note: 'Clip: 0:01 - 0:07' }],
    ['video', 'Ang nag-cover ng kantang ito ay si Jared Lim Almendras, known professionally as... (kumpletuhin mula sa sheet)', 'Charot', { choices: TC }],
    ['video', 'Ito ay totoong sibuyas.', 'Charot', { choices: TC, note: 'Clip: 0:44 - 0:49' }],
  ],
  bible: [
    ['text', 'Ilang araw nasa loob ng tyan ng isda si Noah?', '0'],
    ['truefalse', '"When God closes a door, He opens a window."', 'CAP', { choices: ['Scripture', 'CAP'] }],
    ['text', 'Ano ang ika-anim na utos sa Ten Commandments?', '"Thou shalt not murder" / "Huwag kang papatay"'],
    ['photo', 'Guess the phrase! (sheep puzzle)', 'Lost Sheep'],
    ['text', 'Gibberish: JAR USE SA LAMB', 'Jerusalem'],
    ['text', 'Unshuffle the words: SSOEM', 'Moses'],
    ['truefalse', '"Jesus wept"', 'Scripture — John 11:35', { choices: ['Scripture', 'CAP'] }],
    ['text', 'How many books are there in the Bible?', '66'],
    ['truefalse', 'True or False: David killed Goliath with a sword.', 'FALSE'],
    ['photo', 'Guess the book in the Bible! (emoji puzzle)', 'Isaiah'],
  ],
};

export const buildQuestions = () =>
  CATEGORIES.flatMap((c) =>
    RAW[c.id].map(([type, questionText, answerText, o = {}], i) => ({
      id: `${c.id}-${i + 1}`,
      categoryId: c.id,
      points: (i + 1) * 100,
      type,
      questionText,
      answerText,
      choices: o.choices ?? (type === 'truefalse' ? ['True', 'False'] : null),
      note: o.note ?? null,
      seconds: o.seconds ?? DEFAULT_SECONDS,
      mediaPlaceholder: o.media ?? (type === 'photo' ? `/media/${c.id}/${i + 1}.jpg` : type === 'video' ? `/media/${c.id}/${i + 1}.mp4` : null),
      isAnswered: false,
    }))
  );
