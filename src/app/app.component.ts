import { Component, ViewChildren, QueryList, AfterViewInit , OnDestroy, OnInit, Renderer2, ViewChild, ElementRef} from '@angular/core';
import { MemoryGameManagerService} from './core/memory-game-manager.service';
import { ILevelMetadata} from './core/game-metadata.const'
import { MemoryDataService } from './core/memory-data.service';
import { ICardClicked, CardComponent, ICardComponent } from './memory/card/card/card.component';
import { SoundService } from './core/windows/sound.service';
import { VibrateService } from './core/windows/vibrate.service';
import { FullScreenService } from './core/windows/full-screen.service';
import { iOS } from './core/windows/utils';



enum GAME_STATE {
  INIT,
  RUN,
  COMPLETE,
  FAILED,
  FAILED_COMPLETE
}

enum GAME {
    REGULAR,
    REVERSE,
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public timer: number;
  public current: number;
  public lives: number;
  public isIOS: boolean;

  @ViewChildren(CardComponent)
  _cardComponents: QueryList<CardComponent>;
  
  @ViewChild('screen', {static:true, read:ElementRef})
  _screen: ElementRef;

  private _firstCardClicked: ICardClicked;
  private _totalPairs: number;
  private _levelMetadata: ILevelMetadata;
  private _gameState: GAME_STATE;
  private _intervalHandler: any;
  private _game: GAME;
  private _showTimer: any;
  private _showTimerIntervalHandler:any;



  constructor(private memoryGameManagerService: MemoryGameManagerService, 
              private memoryDataService: MemoryDataService,
              private soundService: SoundService,
              private vibrateService: VibrateService,
              private fullscreenService: FullScreenService,
              private renderer2 : Renderer2) {
    
          
           
                
  }
  ngOnInit(): void {
    this._game = GAME.REVERSE;
    this.init();
    this.isIOS = iOS();
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

  public get showTimer(){
    return this._showTimer;
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
        //this.vibrateService.pairMatch();
        

        // ---------------------------------------------
        // Complete level
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
          if(this._gameState === GAME_STATE.COMPLETE){
            setTimeout( () => {
              this.setNewLevel(true);
            },1000);
            
          }        
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
          if(this._game == GAME.REVERSE){
            this.discoverAll();
            this._showTimer = 'Try Again';
            this.renderer2.addClass(this._screen.nativeElement, 'screen--display');
            clearInterval(this._intervalHandler);
            
          }
          
           
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

  public toggleSound(){
    this.soundService.toggleSound();
  }

  public isSoundDisabled(){
    return !this.soundService.isEnable();
  }

  public toggleVibrate(){
    this.vibrateService.toggleSound();
  }

  public isVibrateDisabled(){
    return !this.vibrateService.isEnable();    
  }

  public onBackgroundToggle() {    
    this.memoryGameManagerService.toggleBackground();
  }

  public isBackgroundDisabled(){
    return !this.memoryGameManagerService.getBackground();
  }


  public getBackgroundColor(): string {
    let gameStateColor = '';

    if(this.current < this._levelMetadata.time * 0.75){
      gameStateColor = 'game-warning';
    }
    if(this.current < this._levelMetadata.time * 0.50){
      gameStateColor = 'game-alert';
    }
    if(this.current === 0){
      gameStateColor = 'game-failed';
    }

    if(this._gameState === GAME_STATE.COMPLETE){
      gameStateColor = '';
    }
    
    // 'game-warning'
    // 'game-alert'
    // 'game-failed'
     return gameStateColor;
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


    setTimeout(()=> {
      if(this._game === GAME.REVERSE){
        clearInterval(this._showTimerIntervalHandler);
        this._showTimer = 10;      
        
        this.renderer2.addClass(this._screen.nativeElement, 'screen--display');
        this.discoverAll();
        
        this._showTimerIntervalHandler = setInterval( () => {
          --this._showTimer;
          if(this._showTimer === 0){
            clearInterval(this._showTimerIntervalHandler);
            this.renderer2.removeClass(this._screen.nativeElement, 'screen--display');
            this.hideAll();
          }
        },1000)
  
      }
  
    },0);

  
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



  private discoverAll(){
    this._cardComponents.forEach(card => {
      card.discover();
    });

  }

  private hideAll() {
    this._cardComponents.forEach(card => {
      card.hide();
    });
  }
}
