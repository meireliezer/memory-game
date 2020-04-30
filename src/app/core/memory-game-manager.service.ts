import { Injectable, Output } from '@angular/core';
import { GAME_METADATA } from './game-metadata.const'
import { UserDataService, ILevelData } from './windows/user-data.service';
import { Subject, Observable, Subscription } from 'rxjs';

export enum GAME {
  REGULAR,
  REVERSE,
}


@Injectable({
  providedIn: 'root'
})
export class MemoryGameManagerService {
  
  private _currentLevel;
  private _userMaxLevel;
  private _lives;
  private _background;
  private _game:GAME;
  private _gameChanged = new Subject<GAME>();
  private _levelChanged = new Subject();
    
  constructor(private userDataService: UserDataService) {
    this._game = GAME.REGULAR;
    this.initFromUserData(); 
  }


  public setGame(game:GAME){
    this._game = game;
    this.userDataService.setGame(game);
    this.initFromUserData(); 
    this._gameChanged.next(this._game);
  }

  public getGame(): GAME {
    return this._game;
  }

  public get gameChanged$(): Observable<GAME>{
    return this._gameChanged.asObservable();
  }

  public get levelChanged$(): Observable<any> {
    return this._levelChanged.asObservable();
  }

  public getCurrentLevel(){
    return this._currentLevel;
  }
  public getUserMaxLevel(){
    return this._userMaxLevel;
  }

  public getEndLevel() {
    GAME_METADATA.length;
  }

  public getLives() {
    return  this._lives;
  }

  public getBackground(): boolean{
    return this._background;
  }
  public toggleBackground() {
    this._background = !this._background;
    this.userDataService.setBackground(this._background);
  }


  public getTotalScore(){
    let total = 0;
    total = this.userDataService.getLevelHistory()
    .map( item => item.score)
    .reduce( (accumulator, currentValue) => accumulator + currentValue, 0);
    return total;
  }

  public changeLive(lives: number){
    this._lives += lives;
    this.userDataService.setLives(this._lives);
  }


  public getLevelMetadata() {
    return GAME_METADATA[this._currentLevel -1];
  }


  public getHistory() : ILevelData[] {
    return this.userDataService.getLevelHistory();
  }

  public getLevelHistory(level: number){
    return this.userDataService.getLevelHistory().find(item => item.level === level);
  }

  public getGameMetadat(){
    return GAME_METADATA;
  }

  public nextLevel(){

    if(this._currentLevel === GAME_METADATA.length){
      return this._currentLevel;
    }

    this.setLevel(this._currentLevel + 1);
    if(this._userMaxLevel < this._currentLevel){
      this._userMaxLevel = this._currentLevel;
      this.userDataService.setUserMaxLevel(this._userMaxLevel);
    }
    return this._currentLevel;
  }

  public prevLevel(){
    if(this._currentLevel > 1){
      this.setLevel(this._currentLevel - 1);
    }    
    return this._currentLevel;
  }

  public setLevel(level: number){
    this._currentLevel = level;
    this.userDataService.setCurrentLevel(this._currentLevel);
    this._levelChanged.next(this._currentLevel);
  }

  public completeLevel(failed:boolean, time: number, score: number){

    // Save data;
    this.userDataService.setLevelData(this._currentLevel, score, time);

    // Should enable next level
    if(!failed && (this._currentLevel === this._userMaxLevel) && (this._lives > 0) ){
      ++this._userMaxLevel;
      // Save data;
      this.userDataService.setUserMaxLevel(this._userMaxLevel);
    }
  }


  public reset() {
    this.userDataService.reset();   
    this.initFromUserData(); 
  }

  private initFromUserData(){
    this._lives = this.userDataService.getLives();
    this._currentLevel = this.userDataService.getCurrentLevel();
    this._userMaxLevel = this.userDataService.getUserMaxLevel();
    this._background =  this.userDataService.getBackground();
  }
}
