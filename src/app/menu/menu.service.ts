import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private _open = new BehaviorSubject(true);
  private _home = new Subject();

  constructor() { }

  public get open$(){
    return this._open.asObservable();
  } 

  public get home$() {
    return this._home.asObservable();
  }

  public open() {
    this._open.next(true);
  }

  public close() {
    this._open.next(false);
  }

  public goHome(){
    this._home.next();
  }
}
