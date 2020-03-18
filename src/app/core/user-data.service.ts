import { Injectable } from '@angular/core';
import { ILevelMetadata} from './game-metadata.const'


interface IUserData {
  currentLevel: number;
  userMaxLevel: number;
  lives: number;
  levels: Array<ILevelData>;
}

interface ILevelData {
  level: number;
  time: number;
  score: number;
}



const INIT_USER_MAX_LEVLE = 1
const INIT_CURRENT_MAX_LEVEL = 1
const INIT_LIVES = 3;

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private _userData:IUserData;

  constructor() {    
    this.loadData();
  }


  public getUserData(){
    return {...this};
  }

  public getLives(){
    return this._userData.lives;
  }

  public setLives(lives:number){
    this._userData.lives += lives;
    this.saveData();
  }

  public getCurrentLevel(){
    return this._userData.currentLevel;
  }

  public setCurrentLevel(level: number){
    this._userData.currentLevel = level;
    this.saveData();
  }

  public getUserMaxLevel() {
    return this._userData.userMaxLevel;
  }

  public setUserMaxLevel(level: number){
    this._userData.userMaxLevel = level;
    this.saveData();
  }

  public getLevelHistory(){
    return this._userData.levels;
  }
  public setLevelData(level: number, score:number, time: number){
    let levelData:ILevelData =  this._userData.levels.find( levelData => {
      return levelData.level === level;
    });
    
    if(levelData) {
        if(levelData.score < score){
          levelData.score = score;
        }
        if(levelData.time > time){
          levelData.time = time;
        }
    } else {
      levelData = {level, time, score};
      this._userData.levels.push(levelData);
    }

    this.saveData();
  }

  



  private loadData() {
    let userData = localStorage.getItem('userData');
    if(userData){
      let userDataObj = JSON.parse(userData);
      this._userData = (<IUserData>userDataObj);
    } else {
      this._userData = {
        levels: [],
        userMaxLevel: INIT_USER_MAX_LEVLE,
        currentLevel: INIT_CURRENT_MAX_LEVEL,
        lives: INIT_LIVES
      }
    }
  }

  private saveData(){
    let data = JSON.stringify(this._userData);
    localStorage.setItem('userData', data);
  }

}
