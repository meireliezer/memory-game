import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './memory/card/card/card.component';
import { OpenningScreenComponent } from './openning-screen/openning-screen.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LevelFailedComponent } from './main/level-failed/level-failed.component';
import { GameOverComponent } from './main/game-over/game-over.component';
import { GameCompleteComponent } from './main/game-complete/game-complete.component';
import { CountDownComponent } from './main/count-down/count-down.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    OpenningScreenComponent,
    LevelFailedComponent,
    GameOverComponent,
    GameCompleteComponent,
    CountDownComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    //ServiceWorkerModule.register('./memory-game-dist/ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents:[
    LevelFailedComponent,
    GameOverComponent,
    GameCompleteComponent,
    CountDownComponent
  ]

})
export class AppModule { }
