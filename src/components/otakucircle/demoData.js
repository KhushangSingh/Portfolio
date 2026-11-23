const titles = [
  {
    id: 'spirited-away', title: 'Spirited Away', type: 'Film', year: '2001', genre: 'Fantasy',
    synopsis: 'A young girl takes a job in a bathhouse for spirits while trying to rescue her parents.',
    clues: 'girl spirit world bathhouse train parents pigs chihiro ghibli magical supernatural'
  },
  {
    id: 'cowboy-bebop', title: 'Cowboy Bebop', type: 'Series', year: '1998', genre: 'Space western',
    synopsis: 'A small crew chases bounties across the solar system, accompanied by a jazz score.',
    clues: 'jazz space bounty hunters crew spaceship cowboy western music solar system spike'
  },
  {
    id: 'ranking-of-kings', title: 'Ranking of Kings', type: 'Series', year: '2021', genre: 'Adventure',
    synopsis: 'A young prince sets out to become a king, with help from an unlikely shadow companion.',
    clues: 'small prince kings kingdom deaf shadow friend fairy tale bojji adventure'
  },
  {
    id: 'your-name', title: 'Your Name', type: 'Film', year: '2016', genre: 'Romance',
    synopsis: 'Two teenagers begin swapping bodies and try to find each other across time and distance.',
    clues: 'teenagers swap switching bodies body comet tokyo village romance connection meteor time'
  },
  {
    id: 'death-note', title: 'Death Note', type: 'Series', year: '2006', genre: 'Thriller',
    synopsis: 'A student finds a notebook with lethal powers and draws the attention of a brilliant detective.',
    clues: 'notebook detective student names supernatural mystery investigation death light'
  },
  {
    id: 'cyberpunk', title: 'Cyberpunk: Edgerunners', type: 'Series', year: '2022', genre: 'Sci-fi',
    synopsis: 'A street kid becomes a mercenary in a city shaped by technology and body modification.',
    clues: 'neon future city mercenary dystopia futuristic cybernetics tech night city space'
  },
  {
    id: 'naruto', title: 'Naruto', type: 'Series', year: '2002', genre: 'Adventure',
    synopsis: 'An aspiring ninja dreams of leading his village and earning its respect.',
    clues: 'boy ninja village hokage training hidden leaf'
  },
  {
    id: 'one-punch', title: 'One-Punch Man', type: 'Series', year: '2015', genre: 'Action',
    synopsis: 'A hero who wins every battle in one punch searches for a challenge.',
    clues: 'saitama superhero bald combat one punch monsters'
  },
  {
    id: 'code-geass', title: 'Code Geass', type: 'Series', year: '2006', genre: 'Sci-fi',
    synopsis: 'A student gains the power to command others and leads a rebellion.',
    clues: 'mecha rebellion student britannia powers command lelouch'
  },
  { id: 'attack-on-titan', title: 'Attack on Titan', type: 'Series', year: '2013', genre: 'Action', synopsis: 'Humanity shelters inside walls from giant creatures.', clues: 'giants titans walls soldiers' },
  { id: 'jujutsu-kaisen', title: 'Jujutsu Kaisen', type: 'Series', year: '2020', genre: 'Supernatural', synopsis: 'A student joins a school of sorcerers after encountering a cursed object.', clues: 'curse sorcery school supernatural' },
  { id: 'demon-slayer', title: 'Demon Slayer', type: 'Series', year: '2019', genre: 'Action', synopsis: 'A swordsman seeks a cure for his sister after she becomes a demon.', clues: 'sword sister demon cure' },
  { id: 'hunter-x-hunter', title: 'Hunter × Hunter', type: 'Series', year: '2011', genre: 'Adventure', synopsis: 'A boy takes the Hunter Exam and journeys to find his father.', clues: 'exam hunter father journey' },
  {
    id: 'witch-hat', title: 'Witch Hat Atelier', type: 'Manga', year: '2016', genre: 'Fantasy',
    synopsis: 'An apprentice discovers how magic is drawn and joins a workshop of young witches.',
    clues: 'witch apprentice workshop magic drawings hat'
  },
  {
    id: 'yotsuba', title: 'Yotsuba&!', type: 'Manga', year: '2003', genre: 'Slice of life',
    synopsis: 'A curious child explores her new neighborhood and makes small discoveries every day.',
    clues: 'child summer neighborhood curious everyday comedy'
  },
  { id: 'delicious-in-dungeon', title: 'Delicious in Dungeon', type: 'Manga', year: '2014', genre: 'Fantasy',
    synopsis: 'Adventurers use dungeon monsters as ingredients while searching for a missing party member.',
    clues: 'cooking food dungeon monsters dragon dungeon meshi'
  },
  { id: 'blue-period', title: 'Blue Period', type: 'Manga', year: '2017', genre: 'Drama',
    synopsis: 'A student discovers painting and prepares for a competitive art school entrance exam.',
    clues: 'drawing painter art creativity school portfolio entrance exam yatora'
  },
  { id: 'a-sign-of-affection', title: 'A Sign of Affection', type: 'Manga', year: '2019', genre: 'Romance',
    synopsis: 'A deaf university student and a well-travelled classmate grow closer as they learn to communicate.',
    clues: 'sign language communication deaf university romance yuki'
  },
  { id: 'vinland-saga-manga', title: 'Vinland Saga', type: 'Manga', year: '2005', genre: 'Historical',
    synopsis: 'A young Viking sets out for revenge and eventually questions the life he has been fighting for.',
    clues: 'viking norse revenge thorfinn england history warrior'
  },
  { id: 'apothecary-diaries', title: 'The Apothecary Diaries', type: 'Manga', year: '2017', genre: 'Mystery',
    synopsis: 'A palace servant trained in medicine investigates mysterious illnesses in the imperial court.',
    clues: 'poison medicine detective palace court maomao apothecary'
  },
  { id: 'sweat-and-soap', title: 'Sweat and Soap', type: 'Manga', year: '2018', genre: 'Romance',
    synopsis: 'A romance grows between an office worker and a fragrance developer at a toiletries company.',
    clues: 'workplace office scent perfume adults romance'
  }
];

