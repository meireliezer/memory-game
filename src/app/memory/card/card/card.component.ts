import { Component, OnInit, Input, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { IPair } from 'src/app/core/memory-data.service';

export interface ICardClicked {
  cardIndex: number;
  data: IPair;
}

export interface ICardComponent{
    pair():void;    
    reset():void;
    discover():void;
    hide():void;
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements ICardComponent, OnInit {  
  
  
  
  
  @Input()
  public data: IPair;

  @Input()
  public cardIndex;

  @Input()
  public disableBackground;

  @Input('discover')
  public  _discover: boolean;

  @Output()
  cardClicked = new EventEmitter();

  private _isClick = false;
  


  constructor(private elmRef: ElementRef) {
      this._discover = false;
   }
 

  ngOnInit() {
    
  }

  public isActive(){
    return this._isClick;
  }

  public isDiscover(){
    return this._discover;
  }

  public dispaySymbol(){
    if(this.isActive() || this.isDiscover()){
      return this.data.data.symbol;
    }
    return '';
  }

  public displayBackground(){
    if( this.disableBackground === true){
      return '';
    }

    if(this.isActive() || this.isDiscover()) {
      return this.data.data.color;
    }

    return '';
  }

  // "You touch you go"
  public onClick(){
    if(this._isClick == false){
      this._isClick = !this._isClick;    
      this.cardClicked.emit({cardIndex: this.cardIndex, data:this.data});  
    }
  }

  // -----------------------------------------
  // API
  // -----------------------------------------
  public pair(){    
  }

  public reset() {
    this._isClick = false;
  }

  discover(): void {
    this._discover = true;
  }
  hide(): void {
    this._discover = false;
  }

}
