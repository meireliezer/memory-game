import { Injectable } from '@angular/core';
import { GAME_METADATA } from './game-metadata.const'
import { UserDataService } from './windows/user-data.service';



@Injectable({
  providedIn: 'root'
})
export class MemoryGameManagerService {

  private _currentLevel;
  private _userMaxLevel;
  private _lives;
  private _background;
  
  
  constructor(private userDataService: UserDataService) {
    this.initFromUserData(); 
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

  public nextLevel(){

    if(this._currentLevel === GAME_METADATA.length){
      return this._currentLevel;
    }

    ++this._currentLevel;
    this.userDataService.setCurrentLevel(this._currentLevel);
    if(this._userMaxLevel < this._currentLevel){
      this._userMaxLevel = this._currentLevel;
      this.userDataService.setUserMaxLevel(this._userMaxLevel);
    }

    return this._currentLevel;
  }

  public prevLevel(){
    if(this._currentLevel > 1){
      --this._currentLevel;
      this.userDataService.setCurrentLevel(this._currentLevel);
    }
    return this._currentLevel;
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
