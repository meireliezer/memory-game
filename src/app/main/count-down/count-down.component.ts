import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { IMainTopScreenComponent } from '../main-top-level.interface';

@Component({
  selector: 'app-count-down',
  templateUrl: './count-down.component.html',
  styleUrls: ['./count-down.component.scss']
})
export class CountDownComponent implements IMainTopScreenComponent, OnInit {



  @Input()
  public data: any;

  @Output()
  public output = new EventEmitter();

  private _intervaleHandler;

  constructor() {}
  
  ngOnInit(): void {
    this._intervaleHandler  = setInterval( ()=> {
        --this.data;
        if(this.data === 0){          
          this.onRun();
        }
    }, 1000);
  }


  public onRun() {
    clearInterval(this._intervaleHandler);
    this.output.emit({action:'REVERSE_RUN'});
  }
}
