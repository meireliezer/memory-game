import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FullScreenService {

  constructor() { }

  public requestFullscreen(){
    

    
    var docElm:any = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    }
    else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    }
    else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    }
    else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
  }

  public exitFullscreen(){

    let doc:any = document;

    if (doc.exitFullscreen) {
      doc.exitFullscreen();
      }
      else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      }
      else if (doc.webkitCancelFullScreen) {
        doc.webkitCancelFullScreen();
      }
      else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
  }
}
