import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenningScreenService {


  get display$(){
    return this._display.asObservable();
  }


  private _display: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(true);

  constructor() { 

  }

  public display(){
    this._display.next(true);
  }

  public hide(){
    this._display.next(false);
  }
}
