import { Component, OnInit } from '@angular/core';
import { FullScreenService } from '../core/windows/full-screen.service';
import { MemoryGameManagerService , GAME} from '../core/memory-game-manager.service';
import { OpenningScreenService } from './openning-screen.service';



@Component({
  selector: 'app-openning-screen',
  templateUrl: './openning-screen.component.html',
  styleUrls: ['./openning-screen.component.scss']
})
export class OpenningScreenComponent implements OnInit {
  
  constructor(private fullscreenService:FullScreenService,
              private memoryGameManagerService: MemoryGameManagerService, 
              public openningScreenService: OpenningScreenService) {
                
   }

  ngOnInit() {
  }


  public go(game: number){
    this.openningScreenService.hide();
    this.fullscreenService.requestFullscreen();     
    this.memoryGameManagerService.setGame(<GAME>game);
    

  }

  private isIOS(){
    let agent = window.navigator.userAgent;
    let start = agent.indexOf( "OS " );
    return  ( (agent.indexOf( "iPhone" ) > -1 || agent.indexOf("iPad" ) > -1 ) && start > -1 );
  }


}
