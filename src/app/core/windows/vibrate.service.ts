import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VibrateService {

  constructor() { }


  public levelFailed(){
    navigator.vibrate(50);
  }

  public complete(){
    navigator.vibrate([300,300,300]);
  }

  public pairMatch(){
    navigator.vibrate(50);
  }


  public pairMissMatch(){
    navigator.vibrate(250); 
  }

}
