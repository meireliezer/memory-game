import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IMainTopScreenComponent } from '../main-top-level.interface';

@Component({
  selector: 'app-game-complete',
  templateUrl: './game-complete.component.html',
  styleUrls: ['./game-complete.component.scss']
})
export class GameCompleteComponent implements IMainTopScreenComponent   {


  @Output()
  public output = new EventEmitter();

  constructor() {  }



  public retry() {
    this.output.emit({action:'RETRY'});
  }
 
  public restart() {
    this.output.emit({action:'RESTART'});
  }
  public home() {
    this.output.emit({action:'HOME'});
  }
}
