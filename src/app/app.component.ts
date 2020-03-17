import { Component, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { MemoryGameManagerService, ILevelMetadata } from './core/memory-game-manager.service';
import { MemoryDataService } from './core/memory-data.service';
import { ICardClicked, CardComponent } from './memory/card/card/card.component';


enum GAME_STATE {
  INIT,
  RUN,
  END,
}



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{
  
  @ViewChildren(CardComponent)
  _cardComponents: QueryList<CardComponent>;
  
  public timer: number;
  public current: number;



  private _firstCardClicked: ICardClicked;
  private _totalPairs: number;
  private _levelMetadata: ILevelMetadata;
  private _gameState: GAME_STATE;
  private _intervalHandler: any;

  constructor(private memoryGameManagerService: MemoryGameManagerService, 
              private memoryDataService: MemoryDataService){

    this.setNewLevel();    
    
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

  public get gameState(){
    return this._gameState;
  }

  public onNextLevel() {    
    this.setNewLevel(true);
  }

  public onPrevLevel() {
    this.setNewLevel(false);
  }

  public getLevelMetadata(){
    return this._levelMetadata;
  }

  public getCardLevelDimension()  {
    let style = {
                  width: this._levelMetadata.width, 
                  height: this._levelMetadata.height
                };
    return style;
  }

  public getData(){
    return this._levelMetadata.data;
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
      } 
      // Diffrent cards
      else {        
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
  }


  public onRun(){
    
    // Refresh
    if( this._gameState !== GAME_STATE.INIT  ){
      this.setNewLevel();
      return;
    }
    
    this._gameState = GAME_STATE.RUN;
    this._intervalHandler = setInterval(()=>{
      
      ++this.timer;
      
      if(this.current > 0 ){
        --this.current;
      }
      
      if(this.timer === 0){
        this._gameState = GAME_STATE.END;
      }

      if(this._totalPairs === this._levelMetadata.cards/2){
        clearInterval(this._intervalHandler);
        this._intervalHandler = null;
      }

    }, 1000);
  }


  //next:  true-next level, false, prev level, undefine refresh current level
  private setNewLevel(next?: boolean){

    if(next ===  true){
      this.memoryGameManagerService.nextLevel();
    } else if( next === false) {
      this.memoryGameManagerService.prevLevel();
    }    
    this._levelMetadata = this.memoryGameManagerService.getLevelMetadata();
    this._levelMetadata.data  =  this.memoryDataService.getRandomPairs(this._levelMetadata.cards/2);
    this._totalPairs = 0;
    this._gameState = GAME_STATE.INIT;
    this.timer = 0;
    this.current = this._levelMetadata.score;
    if(this._intervalHandler){
      clearInterval(this._intervalHandler);
      this._intervalHandler = null;
    }
  }
}
