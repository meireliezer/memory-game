import { Injectable } from '@angular/core';
import {iOS} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class VibrateService {

  private _enabled: boolean;

  constructor() {
    this._enabled = localStorage.getItem('vibrate') !== "0";
    if(iOS()){
      this._enabled = false;
    }
   }


   public isEnable(){
    return this._enabled;
  }


  public levelFailed(){
    this.vibrate(50);
  }

  public complete(){
    this.vibrate([300,300,300]);
  }

  public pairMatch(){
    this.vibrate(50);
  }

  public pairMissMatch(){
    this.vibrate(250); 
  }

  public toggleSound(){
    this._enabled = !this._enabled;
    localStorage.setItem('vibrate', this._enabled? "1": "0");
  }

  private vibrate( arg ){
    if(!this._enabled){
      return;
    }

    navigator.vibrate(arg); 
  }

  
}
