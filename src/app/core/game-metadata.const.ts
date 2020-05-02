export interface ILevelMetadata {
    level: number;
    cards: number;
    time: number;
    score: number;
    width: string;
    height: string;
    showTimer: number;
    data?: any;
  };
  
  export const GAME_METADATA: Array<ILevelMetadata> = [
    {
    level: 1,
    cards: 4,
    time: 4 * 2 - 1,
    score: 4 * 2 - 1,
    width: '50%',
    height: '50%',
    showTimer: 6
  },
  {
    level: 2,
    cards: 6,
    time: 6 * 2 - 2,
    score: 6 * 2 - 2,
    width: '50%',
    height: '33%',
    showTimer: 10
  },
  {
    level: 3,
    cards: 8,
    time: 8 * 2 - 3,
    score: 8 * 2 - 3,
    width: '50%',
    height: '25%',
    showTimer: 15
  },
  {
    level: 4,
    cards: 10,
    time: 10 * 2 - 4,
    score: 10 * 2 - 4,
    width: '50%',
    height: '20%',
    showTimer: 25
  },
  {
    level: 5,
    cards: 12,
    time: 12 * 2 - 6,
    score: 12 * 2 - 6,
    width: '25%',
    height: '33%',
    showTimer: 35
  },
  {
    level: 6,
    cards: 14,
    time: 14 * 2 - 6,
    score: 14 * 2 - 6,
    width: '25%',
    height: '25%',
    showTimer: 45
  },
  {
    level: 7,
    cards: 16,
    time: 16 * 2 - 7,
    score: 16 * 2 - 7,
    width: '25%',
    height: '25%',
    showTimer: 45
  },
  {
    level: 8,
    cards: 18,
    time: 18 * 2 -8,
    score: 18 * 2 - 8,
    width: '25%',
    height: '20%',
    showTimer: 60
  },
  {
    level: 9,
    cards: 20,
    time: 20 * 2 - 9,
    score: 20 * 2 - 9,
    width: '25%',
    height: '20%',
    showTimer: 60
  },
  {
    level: 10,
    cards: 22,
    time: 22 * 2 - 10,
    score: 22 * 2 - 10,
    width: '20%',
    height: '20%',
    showTimer: 60
  },
  {
    level: 11,
    cards: 24,
    time: 24 * 2 - 11,
    score: 24 * 2 - 11,
    width: '20%',
    height: '20%',
    showTimer: 60
  }]
