export interface ILevelMetadata {
    level: number;
    cards: number;
    time: number;
    score: number;
    width: string;
    height: string;
    data?: any;
  };
  
  export const GAME_METADATA: Array<ILevelMetadata> = [
    {
    level: 1,
    cards: 4,
    time: 4 * 2,
    score: 4 * 2,
    width: '50%',
    height: '50%',
  },
  {
    level: 2,
    cards: 6,
    time: 6 * 2,
    score: 6 * 2,
    width: '50%',
    height: '33%'
  },
  {
    level: 3,
    cards: 8,
    time: 8 * 2,
    score: 8 * 2,
    width: '50%',
    height: '25%'
  },
  {
    level: 4,
    cards: 10,
    time: 10 * 2,
    score: 10 * 2,
    width: '50%',
    height: '20%'
  },
  {
    level: 5,
    cards: 12,
    time: 12 * 2,
    score: 12 * 2,
    width: '25%',
    height: '33%'
  },
  {
    level: 6,
    cards: 14,
    time: 14 * 2,
    score: 14 * 2,
    width: '25%',
    height: '25%'
  },
  {
    level: 7,
    cards: 16,
    time: 16 * 2,
    score: 16 * 2,
    width: '25%',
    height: '25%'
  },
  {
    level: 8,
    cards: 18,
    time: 18 * 2,
    score: 18 * 2,
    width: '25%',
    height: '20%'
  },
  {
    level: 9,
    cards: 20,
    time: 20 * 2,
    score: 20 * 2,
    width: '25%',
    height: '20%'
  }]
