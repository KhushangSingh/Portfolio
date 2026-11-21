const titles = [
  {
    id: 'spirited-away', title: 'Spirited Away', type: 'Film', year: '2001', genre: 'Fantasy',
    synopsis: 'A young girl takes a job in a bathhouse for spirits while trying to rescue her parents.',
    clues: 'girl spirit world bathhouse parents pigs chihiro ghibli magical supernatural',
    crop: [858, 202, 151, 247]
  },
  {
    id: 'cowboy-bebop', title: 'Cowboy Bebop', type: 'Series', year: '1998', genre: 'Space western',
    synopsis: 'A small crew chases bounties across the solar system, accompanied by a jazz score.',
    clues: 'jazz space bounty hunters crew spaceship cowboy western music solar system spike',
    crop: [1048, 205, 148, 239]
  },
  {
    id: 'ranking-of-kings', title: 'Ranking of Kings', type: 'Series', year: '2021', genre: 'Adventure',
    synopsis: 'A young prince sets out to become a king, with help from an unlikely shadow companion.',
    clues: 'small prince kings kingdom deaf shadow friend fairy tale bojji adventure',
    crop: [313, 230, 134, 241]
  },
  {
    id: 'your-name', title: 'Your Name', type: 'Film', year: '2016', genre: 'Romance',
    synopsis: 'Two teenagers begin swapping bodies and try to find each other across time and distance.',
    clues: 'teenagers swap switching bodies body comet tokyo village romance connection meteor time',
    crop: [675, 212, 143, 244]
  },
  {
    id: 'death-note', title: 'Death Note', type: 'Series', year: '2006', genre: 'Thriller',
    synopsis: 'A student finds a notebook with lethal powers and draws the attention of a brilliant detective.',
    clues: 'notebook detective student names supernatural mystery investigation death light',
    crop: [127, 244, 139, 238]
  },
  {
    id: 'cyberpunk', title: 'Cyberpunk: Edgerunners', type: 'Series', year: '2022', genre: 'Sci-fi',
    synopsis: 'A street kid becomes a mercenary in a city shaped by technology and body modification.',
    clues: 'neon future city mercenary dystopia futuristic cybernetics tech night city space',
    crop: [493, 224, 144, 237]
  }
];

export const demoTitles = Object.fromEntries(titles.map((title) => [title.id, title]));

export const sampleInbox = [
  {
    id: 'spirited-away',
    notes: [
      { friend: 'Mina', message: 'For that weekend you wanted a rainy-day film.' },
      { friend: 'Kai', message: 'The train scene alone is worth watching.' }
    ]
  },
  {
    id: 'cowboy-bebop',
    notes: [{ friend: 'Ren', message: 'Start with the first episode. I think you’ll love the score.' }]
  },
  {
    id: 'ranking-of-kings',
    notes: [{ friend: 'Mina', message: 'Try this if you want something hopeful after a long week.' }]
  }
];

export const initialLibrary = { 'cowboy-bebop': 'watching', 'death-note': 'watched' };

export const libraryStatuses = {
  planned: 'Plan to watch',
  watching: 'Watching',
  watched: 'Watched'
};

export const searchPrompts = ['a girl in a spirit world', 'bounty hunters in space with jazz', 'teenagers swap bodies'];

const stopWords = new Set(['a', 'an', 'the', 'is', 'in', 'at', 'for', 'from', 'of', 'about', 'with', 'and', 'to', 'like', 'anime', 'where', 'who']);

function wordsIn(text) {
  return text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}

export function searchDemoTitles(query) {
  const terms = [...new Set(wordsIn(query).filter((word) => !stopWords.has(word)))];

  return titles.map((title) => {
    const name = new Set(wordsIn(title.title));
    const clues = new Set(wordsIn(`${title.clues} ${title.synopsis}`));
    const score = terms.reduce((total, term) => total + (name.has(term) ? 3 : Number(clues.has(term))), 0);
    return { title, score };
  }).filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)
    .map(({ title }) => title);
}
