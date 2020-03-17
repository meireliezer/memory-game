import { Injectable } from '@angular/core';


export interface ILevelMetadata {
  level: number;
  cards: number;
  width: string;
  height: string;
  data?: any;
}


@Injectable({
  providedIn: 'root'
})
export class MemoryGameManagerService {


  




  private _currentLevel = 1;
  private _maxLevel = 4;
  private _totalScore = 0;
  private _stepScore = 999;

  



  private gameMetaData: Array<ILevelMetadata> = [
    {
    level: 1,
    cards: 4,
    width: '50%',
    height: '50%'
  },
  {
    level: 2,
    cards: 6,
    width: '50%',
    height: '33%'
  },
  {
    level: 3,
    cards: 8,
    width: '50%',
    height: '25%'
  },
  {
    level: 4,
    cards: 10,
    width: '50%',
    height: '20%'
  },
  {
    level: 5,
    cards: 12,
    width: '25%',
    height: '33%'
  },
  {
    level: 6,
    cards: 14,
    width: '25%',
    height: '25%'
  },
  {
    level: 7,
    cards: 16,
    width: '25%',
    height: '25%'
  },
  {
    level: 8,
    cards: 18,
    width: '25%',
    height: '20%'
  },
  {
    level: 9,
    cards: 20,
    width: '25%',
    height: '20%'
  }]

  constructor() {
  }

  public getCurrentLevel(){
    return this._currentLevel;
  }

  public getMaxLevel(){
    return this._maxLevel;
  }

  public getLevelMetadata() {
    return this.gameMetaData[this._currentLevel -1];
  }

  public nextLevel(){
    ++this._currentLevel;
    if(this._maxLevel < this._currentLevel){
      this._maxLevel = this._currentLevel;
    }

    return this._currentLevel;
  }

  public prevLevel(){
    if(this._currentLevel > 1){
      --this._currentLevel;
    }


    return this._currentLevel;
  }

}
