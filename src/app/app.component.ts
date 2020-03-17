import { Component } from '@angular/core';
import { MemoryGameManagerService, ILevelMetadata } from './core/memory-game-manager.service';
import { MemoryDataService } from './core/memory-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  

  public levelMetadata: ILevelMetadata;


  constructor(private memoryGameManagerService: MemoryGameManagerService, 
              private memoryDataService: MemoryDataService){
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
    this.levelMetadata.data  =  this.memoryDataService.getRandomPairs(this.levelMetadata.cards/2);
  }

  public get level(){
    return this.memoryGameManagerService.getCurrentLevel();
  }
  public get userMaxLevel(){
    return this.memoryGameManagerService.getUserMaxLevel();
  }

  public onNextLevel() {    
    this.memoryGameManagerService.nextLevel();
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
    this.levelMetadata.data  =  this.memoryDataService.getRandomPairs(this.levelMetadata.cards/2);
  }

  public onPrevLevel() {
    this.memoryGameManagerService.prevLevel();
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
    this.levelMetadata.data  =  this.memoryDataService.getRandomPairs(this.levelMetadata.cards/2);
  }

  public getLevelMetadata(){
    return this.levelMetadata;
  }

  public getCardLevelDimension()  {
    let style = {
                  width: this.levelMetadata.width, 
                  height: this.levelMetadata.height
                };
    return style;
  }

  public getData(){
    return this.levelMetadata.data;
  }
  

}
