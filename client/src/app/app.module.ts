import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';

import { AppComponent } from './app.component';
import { userReducer } from './ngrx/userReducer';

// services
import { Request } from './services/request.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    StoreModule.forRoot({
      user: userReducer,
    })
  ],
  providers: [Request],
  bootstrap: [AppComponent]
})

export class AppModule { }
