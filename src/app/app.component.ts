import { Component, ViewChildren, QueryList, AfterViewInit , OnDestroy, OnInit, Renderer2, ViewChild, ElementRef, ViewContainerRef, ComponentFactoryResolver, Injector, Type} from '@angular/core';
import { MemoryGameManagerService, GAME} from './core/memory-game-manager.service';
import { ILevelMetadata} from './core/game-metadata.const'
import { MemoryDataService } from './core/memory-data.service';
import { ICardClicked, CardComponent, ICardComponent } from './memory/card/card/card.component';
import { SoundService } from './core/windows/sound.service';
import { VibrateService } from './core/windows/vibrate.service';
import { FullScreenService } from './core/windows/full-screen.service';
import { iOS } from './core/windows/utils';
import { Observable, Subscription } from 'rxjs';
import { LevelFailedComponent } from './main/level-failed/level-failed.component';
import { OpenningScreenService } from './openning-screen/openning-screen.service';
import { GameOverComponent } from './main/game-over/game-over.component';
import { GameCompleteComponent } from './main/game-complete/game-complete.component';
import { IMainTopScreenComponent } from './main/main-top-level.interface';
import { CountDownComponent } from './main/count-down/count-down.component';
import { MenuService } from './menu/menu.service';

enum GAME_STATE {
  INIT,
  RUN,  
  COMPLETE,
  FAILED,
  CONTINUE,
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
  
  @ViewChild('mainTopScreen', {read: ViewContainerRef, static:true})
  mainTopScreen: ViewContainerRef;
 

  private _firstCardClicked: ICardClicked;
  private _totalPairs: number;
  private _levelMetadata: ILevelMetadata;
  private _gameState: GAME_STATE;
  private _intervalHandler: any;  
  private _gameChangedSubscription: Subscription;
  private _mainTopScreenSubscription: Subscription;
  private _levelSubscrption: Subscription;
  private _menuActionSubscription:Subscription;
  private _isPause: boolean;

    
  constructor(private memoryGameManagerService: MemoryGameManagerService, 
              private memoryDataService: MemoryDataService,
              private soundService: SoundService,
              private vibrateService: VibrateService,
              private fullscreenService: FullScreenService,              
              private cfr: ComponentFactoryResolver,
              private injector:Injector, 
              private openningScreenService: OpenningScreenService, 
              private menuService: MenuService) {}      


  ngOnInit(): void {        
    this.init();
    this.isIOS = iOS();

    
    this._gameChangedSubscription =this.memoryGameManagerService.gameChanged$.subscribe( (game:GAME) => {
      this.init();
    });

  
    this._levelSubscrption = this.memoryGameManagerService.levelChanged$.subscribe( level =>{
      this.initLevel();      
    });

    this._menuActionSubscription = this.menuService.action$.subscribe( (command) => {
      

      switch(command){
        case 'HOME':
          this.removeMainTopScreen();
          setTimeout( ()=> {
            this.openningScreenService.display();
          }, 750);    
          break;

        case 'RESTART':
          this.removeMainTopScreen();
          this.onReset();
          break;

        case 'CLOSE':
          if(this._isPause && 
              !( (this._gameState === GAME_STATE.COMPLETE) ||
              (this._gameState === GAME_STATE.FAILED_COMPLETE) || 
              (this._gameState === GAME_STATE.FAILED)
              )){
                this.mainInterval();
          }
          
          this._isPause = false;
          break;
      }
      
    })
  }

  ngOnDestroy(): void {
    this.fullscreenService.exitFullscreen();
    this._levelSubscrption.unsubscribe();
    this._gameChangedSubscription.unsubscribe();
    this._menuActionSubscription.unsubscribe();
  }

  public get level(){
    return this.memoryGameManagerService.getCurrentLevel();
  }

  public get totalScore() {
    return this.memoryGameManagerService.getTotalScore()
  }


  public isDiscoverCardOnInit(){
    return (this.memoryGameManagerService.getGame() === GAME.REVERSE)
  }

  public onNextLevel() {    
    this.setLevel(true);
  }

