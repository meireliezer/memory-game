import { Component, ViewChildren, QueryList, AfterViewInit , OnDestroy, OnInit, Renderer2, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver, Injector} from '@angular/core';
import { MemoryGameManagerService, GAME} from './core/memory-game-manager.service';
import { ILevelMetadata} from './core/game-metadata.const'
import { MemoryDataService } from './core/memory-data.service';
import { ICardClicked, CardComponent, ICardComponent } from './memory/card/card/card.component';
import { SoundService } from './core/windows/sound.service';
import { VibrateService } from './core/windows/vibrate.service';
import { FullScreenService } from './core/windows/full-screen.service';
import { iOS } from './core/windows/utils';
import { Observable } from 'rxjs';
import { LevelFailedComponent } from './main/level-failed/level-failed.component';
import { OpenningScreenService } from './openning-screen/openning-screen.service';
import { GameOverComponent } from './main/game-over/game-over.component';
import { IMainTopScreenComponent } from './main/main-top-level.interface';

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
  private _showTimer: any;
  private _showTimerIntervalHandler:any;
  private _gameChanged$: Observable<GAME>;
  private _disaplyShowTimerHandlerTimeout;



  constructor(private memoryGameManagerService: MemoryGameManagerService, 
              private memoryDataService: MemoryDataService,
              private soundService: SoundService,
              private vibrateService: VibrateService,
              private fullscreenService: FullScreenService,
              private renderer2 : Renderer2,
              private cfr: ComponentFactoryResolver,
              private injector:Injector, 
              private openningScreenService: OpenningScreenService) {
    
          
           
                
  }
  ngOnInit(): void {        
    this.init();
    this.isIOS = iOS();

    this._gameChanged$ = this.memoryGameManagerService.gameChanged$;
    this._gameChanged$.subscribe( (game:GAME) => {
      this.init();
    });



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

  


  public home(){
    clearInterval(this._intervalHandler);
    this._intervalHandler = null;
    clearTimeout(this._disaplyShowTimerHandlerTimeout);
    this._disaplyShowTimerHandlerTimeout = null;    
    this.clearShowTimer();         
    this.openningScreenService.display();  
  }

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
            
          } else {
            this.displayMainTopScreen();
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
          if(this.memoryGameManagerService.getGame() == GAME.REVERSE){
            this.discoverAll();
            this._showTimer = 'Try Again';
            this.renderer2.addClass(this._screen.nativeElement, 'screen--display');
            clearInterval(this._intervalHandler);
            this.changeLives(-1);            
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

    this.clearShowTimer();
    
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
            this.displayMainTopScreen();
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


   
      if(this.memoryGameManagerService.getGame() === GAME.REVERSE){
        this._disaplyShowTimerHandlerTimeout = setTimeout(()=> {
          clearInterval(this._showTimerIntervalHandler);
          this._showTimer = this._levelMetadata.showTimer;      
          
          this.renderer2.addClass(this._screen.nativeElement, 'screen--display');
          this.discoverAll();
          
          this._showTimerIntervalHandler = setInterval( () => {
            --this._showTimer;
            if(this._showTimer === 0){
              this.clearShowTimer();
            }
          },1000)  
      },0);
  
    }

  
  }

  private clearShowTimer(){
    clearInterval(this._showTimerIntervalHandler);
    this._showTimerIntervalHandler = null;
    this.renderer2.removeClass(this._screen.nativeElement, 'screen--display');
    this.hideAll();
  }

  private changeLives(deltaLives: number) {
    this.lives += deltaLives;
    if(this.lives < 0 ){
      this.lives = 0;     
    } else {
      this.memoryGameManagerService.changeLive(deltaLives);
    }

    if(this.lives === 0){
      this.displayMainTopScreenGameOver();
    }
    
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


  @ViewChild('mainTopScreen', {read: ViewContainerRef, static:true})
  mainTopScreen: ViewContainerRef;
  private displayMainTopScreenLevelFailed(){     
    let levelFailedComponentFactory = this.cfr.resolveComponentFactory(LevelFailedComponent);
    let levelFailedComponent = levelFailedComponentFactory.create(this.injector);
    levelFailedComponent.instance.displayContinue = !(this._gameState === GAME_STATE.COMPLETE || this._gameState === GAME_STATE.FAILED_COMPLETE)
    let subscription = levelFailedComponent.instance.output.subscribe( action => {
      console.log(action);
      subscription.unsubscribe();
      this.mainTopScreen.remove();
      switch(action.action){
        case 'RETRY':
          this.onRun();
        break;      
      case 'CONTINUE':
        break;
      case 'RESTART':
          this.onReset();
        break;
       case 'HOME':
         this.home();
         break;
      }
    });
    this.mainTopScreen.insert(levelFailedComponent.hostView);
  }

  private displayMainTopScreenGameOver(){     
    let levelFailedComponentFactory = this.cfr.resolveComponentFactory(GameOverComponent);
    let levelFailedComponent = levelFailedComponentFactory.create(this.injector)
    levelFailedComponent.instance.displayContinue = !(this._gameState === GAME_STATE.COMPLETE || this._gameState === GAME_STATE.FAILED_COMPLETE)
    let subscription = levelFailedComponent.instance.output.subscribe( action => {
      console.log(action);
      subscription.unsubscribe();
      this.mainTopScreen.remove();
      switch(action.action){
        case 'RETRY':
          this.onRun();
        break;      
      case 'CONTINUE':
        break;
      case 'RESTART':
          this.onReset();
        break;
       case 'HOME':
         this.home();
         break;
      }
    });
    this.mainTopScreen.insert(levelFailedComponent.hostView);
  }


    private displayMainTopScreen(){
      if(this.lives === 0){
        this.displayMainTopScreenGameOver();
        return;
      } 

      if( (this._gameState === GAME_STATE.FAILED_COMPLETE) || (this._gameState === GAME_STATE.FAILED) ) {
        this.displayMainTopScreenLevelFailed();
      }
      


    }

}