const titleStats = {
  'spirited-away': [8.8, 2.1], 'cowboy-bebop': [8.8, 10.8], 'ranking-of-kings': [8.5, 8.8],
  'your-name': [8.8, 1.8], 'death-note': [8.6, 14.8], cyberpunk: [8.6, 4.2],
  'attack-on-titan': [8.56], 'jujutsu-kaisen': [8.53], 'demon-slayer': [8.45], 'hunter-x-hunter': [9.03],
  naruto: [8.0], 'one-punch': [8.7], 'code-geass': [8.7], 'witch-hat': [8.7], yotsuba: [8.8],
  'delicious-in-dungeon': [8.8], 'blue-period': [8.5], 'a-sign-of-affection': [8.4],
  'vinland-saga-manga': [9], 'apothecary-diaries': [8.8], 'sweat-and-soap': [8.2]
};

export const demoTitles = Object.fromEntries(titles.map((title) => {
  const [rating, hours] = titleStats[title.id];
  return [title.id, { ...title, rating, hours, poster: '/images/otakucircle/posters/' + title.id + '.webp', media: title.type === 'Manga' ? 'Manga' : 'Anime' }];
}));

export const demoFriends = [
  { name: 'Mina', taste: 86, genre: 'Fantasy and adventure' },
  { name: 'Kai', taste: 78, genre: 'Films and science fiction' },
  { name: 'Ren', taste: 74, genre: 'Music and character-driven stories' }
];

export const movieNightClue = 'A bathhouse and a train';

export const movieNightRecommendation = {
  id: 'spirited-away',
  notes: [
    { friend: 'Mina', message: 'Save it for a quiet evening.' },
    { friend: 'Ren', message: 'The train scene is worth watching twice.' }
  ]
};

export const sampleInbox = [
  movieNightRecommendation,
  {
    id: 'cowboy-bebop',
    notes: [{ friend: 'Ren', message: 'Start with the first episode. I think you’ll love the score.' }]
  },
  {
    id: 'ranking-of-kings',
    notes: [{ friend: 'Mina', message: 'Try this if you want something hopeful after a long week.' }]
  },
  {
    id: 'your-name',
    notes: [{ friend: 'Kai', message: 'Go in knowing as little as you can.' }, { friend: 'Ren', message: 'A good pick for a movie night.' }]
  },
  {
    id: 'cyberpunk',
    notes: [{ friend: 'Ren', message: 'It gets intense quickly. The city is worth seeing too.' }]
  },
  {
    id: 'witch-hat',
    notes: [{ friend: 'Mina', message: 'Read it slowly. The way the magic is drawn is the best part.' }]
  }
];

export const initialLibrary = {
  'your-name': 'planned', 'witch-hat': 'planned', 'cowboy-bebop': 'watching', cyberpunk: 'watching',
  'death-note': 'watched', 'ranking-of-kings': 'watched'
};

export const initialDates = {
  'death-note': { started: '2025-03-03', ended: '2025-03-22' },
  'ranking-of-kings': { started: '2025-04-09', ended: '2025-04-26' },
  'cowboy-bebop': { started: '2025-05-10' }
};

export const libraryStatuses = {
  planned: 'Watchlist',
  watching: 'Watching',
  watched: 'Watched'
};

export const searchPrompts = {
  Anime: ['A boy who wants to become a ninja', 'A girl in a spirit world', 'Bounty hunters in space with jazz', 'Teenagers swap bodies'],
  Manga: ['An apprentice learns to draw magic', 'A child exploring a new neighborhood', 'Adventurers cooking monsters in a dungeon', 'A palace mystery solved with herbal medicine']
};

const stopWords = new Set(['a', 'an', 'the', 'is', 'in', 'at', 'for', 'from', 'of', 'about', 'with', 'and', 'to', 'like', 'anime', 'where', 'who']);

function wordsIn(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

export function searchDemoTitles(query, media) {
  const terms = [...new Set(wordsIn(query).filter((word) => !stopWords.has(word)))];

  return Object.values(demoTitles).filter((title) => !media || title.media === media).map((title) => {
    const name = new Set(wordsIn(title.title));
    const clues = new Set(wordsIn(`${title.clues} ${title.synopsis}`));
    const score = terms.reduce((total, term) => total + (name.has(term) ? 3 : Number(clues.has(term))), 0);
    return { title, score };
  }).filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)
    .map(({ title }) => title);
}
