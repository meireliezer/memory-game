import { Injectable } from '@angular/core';
import {iOS} from "./utils";
import { UserDataService } from './user-data.service';

@Injectable({
  providedIn: 'root'
})
export class VibrateService {

  private _enabled: boolean;

  constructor(private userDataService: UserDataService) {
    this._enabled = this.userDataService.getVibrate();
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
    this.userDataService.setVibriate(this._enabled)
    
  }

  private vibrate( arg ){
    if(!this._enabled){
      return;
    }

    navigator.vibrate(arg); 
  }

  
}
