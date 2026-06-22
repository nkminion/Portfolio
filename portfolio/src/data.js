export const Config = {
  HexRadius: 5,
  VirtualHeight: 4000,
  ColorBG: '#101010',
  ColorStroke: '#101010',
  FillSpeed: 0.05,
  DrainSpeed: 0.02,
  MaxBranch: 3,
  DecayRate: 0.5
};

export const State = {
  Dormant: 0,
  Filling: 1,
  Active: 2,
  Drainign: 3
};

export const DesktopIntroMain = "Hey, I'm Nishant.\nCurrently majoring in computer science."
export const DesktopIntroScroll = "I like figuring out how things work. My projects span across multiple domains, from writing a custom compiler to building a vision transformer with attention residuals."
export const MobileIntro = "Hey, I'm Nishant.\nCS Undergrad.\nI like working on multiple domains, from bare-metal architecture to building a custom vision transformer."

export const ProjectData = [
  {
  id: '01',
	title: "NODUS",
	description: "A P2P decentralised mesh network texting app made with Flutter.",
	link: "https://github.com/nkminion/Nodus",
  tags: ['Flutter', 'Dart', 'SQLite', 'P2P', 'Mesh Networking']
  },
  {
  id: '02',
	title: "x86-64CNN",
	description: "A Convolutional Neural Network made from scratch with x86-64 Assembly.",
	link: "https://github.com/nkminion/x86-64CNN",
  tags: ['x86-64 Assembly', 'Machine Learning']
  },
  {
  id: '03',
	title: "FREAKQUENCY",
	description: "An esoteric language that uses tones of different frequencies to denote different instructions. Created a custom compiler with no external libraries",
	link: "https://github.com/nkminion/Freakquency",
  tags: ['C', 'Compiler Design', 'Frequency Analysis', 'Esoteric Programming Language']
  },
  {
  id: '04',
	title: "CHESSNET",
	description: "A chess engine that uses traditional Minimax search algorithms with modern neural network evaluation. Engineered a GPU batch-processing pipeline to optimize high-throughput move analysis.",
	link: "https://github.com/nkminion/ChessBots",
  tags: ['Python', 'Minimax', 'Quiescence Search', 'Neural Networks', 'GPU Processing']
  }
];

export const EducationData = [
  {
    id: '01',
    title: 'NATIONAL INSTITUTE OF TECHNOLOGY, ANDHRA PRADESH',
    description: 'Pursuing B.Tech in Computer Science and Engineering',
    grades: ['CGPA: 8.92']
  },
  {
    id: '02',
    title: 'SRI CHAITANYA TECHNO SCHOOL',
    description: 'Grade 12 (PCMC)',
    grades: ['CBSE Senior Secondary School Certificate Examination: 96%', 'JEE Mains: 98.78%ile (Rank: 19421)']
  },
  {
    id: '03',
    title: 'CMR NATIONAL PUBLIC SCHOOL',
    description: 'Grade 10',
    grades: ['CBSE Secondary School Certificate Examination: 91%']
  }
]; 