  public onPrevLevel() {
    this.setLevel(false);
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

  public isMainDisabled() {

  }


  

  public onMenu(){    
    this._isPause = true;
    this.clearMainInterval();       
    this.menuService.open();


    //this.openningScreenService.display();  
  }

  // reduce lifes
  public onCardClicked(cardClicked:ICardClicked){
    
    if( this._gameState === GAME_STATE.INIT){
      this.onRun();
    }

    this.soundService.beepCard(cardClicked.data.id);

    // -----------------------------------------
    // First pair Click
    // -----------------------------------------
    if(!this._firstCardClicked) {
      this._firstCardClicked = cardClicked;
      return;
    }

    // -----------------------------------------
    // Second pair click
    // -----------------------------------------
    // -----------------------------------------
    //        Same cards
    // -----------------------------------------
    if(this._firstCardClicked.data.id === cardClicked.data.id) {
      ++this._totalPairs;
      this._cardComponents.forEach( cardComponent => {
        if(cardComponent.data.id === cardClicked.data.id){
          cardComponent.pair();
        }
      });
      this._firstCardClicked = null;        
            
      // Complete level      
      if(this.isComplete()){
        
        // Stop timer
        this.clearMainInterval();
        // Game Complete state

        // If it was part of "continue state", then end here (no next level)
        // TODO:: title ("Succeed, but failed")
        if((this._gameState === GAME_STATE.CONTINUE) || (this.lives === 0) ){
          let comp = (this.lives === 0)? GameOverComponent : LevelFailedComponent;
          this.displayMainTopComponent(comp, false);
          return;
        }
        
        // Complete on time
        this._gameState = GAME_STATE.COMPLETE;        
        this.vibrateService.complete();
        this.soundService.complete();
        // Store data
        this.memoryGameManagerService.completeLevel(this.isFailedStatus(), 0, this.current);            

        // Finish the game
        if(this.level === this.memoryGameManagerService.getEndLevel()){
          this.displayMainTopComponent(GameCompleteComponent, null);
          return;
        }

        // Change to next level
        if(this.lives > 0 ) {
          setTimeout( () => {
            this.setLevel(true); // TODO:: check if game finished
          },1000);          
        }

       
      }
    } 

    // -----------------------------------------
    // Diffrent cards
    // -----------------------------------------
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
          this.clearMainInterval();
          this.changeLives(-1);   
          let comp = (this.lives === 0)? GameOverComponent: LevelFailedComponent;
          this.displayMainTopComponent(comp, false);
        }
        
          
      }, 250);
    }  
  }


  // --------------------------------------------------------
  // Run Button (The Timer)
  // --------------------------------------------------------
  public onRun(){
    
    // Refresh
    if( this._gameState !== GAME_STATE.INIT  ){
      this.setLevel();
      return;
    }
    this._gameState = GAME_STATE.RUN;
    this.mainInterval();
  }


  private mainInterval() {
/*    if(this._intervalHandler){
      debugger;      
    }
*/
    this.clearMainInterval();

    this._intervalHandler = setInterval(() => {
      // Score
      if (this.current > 0) {
        --this.current;
      }
      // ----------------------------------------------
      // Time out
      // ----------------------------------------------
      if (this.current === 0) {

        // End interval
        this.clearMainInterval();
        
        this._gameState = GAME_STATE.FAILED;
        this.soundService.failed();

        // Reduce life only        
        this.changeLives(-1);
        
        // Life End: - Game Over, alow contine        
        let isRegularGame = this.memoryGameManagerService.getGame() === GAME.REGULAR;
        let comp = (this.lives === 0) ?GameOverComponent: LevelFailedComponent;
        this.displayMainTopComponent(comp, isRegularGame);
      }
    }, 1000);
  }

  public onReset(){
    this.memoryGameManagerService.reset();
    this.init();
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
    this.setLevel();        

  }


  //next:  true-next level, 
  //       false-prev level,
  //       undefine refresh current level
  private setLevel(next?: boolean){

    if(next ===  true){
      this.memoryGameManagerService.nextLevel();
    } else if( next === false) {
      this.memoryGameManagerService.prevLevel();
    }    
    this.initLevel();
  }


  private initLevel(){

    this.removeMainTopScreen();
    this._firstCardClicked = null;
    this._levelMetadata = this.memoryGameManagerService.getLevelMetadata();
    this._levelMetadata.data  =  this.memoryDataService.getRandomPairs(this._levelMetadata.cards/2);
    this._totalPairs = 0;
    this._gameState = GAME_STATE.INIT;
    this.current = this._levelMetadata.score;
    this._isPause = false;
    this.clearMainInterval();
   
    if(this.memoryGameManagerService.getGame() === GAME.REVERSE){      
        this.displayMainTopComponent(CountDownComponent, this._levelMetadata.showTimer);  
    }
  }


  private changeLives(deltaLives: number) {
    // Don't change life if this is not the max level
    if(this.level !== this.memoryGameManagerService.getUserMaxLevel()){
      return;
    }

    this.lives += deltaLives;
    if(this.lives < 0 ){
      this.lives = 0;     
    } else {
      this.memoryGameManagerService.changeLive(deltaLives);
    }
  }

  private isFailedStatus(){
    return (this._gameState === GAME_STATE.FAILED) || (this._gameState === GAME_STATE.FAILED_COMPLETE) || (this._gameState === GAME_STATE.CONTINUE) ;
  }

  private isComplete(){
    return (this._totalPairs === (this._levelMetadata.cards/2));
  }

  public isBackgroundDisabled(){
    return !this.memoryGameManagerService.getBackground();
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


  private clearMainInterval(){
    clearInterval(this._intervalHandler);
    this._intervalHandler = null;
  }

  
 
  private displayMainTopComponent<T>(comp:Type<T>, data:any){
    let componentFactory = this.cfr.resolveComponentFactory(comp);
    let component = componentFactory.create(this.injector)  ;
    let componentInstace = <IMainTopScreenComponent><unknown>(component.instance);
    componentInstace.data = data;
    this._mainTopScreenSubscription = componentInstace.output.subscribe( action => {
      console.log(action);
     
      this.removeMainTopScreen();

      switch(action.action){
        case 'RETRY':
          this.onRun();
        break;      
      case 'CONTINUE':
        this._gameState = GAME_STATE.CONTINUE;
        break;
      case 'RESTART':
          this.onReset();
        break;
       case 'HOME':
        this.openningScreenService.display();
         break;
        case 'REVERSE_RUN':
          this.hideAll();
          this.onRun();

        break;

      }
    });
    this.mainTopScreen.insert(component.hostView);

  }

  private removeMainTopScreen(){
    if(this._mainTopScreenSubscription){
      this._mainTopScreenSubscription.unsubscribe();
      this._mainTopScreenSubscription = null;
    }    
    this.mainTopScreen.remove();
  }

}
