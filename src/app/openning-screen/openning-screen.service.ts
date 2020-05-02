import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OpenningScreenService {


  get display$(){
    return this._display.asObservable();
  }


  private _display: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(true);

  constructor(private rout:ActivatedRoute) { 
    console.log('queryParams', this.rout.snapshot.queryParams);

    this.rout.queryParamMap.subscribe( params => {
      console.log('params',params);
      if(params.get('debug')){
        this._display.next(false);
      }
    })
  }

  public display(){
    this._display.next(true);
  }

  public hide(){
    this._display.next(false);
  }
}
