import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';

import { WindowRefService } from './window-ref.service';
import { DataApiService } from './data-api.service';

// Components
import { AppComponent } from './app.component';
import { IssueFormComponent } from './issue-form/issue-form.component';

// Kendo Modules
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadModule } from '@progress/kendo-angular-upload';

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
    AppComponent,
    IssueFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),

    // Kendo modules
    BrowserAnimationsModule,
    ButtonsModule,
    UploadModule
  ],
  providers: [WindowRefService, DataApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
