import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';

import { AppComponent } from './app.component';

// Kendo Modules
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonsModule } from '@progress/kendo-angular-buttons';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyBpuv374x9tse1V49NEQzg54zKj-Shw8cY",
  authDomain: "costerocity.firebaseapp.com",
  databaseURL: "https://costerocity.firebaseio.com",
  projectId: "costerocity",
  storageBucket: "costerocity.appspot.com",
  messagingSenderId: "733083878888"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    
    // Kendo modules
    BrowserAnimationsModule,
    ButtonsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
