import { Injectable } from '@angular/core';

interface IUserData {  
  currentLevel: number;
  userMaxLevel: number;
  lives: number;
  levels: Array<ILevelData>;
  vibrate: boolean;
  sound: boolean;
  background: boolean;
}

interface ILevelData {
  level: number;
  time: number;
  score: number;
}



const PRODUCTION_VERSION = 1;

const INIT_USER_MAX_LEVLE = 1
const INIT_CURRENT_MAX_LEVEL = 1
const INIT_LIVES = 2;

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private _userData:IUserData;
  private _game: any;
  private _userDataKey: string;

  constructor() {    
    this._userDataKey = `userData_${this._game}`;
    this.loadData();
  }

  public setGame(game: any){
    this._game = game;
    this._userDataKey = `userData_${this._game}`
    this.loadData();
  }

  public getUserData(){
    return {...this};
  }

  public getLives(){
    return this._userData.lives;
  }

  public setLives(lives:number){
    this._userData.lives = lives;
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

  public getVibrate(): boolean {
    return this._userData.vibrate;
  }

  public setVibriate(flag: boolean) {
    this._userData.vibrate = flag;
    this.saveData();
  }

  public getSound(): boolean {
    return this._userData.sound;
  }

  public setSound(flag: boolean) {
    this._userData.sound = flag;
    this.saveData();
  }

  public getBackground(): boolean {
    return this._userData.background;
  }

  public setBackground(flag: boolean) {
    this._userData.background = flag;
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

  
  public reset() {
    localStorage.removeItem('userData');
    this._userData = {
      levels: [],
      userMaxLevel: INIT_USER_MAX_LEVLE,
      currentLevel: INIT_CURRENT_MAX_LEVEL,
      lives: INIT_LIVES,
      vibrate: true,
      sound: true,
      background: true
    }
  }

  private loadData() {
    let userData = localStorage.getItem(this._userDataKey);
    if(userData){
      let userDataObj = JSON.parse(userData);
      this._userData = (<IUserData>userDataObj);
      this._userData.vibrate = (this._userData.vibrate === undefined)? true: this._userData.vibrate;
      this._userData.sound  = (this._userData.sound === undefined)? true: this._userData.sound;
      this._userData.background = (this._userData.background === undefined)? true: this._userData.background;
    } else {
      this.reset();
    }
  }

  private saveData(){
    let data = JSON.stringify(this._userData);
    localStorage.setItem(this._userDataKey, data);
  }

}
