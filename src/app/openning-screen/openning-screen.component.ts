import { Component, OnInit } from '@angular/core';
import { FullScreenService } from '../core/windows/full-screen.service';

@Component({
  selector: 'app-openning-screen',
  templateUrl: './openning-screen.component.html',
  styleUrls: ['./openning-screen.component.scss']
})
export class OpenningScreenComponent implements OnInit {

  public display =  true;

  constructor(private fullscreenService:FullScreenService) { }

  ngOnInit() {
  }


  public go(){
    this.fullscreenService.requestFullscreen();
    this.display =  false;
  }




}
