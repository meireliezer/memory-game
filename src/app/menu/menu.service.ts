import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private _open = new BehaviorSubject(true);
  public get open$(){
    return this._open.asObservable();
  } 

  constructor() { }

  public open() {
    this._open.next(true);
  }

  public close() {
    this._open.next(false);
  }
}
