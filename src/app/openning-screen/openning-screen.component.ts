import { Component, OnInit } from '@angular/core';
import { FullScreenService } from '../core/windows/full-screen.service';
import { MemoryGameManagerService , GAME} from '../core/memory-game-manager.service';



@Component({
  selector: 'app-openning-screen',
  templateUrl: './openning-screen.component.html',
  styleUrls: ['./openning-screen.component.scss']
})
export class OpenningScreenComponent implements OnInit {

  public display =  false;

  constructor(private fullscreenService:FullScreenService,
              private memoryGameManagerService: MemoryGameManagerService) {
                
   }

  ngOnInit() {
  }


  public go(game: number){
    this.fullscreenService.requestFullscreen();  
    this.display =  false;
    this.memoryGameManagerService.setGame(<GAME>game);

  }

  private isIOS(){
    let agent = window.navigator.userAgent;
    let start = agent.indexOf( "OS " );
    return  ( (agent.indexOf( "iPhone" ) > -1 || agent.indexOf("iPad" ) > -1 ) && start > -1 );
  }


}
