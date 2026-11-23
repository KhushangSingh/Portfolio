/**
 * Curated 12-Book Library for Khushang Singh's Studio Shelf
 * 
 * Spans four pillars:
 * 1. DESIGN: Grid Systems, Refactoring UI, The Design of Everyday Things
 * 2. SYSTEMS: Designing Data-Intensive Applications, SICP, Clean Code
 * 3. MANGA: Akira, Berserk, The Ghost in the Shell
 * 4. SCI-FI & PHILOSOPHY: Neuromancer, Dune, Meditations
 * 
 * Adheres strictly to portfolio writing rules:
 * - Zero commas before "and" or "or".
 * - Zero em dashes.
 */

export const CATEGORIES = [
  { id: 'all', label: 'ALL / すべて', firstIndex: 0 },
  { id: 'design', label: 'DESIGN', firstIndex: 0 },
  { id: 'systems', label: 'SYSTEMS', firstIndex: 3 },
  { id: 'manga', label: 'MANGA', firstIndex: 6 },
  { id: 'scifi', label: 'SCI-FI & PHILOSOPHY', firstIndex: 9 },
];

export const BOOKS = [
  // ==========================================
  // 1. DESIGN
  // ==========================================
  {
    id: 'grid-systems',
    categoryGroup: 'design',
    category: 'Swiss Typography',
    title: 'Grid Systems in Graphic Design',
    subtitleRomaji: 'RASTER SYSTEME',
    subtitleKanji: 'ラスターシステム',
    author: 'Josef Müller-Brockmann',
    year: '1981',
    publisher: 'Verlag Niggli',
    pages: 176,
    synopsis: 'The definitive manifesto on modular typographic organization. Demonstrates how disciplined mathematical grids grant total creative freedom across editorial, print and digital layouts.',
    quote: 'The grid system is an aid, not a guarantee. It permits a number of possible uses and each designer can look for a solution appropriate to his personal style.',
    takeaway: 'The Swiss typographic foundation that governs modern modular layout, golden ratios and responsive web typography. Taught me to design from underlying structural geometry rather than superficial decoration.',
    palette: {
      spineBg: '#E8502A',
      accent: '#FF7A50',
      text: '#FFFFFF',
      darkSpineBg: '#C23D19',
      coverBg: '#F3EFEA',
      coverText: '#181818',
      darkCoverBg: '#1C1513',
      darkCoverText: '#F4F2EE',
    }
  },
  {
    id: 'refactoring-ui',
    categoryGroup: 'design',
    category: 'Interface Craft',
    title: 'Refactoring UI',
    subtitleRomaji: 'VISUAL CRAFT',
    subtitleKanji: '視覚的階層',
    author: 'Adam Wathan & Steve Schoger',
    year: '2018',
    publisher: 'Tailwind Labs',
    pages: 250,
    synopsis: 'A tactical handbook on crafting production user interfaces from the perspective of full-stack product engineering. Eliminates aesthetic guesswork with actionable design heuristics.',
    quote: 'Start with too much white space, then remove it until it looks right.',
    takeaway: 'The definitive practical guide to visual hierarchy. Don\'t design with decoration; design with depth, contrast and spacing rhythm.',
    palette: {
      spineBg: '#0F172A',
      accent: '#38BDF8',
      text: '#F8FAFC',
      darkSpineBg: '#090D16',
      coverBg: '#0F172A',
      coverText: '#F8FAFC',
      darkCoverBg: '#080C14',
      darkCoverText: '#E2E8F0',
    }
  },
  {
    id: 'everyday-things',
    categoryGroup: 'design',
    category: 'Cognitive UX',
    title: 'The Design of Everyday Things',
    subtitleRomaji: 'COGNITIVE AFFORDANCE',
    subtitleKanji: '日常の認知設計',
    author: 'Don Norman',
    year: '1988',
    publisher: 'Basic Books',
    pages: 368,
    synopsis: 'The seminal exploration of human psychology, cognitive feedback loops and physical usability. Unpacks why intuitive affordances matter far more than visual ornamentation.',
    quote: 'Good design is actually a lot harder to notice than poor design, in part because good designs fit our needs so well.',
    takeaway: 'Affordances and signifiers over cleverness. If an interactive element needs a paragraph of instruction to use, the interface failed.',
    palette: {
      spineBg: '#831843',
      accent: '#F472B6',
      text: '#FDF2F8',
      darkSpineBg: '#5B0E2E',
      coverBg: '#FAF5EF',
      coverText: '#261219',
      darkCoverBg: '#1A0D13',
      darkCoverText: '#FCE7F3',
    }
  },

  // ==========================================
  // 2. SYSTEMS & ENGINEERING
  // ==========================================
  {
    id: 'ddia',
    categoryGroup: 'systems',
    category: 'System Architecture',
    title: 'Designing Data-Intensive Applications',
    subtitleRomaji: 'DISTRIBUTED DATA',
    subtitleKanji: '分散データ処理',
    author: 'Martin Kleppmann',
    year: '2017',
    publisher: 'O\'Reilly Media',
    pages: 616,
    synopsis: 'The fundamental engineering treatise on distributed systems, replication, partitioning and consistency guarantees behind modern global data platforms.',
    quote: 'Reliability is continuing to work correctly even when things go wrong.',
    takeaway: 'The bible of distributed systems. Taught me why consistency guarantees and event-driven architectures are the bedrock of high-scale apps.',
    palette: {
      spineBg: '#1E293B',
      accent: '#0284C7',
      text: '#F8FAFC',
      darkSpineBg: '#111827',
      coverBg: '#F8FAFC',
      coverText: '#0F172A',
      darkCoverBg: '#0B0F19',
      darkCoverText: '#F1F5F9',
    }
  },
  {
    id: 'sicp',
    categoryGroup: 'systems',
    category: 'Computer Science',
    title: 'Structure & Interpretation of Computer Programs',
    subtitleRomaji: 'SICP ABSTRACTION',
    subtitleKanji: '計算機プログラムの構造',
    author: 'Harold Abelson & Gerald Jay Sussman',
    year: '1985',
    publisher: 'MIT Press',
    pages: 657,
    synopsis: 'The foundational MIT computer science text using Scheme to dissect computational abstractions, recursion, interpreters and metalinguistic synthesis.',
    quote: 'Programs must be written for people to read and only incidentally for machines to execute.',
    takeaway: 'Metalinguistic abstraction, closures and the recursive purity of functional computation. Foundational mental models for any engineer.',
    palette: {
      spineBg: '#2E1065',
      accent: '#A855F7',
      text: '#FAF5FF',
      darkSpineBg: '#1E0B3D',
      coverBg: '#2E1065',
      coverText: '#FAF5FF',
      darkCoverBg: '#150729',
      darkCoverText: '#F3E8FF',
    }
  },
  {
    id: 'clean-code',
    categoryGroup: 'systems',
    category: 'Software Engineering',
    title: 'Clean Code: Agile Craftsmanship',
    subtitleRomaji: 'CODE CRAFTSMANSHIP',
    subtitleKanji: '職人技のコード',
    author: 'Robert C. Martin',
    year: '2008',
    publisher: 'Prentice Hall',
    pages: 464,
    synopsis: 'A disciplined philosophy of software craftsmanship focusing on single responsibility, expressive naming, meaningful test boundaries and relentless refactoring.',
    quote: 'Clean code always looks like it was written by someone who cares.',
    takeaway: 'The Boy Scout Rule: Always check code in cleaner than you checked it out. High cohesion, single responsibility and meaningful naming.',
    palette: {
      spineBg: '#064E3B',
      accent: '#34D399',
      text: '#ECFDF5',
      darkSpineBg: '#032C22',
      coverBg: '#064E3B',
      coverText: '#ECFDF5',
      darkCoverBg: '#04221A',
      darkCoverText: '#D1FAE5',
    }
  },

  // ==========================================
  // 3. MANGA & GRAPHIC NOVELS
  // ==========================================
  {
    id: 'akira',
    categoryGroup: 'manga',
    category: 'Neo-Tokyo Cyberpunk',
    title: 'Akira: Master Edition Vol. 1',
    subtitleRomaji: 'NEO TOKYO 2019',
    subtitleKanji: 'アキラ 大友克洋',
    author: 'Katsuhiro Otomo',
    year: '1982',
    publisher: 'Kodansha',
    pages: 360,
    synopsis: 'The crowning masterpiece of sequential art and cinematic pacing. Captures the explosive geopolitical and psychic collapse of post-nuclear Neo-Tokyo.',
    quote: 'The city was destroyed, but out of the rubble we built our own future.',
    takeaway: 'Unrivaled urban isometric scale, cinematic pan speeds and red pill motorcycle kinetics that redefined modern animation.',
    palette: {
      spineBg: '#991B1B',
      accent: '#EF4444',
      text: '#FEF2F2',
      darkSpineBg: '#5F1212',
      coverBg: '#0A0A0A',
      coverText: '#FEF2F2',
      darkCoverBg: '#050505',
      darkCoverText: '#FEE2E2',
    }
  },
  {
    id: 'berserk',
    categoryGroup: 'manga',
    category: 'Dark Fantasy Manga',
    title: 'Berserk: Deluxe Edition Vol. 1',
    subtitleRomaji: 'DARK FANTASY',
    subtitleKanji: 'ベルセルク 三浦建太郎',
    author: 'Kentaro Miura',
    year: '1989',
    publisher: 'Dark Horse Manga',
    pages: 700,
    synopsis: 'An epic monumental dark fantasy chronicling fate, trauma and unyielding human will against insurmountable cosmic forces through breathtaking ink illustrations.',
    quote: 'You have the strongest armor, because you are the one who knows pain.',
    takeaway: 'Mastery of ink cross-hatching, anatomy and unwavering human resilience. Miura\'s page layouts are a masterclass in dynamic motion.',
    palette: {
      spineBg: '#0F0F12',
      accent: '#DC2626',
      text: '#F5F5F5',
      darkSpineBg: '#060608',
      coverBg: '#0F0F12',
      coverText: '#F5F5F5',
      darkCoverBg: '#050506',
      darkCoverText: '#FFFFFF',
    }
  },
  {
    id: 'gits',
    categoryGroup: 'manga',
    category: 'Cybernetic Philosophy',
    title: 'The Ghost in the Shell',
    subtitleRomaji: 'CYBERNETIC SOUL',
    subtitleKanji: '攻殻機動隊 士郎正宗',
    author: 'Masamune Shirow',
    year: '1989',
    publisher: 'Kodansha Young Magazine',
    pages: 368,
    synopsis: 'A philosophical investigation of sentience, digital consciousness and mind-machine interfaces in a hyper-connected network society.',
    quote: 'Man is an individual only because of his intangible memory.',
    takeaway: 'Exploration of mind-machine interfaces, augmented memory and what makes code feel sentient. Pure inspiration for spatial UIs.',
    palette: {
      spineBg: '#1E1B4B',
      accent: '#A78BFA',
      text: '#EEF2FF',
      darkSpineBg: '#11102E',
      coverBg: '#12102E',
      coverText: '#EEF2FF',
      darkCoverBg: '#0A081D',
      darkCoverText: '#EDE9FE',
    }
  },

  // ==========================================
  // 4. SCI-FI NOVELS & PHILOSOPHY
  // ==========================================
  {
    id: 'neuromancer',
    categoryGroup: 'scifi',
    category: 'Cyberpunk Sci-Fi',
    title: 'Neuromancer',
    subtitleRomaji: 'SPRAWL TRILOGY',
    subtitleKanji: 'ニューロマンサー',
    author: 'William Gibson',
    year: '1984',
    publisher: 'Ace Science Fiction',
    pages: 271,
    synopsis: 'The groundbreaking cyberpunk novel that coined cyberspace and envisioned consensual neural simulation, decker cowboys and sentient AI construct architectures.',
    quote: 'The sky above the port was the color of television, tuned to a dead channel.',
    takeaway: 'Coined cyberspace and the matrix. The dark obsidian, neon-lit aesthetics of night mode trace back to Gibson\'s Chiba City.',
    palette: {
      spineBg: '#042F2E',
      accent: '#10B981',
      text: '#ECFDF5',
      darkSpineBg: '#021F1E',
      coverBg: '#042F2E',
      coverText: '#ECFDF5',
      darkCoverBg: '#011A19',
      darkCoverText: '#D1FAE5',
    }
  },
  {
    id: 'dune',
    categoryGroup: 'scifi',
    category: 'Ecological Sci-Fi',
    title: 'Dune: The Arrakis Chronicles',
    subtitleRomaji: 'ARRAKIS CHRONICLES',
    subtitleKanji: 'デューン 砂の惑星',
    author: 'Frank Herbert',
    year: '1965',
    publisher: 'Chilton Books',
    pages: 412,
    synopsis: 'A towering literary masterpiece weaving planetary ecology, spice economy, imperial power struggles and prophetic human evolution across the desert sands of Arrakis.',
    quote: 'I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration.',
    takeaway: 'Complex ecology, deep planetary systems and political intrigue. Taught me to treat software architecture as an evolving living ecosystem.',
    palette: {
      spineBg: '#7C2D12',
      accent: '#F59E0B',
      text: '#FFFBEB',
      darkSpineBg: '#4E1B0A',
      coverBg: '#60220D',
      coverText: '#FFFBEB',
      darkCoverBg: '#2E1005',
      darkCoverText: '#FEF3C7',
    }
  },
  {
    id: 'meditations',
    categoryGroup: 'scifi',
    category: 'Stoic Philosophy',
    title: 'Meditations',
    subtitleRomaji: 'STOIC NOTEBOOK',
    subtitleKanji: '自省録 マルクス',
    author: 'Marcus Aurelius',
    year: '180 AD',
    publisher: 'Penguin Classics',
    pages: 256,
    synopsis: 'Private spiritual journals written on campaign by Roman emperor Marcus Aurelius, offering timeless practical wisdom on mental discipline, virtue and inner stillness.',
    quote: 'You have power over your mind, not outside events. Realize this and you will find strength.',
    takeaway: 'Keep code and life simple. Focus ruthlessly on what is within direct control and let external noise dissolve.',
    palette: {
      spineBg: '#382215',
      accent: '#D97706',
      text: '#FEF3C7',
      darkSpineBg: '#21130A',
      coverBg: '#FAF6EF',
      coverText: '#26160C',
      darkCoverBg: '#160E08',
      darkCoverText: '#FDE68A',
    }
  }
];
