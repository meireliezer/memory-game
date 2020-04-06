import { Injectable } from '@angular/core';
import { iOS } from './utils';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  
  private audioContext: AudioContext;
  private _enabled: boolean;
  private _volume: number;


  constructor() { 
    // browsers limit the number of concurrent audio contexts, so you better re-use'em    
    this._enabled = localStorage.getItem('sound') !== "0";
    if(iOS()){
      this._enabled = false;
    }
    this._volume = 1;

  }

  public isEnable(){
    return this._enabled;
  }

  public pairMissMatch() {
    this.beep(500, 300);
    this.beep(210, 300); 
    this.beep(100, 300);    
  }  

  public complete(){
    this.beep(100, 100);
    setTimeout( ()=> this.beep(300, 100), 100);
    setTimeout( ()=> this.beep(500, 100), 200);
    setTimeout( ()=> this.beep(900, 100), 300);
  }

  public failed(){
    this.beep(80, 600); 
    this.beep(800, 700);
    this.beep(600, 600);
  }

  public beepCard(cardId:number){
    this.beep(((cardId+1)*100), 100);
  }

  private beep(freq, duration){
    if(this._enabled === false){
      return;
    }
    if(!this.audioContext){
      this.audioContext = new AudioContext();
    }
    let oscillator =this.audioContext.createOscillator();
    let gain=this.audioContext.createGain();
    oscillator.connect(gain);
    oscillator.frequency.value=freq;
    oscillator.type="square";
    gain.connect(this.audioContext.destination);
    gain.gain.value=this._volume*0.01;
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime+duration*0.001);
  }


  public toggleSound(){
    this._enabled = !this._enabled;
    localStorage.setItem('sound', this._enabled? "1": "0");
  }


  private _randomInervals = [];  
  public randomStart(){
    for(let i = 0 ; i < 4 ; ++i){
      let interval  = setInterval( () => {
        
        this.beep(Math.random()*1000, Math.random()*500);

      }, Math.random()*2000);
      this._randomInervals.push(interval);
    }
  }

  public randomStop(){
    this._randomInervals.forEach(intrevalHandler => {
      clearInterval(intrevalHandler);
    } );

    this._randomInervals = [];
  }
}
