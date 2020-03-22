import { Component, ViewChildren, QueryList, AfterViewInit , OnDestroy} from '@angular/core';
import { MemoryGameManagerService} from './core/memory-game-manager.service';
import { ILevelMetadata} from './core/game-metadata.const'
import { MemoryDataService } from './core/memory-data.service';
import { ICardClicked, CardComponent } from './memory/card/card/card.component';
import { SoundService } from './core/windows/sound.service';
import { VibrateService } from './core/windows/vibrate.service';
import { FullScreenService } from './core/windows/full-screen.service';



enum GAME_STATE {
  INIT,
  RUN,
  COMPLETE,
  FAILED,
  FAILED_COMPLETE
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  public timer: number;
  public current: number;
  public lives: number;

  @ViewChildren(CardComponent)
  _cardComponents: QueryList<CardComponent>;
  

  private _firstCardClicked: ICardClicked;
  private _totalPairs: number;
  private _levelMetadata: ILevelMetadata;
  private _gameState: GAME_STATE;
  private _intervalHandler: any;

  constructor(private memoryGameManagerService: MemoryGameManagerService, 
              private memoryDataService: MemoryDataService,
              private soundService: SoundService,
              private vibrateService: VibrateService,
              private fullscreenService: FullScreenService) {
    
                this.init();

           
                
  }
  ngOnDestroy(): void {
    this.fullscreenService.exitFullscreen();
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

  public get totalScore() {
    return this.memoryGameManagerService.getTotalScore()
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

  public currentClass(){
    
    let currentClass = '';

    switch(this._gameState){
      case GAME_STATE.COMPLETE:
          currentClass = 'complete';
          break;
      case GAME_STATE.FAILED:
        currentClass = 'failed';
        break;
      case GAME_STATE.FAILED_COMPLETE:
        currentClass = 'failed--complete';
        break;
      default:
        if(this.current < 10) {
          currentClass = 'warnning';      
        }
        break;
    }
        
    return  currentClass;
  }

  public getData(){
    return this._levelMetadata.data;
  }
  

  private i = true;

  // reduce lifes
  public onCardClicked(cardClicked:ICardClicked){
    



    if( this._gameState === GAME_STATE.INIT  ){
      this.onRun();
    }

    this.soundService.beepCard(cardClicked.data.id);

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
        this.vibrateService.pairMatch();
        

        // ---------------------------------------------
        // Complete game
        // ---------------------------------------------
        if(this.isComplete()){
          // Stop timer
          clearInterval(this._intervalHandler);
          this._intervalHandler = null;
          // Game Complete state
          this._gameState = (this.current > 0) ?GAME_STATE.COMPLETE : GAME_STATE.FAILED_COMPLETE;
          // Store data
          this.memoryGameManagerService.completeLevel(this.isFailedStatus(), this.timer, this.current);            
          this.vibrateService.complete();
          this.soundService.complete();

        }
      } 
      // Diffrent cards
      else {        
        this.vibrateService.pairMissMatch(); 
        this.soundService.pairMissMatch();
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


  // Run Button
  public onRun(){
    
    // Refresh
    if( this._gameState !== GAME_STATE.INIT  ){
      this.setNewLevel();
      return;
    }
    
    this._gameState = GAME_STATE.RUN;
    this._intervalHandler = setInterval(()=>{
      
      // Timer
      ++this.timer;      

      // Score
      if(this.current > 0 ){
        --this.current;
      } 
      // Failed
      if(this.current === 0){
        if(this.isComplete()){
          this._gameState = GAME_STATE.FAILED_COMPLETE;
        } else {
          // Reduce lives
          if(this._gameState !== GAME_STATE.FAILED){
            this.soundService.failed();
            // Only if it is  user max level            
            if(this.level === this.memoryGameManagerService.getUserMaxLevel()){
              this.changeLives(-1);
            
            }
            
          }
          this._gameState = GAME_STATE.FAILED;
         
          
        }
      }        
    }, 1000);
  }


  public onReset(){
    this.memoryGameManagerService.reset();
    this.init();
  }

  private init(){
    this.lives = this.memoryGameManagerService.getLives();
    this.setNewLevel();        

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

  private changeLives(lives: number) {
    this.lives += lives;
    if(this.lives < 0 ){
      this.lives = 0;
    }
    this.memoryGameManagerService.changeLive(lives);
  }

  private isFailedStatus(){
    return (this._gameState === GAME_STATE.FAILED) || (this._gameState === GAME_STATE.FAILED_COMPLETE);
  }

  private isComplete(){
    return (this._totalPairs === (this._levelMetadata.cards/2));
  }
}
