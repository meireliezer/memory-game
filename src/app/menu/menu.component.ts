import { Component, OnInit } from '@angular/core';
import { MenuService } from './menu.service';
import { SoundService } from '../core/windows/sound.service';
import { VibrateService } from '../core/windows/vibrate.service';
import { MemoryGameManagerService } from '../core/memory-game-manager.service';
import { iOS } from '../core/windows/utils'; 

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public isOpen = false;
  public isIOS: boolean;


  constructor(public menuService: MenuService,
              private soundService: SoundService,
              private vibrateService: VibrateService,
              private memoryGameManagerService: MemoryGameManagerService

  ) { }

  ngOnInit() {    
    this.isIOS = iOS();
    this.menuService.open$.subscribe( open => {
      this.isOpen = open;
    })
  }


  public toggleSound(){
    this.soundService.toggleSound();
  }

  public isSoundDisabled(){
    return !this.soundService.isEnable();
  }

  public toggleVibrate(){
    this.vibrateService.toggleSound();
  }

  public isVibrateDisabled(){
    return !this.vibrateService.isEnable();    
  }

  public onBackgroundToggle() {    
    this.memoryGameManagerService.toggleBackground();
  }

  public isBackgroundDisabled(){
    return !this.memoryGameManagerService.getBackground();
  }

  public onClose(){
    this.menuService.close();
  }



}
