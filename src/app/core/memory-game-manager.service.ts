import { Injectable } from '@angular/core';
import { GAME_METADATA } from './game-metadata.const'
import { UserDataService } from './user-data.service';



@Injectable({
  providedIn: 'root'
})
export class MemoryGameManagerService {

  private _currentLevel;
  private _userMaxLevel;
  private _lives;
  
  
  constructor(private userDataService: UserDataService) {

    this._lives = this.userDataService.getLives();
    this._currentLevel = this.userDataService.getCurrentLevel();
    this._userMaxLevel = this.userDataService.getUserMaxLevel();
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

  public changeLive(lives: number){
    return  this._lives += lives;
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
}
