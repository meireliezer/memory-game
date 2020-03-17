import { Component } from '@angular/core';
import { MemoryGameManagerService, ILevelMetadata } from './core/memory-game-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  

  public levelMetadata: ILevelMetadata;


  constructor(private memoryGameManagerService: MemoryGameManagerService){
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
  }

  public get level(){
    return this.memoryGameManagerService.getCurrentLevel();
  }

  public onNextLevel() {    
    this.memoryGameManagerService.nextLevel();
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
  }

  public onPrevLevel() {
    this.memoryGameManagerService.prevLevel();
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
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
    let data = [];
    for(let i = 0; i< this.levelMetadata.cards; ++i){
      data.push(i+1);
    }
    return data;
  }
  

}
