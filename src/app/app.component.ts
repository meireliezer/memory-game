import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { MemoryGameManagerService, ILevelMetadata } from './core/memory-game-manager.service';
import { MemoryDataService } from './core/memory-data.service';
import { ICardClicked, CardComponent } from './memory/card/card/card.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  

  public levelMetadata: ILevelMetadata;


  @ViewChildren(CardComponent)
  _cardComponents: QueryList<CardComponent>;


  private _firstCardClicked: ICardClicked;
  private _totalPairs: number;

  constructor(private memoryGameManagerService: MemoryGameManagerService, 
              private memoryDataService: MemoryDataService){
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
    this.levelMetadata.data  =  this.memoryDataService.getRandomPairs(this.levelMetadata.cards/2);
    this._totalPairs = 0;
  }


  ngAfterViewInit(): void {
    this._cardComponents.forEach(card =>{
      console.log(card);
    })    
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
    this._totalPairs = 0;
  }

  public onPrevLevel() {
    this.memoryGameManagerService.prevLevel();
    this.levelMetadata = this.memoryGameManagerService.getLevelMetadata();
    this.levelMetadata.data  =  this.memoryDataService.getRandomPairs(this.levelMetadata.cards/2);
    this._totalPairs = 0;
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
  

  public onCardClicked(cardClicked:ICardClicked){
    
    // First pair Click
    if(!this._firstCardClicked) {
      this._firstCardClicked = cardClicked;
    }
    // Second pair click
    else {

      // Same cards
      if(this._firstCardClicked.data.id === cardClicked.data.id) {
        ++this._totalPairs;
        this._cardComponents.forEach( cardComponent => {
          if(cardComponent.data.id === cardClicked.data.id){
            cardComponent.pair();
          }
        });
        this._firstCardClicked = null;

        console.log('pairs');
      } 
      // Diffrent cards
      else {
        console.log('worng');   
        
        setTimeout(()=>{
          this._cardComponents.forEach( cardComponent => {
            if((cardComponent.data.id === cardClicked.data.id) || (cardComponent.data.id === this._firstCardClicked.data.id) ){
              cardComponent.reset();
            }
          });
          this._firstCardClicked = null;     
        }, 250);

      }
  
    } 


    console.log(cardClicked);
  }


}
