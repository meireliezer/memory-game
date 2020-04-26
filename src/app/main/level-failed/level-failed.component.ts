import { Component, OnInit, Output, EventEmitter, OnDestroy, Input } from '@angular/core';

@Component({
  selector: 'app-level-failed',
  templateUrl: './level-failed.component.html',
  styleUrls: ['./level-failed.component.scss']
})
export class LevelFailedComponent {



  
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
