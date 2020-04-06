import { Component, OnInit, Input, Renderer2, ElementRef, Output, EventEmitter } from '@angular/core';
import { IPair } from 'src/app/core/memory-data.service';

export interface ICardClicked {
  cardIndex: number;
  data: IPair;
}


@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  symbol = '&#9728';

  @Input()
  public data: IPair;

  @Input()
  public cardIndex;

  @Input()
  public disableBackground;
  
  private _isClick = false;
  private _backgroundColor = '';
  private _isPair = false;


  @Output()
  cardClicked = new EventEmitter();


  constructor(private elmRef: ElementRef,
              private render: Renderer2) { }

  ngOnInit() {
    this._backgroundColor = this.elmRef.nativeElement;
  }

  public isActive(){
    return this._isClick;
  }

  // "You touch you go"
  public onClick(){
    if(this._isClick == false){
      this._isClick = !this._isClick;    
      this.cardClicked.emit({cardIndex: this.cardIndex, data:this.data});  
    }
  }

  // API
  public pair(){
    this._isPair = true;
  }

  public reset() {
    this._isClick = false;
  }



}
