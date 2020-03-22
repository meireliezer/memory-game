import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  private audioContext: AudioContext;

  constructor() { 
    // browsers limit the number of concurrent audio contexts, so you better re-use'em
    this.audioContext = new AudioContext();
  }

  public pairMissMatch() {
    this.beep(999, 500, 300);
    this.beep (999, 210, 300); 
    this.beep(999, 100,300);    
  }  

  public complete(){
    this.beep(999, 100, 100);
    setTimeout( ()=> this.beep(999, 300, 100), 100);
    setTimeout( ()=> this.beep(999, 500, 100), 200);
    setTimeout( ()=> this.beep(999, 900, 100), 300);
  }

  public failed(){
    this.beep(999, 80, 600); 
    this.beep(999, 800, 700);
    this.beep(999, 600, 600);
  }

  public beepCard(cardId:number){
    this.beep(999, ((cardId+1)*100), 100);
  }

  private beep(vol, freq, duration){

    let oscillator =this.audioContext.createOscillator();
    let gain=this.audioContext.createGain();
    oscillator.connect(gain);
    oscillator.frequency.value=freq;
    oscillator.type="square";
    gain.connect(this.audioContext.destination);
    gain.gain.value=vol*0.01;
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime+duration*0.001);
  }


  private _randomInervals = [];  
  public randomStart(){
    for(let i = 0 ; i < 4 ; ++i){
      let interval  = setInterval( () => {
        
        this.beep(999, Math.random()*1000, Math.random()*500);

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
