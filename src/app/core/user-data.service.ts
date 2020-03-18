import { Injectable } from '@angular/core';
import { ILevelMetadata } from './memory-game-manager.service';


interface IUserData {
  currentLevel: number;
  useMaxLevel: number;
  lives: number;
  levels: Array<ILevelMetadata>;
}

interface ILevelHistory {
  level: number;
  time: number;
  score: number;
}


@Injectable({
  providedIn: 'root'
})
export class UserDataService {


  constructor() {    
  }

  private setLevelData(){

  }




}
