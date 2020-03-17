import { Component, OnInit, Input, Renderer2, ElementRef } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {



  

  @Input()
  public data;
  
  private _isClick = false;
  private _backgroundColor = '';


  constructor(private elmRef: ElementRef,
              private render: Renderer2) { }

  ngOnInit() {
    this._backgroundColor = this.elmRef.nativeElement;
  }

  public isActive(){
    return this._isClick;
  }


  public onClick(){
    this._isClick = !this._isClick;    
  }

}
