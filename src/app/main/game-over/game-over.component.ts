import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMainTopScreenComponent } from '../main-top-level.interface';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss']
})
export class GameOverComponent implements IMainTopScreenComponent  {



  @Input()
  public displayContinue: boolean;

  @Output()
  public output = new EventEmitter();

  constructor() {  
    this.displayContinue =  true;   
  }



  public retry() {
    this.output.emit({action:'RETRY'});
  }
  public continue() {
    this.output.emit({action:'CONTINUE'});
  }
  public restart() {
    this.output.emit({action:'RESTART'});
  }
  public home() {
    this.output.emit({action:'HOME'});
  }
}
