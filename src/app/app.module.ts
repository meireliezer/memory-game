import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardComponent } from './memory/card/card/card.component';
import { OpenningScreenComponent } from './openning-screen/openning-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    OpenningScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
