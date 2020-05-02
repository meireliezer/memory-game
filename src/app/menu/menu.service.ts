import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Injectable({
  providedIn: 'root'
})
export class MenuService {


  private _open = new BehaviorSubject(false);
  private _action = new Subject();

  constructor() { }

  public get open$(){
    return this._open.asObservable();
  } 

  public get action$() {
    return this._action.asObservable();
  }

  public open() {
    this._open.next(true);
  }

  public close() {
    this._open.next(false);
    this._action.next('CLOSE');
  }

  public action(commnad: string){
    this._action.next(commnad);
  }
}
