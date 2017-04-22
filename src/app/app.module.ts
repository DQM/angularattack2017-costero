import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';

import { WindowRefService } from './services//window-ref.service';
import { DataApiService } from './services/data-api.service';
import { MapService } from './services/map.service';

// Components
import { AppComponent } from './app.component';
import { IssueFormComponent } from './components/issue-form/issue-form.component';
import { MapViewComponent } from './components/map-view/map-view.component';

// Kendo Modules
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DialogModule } from '@progress/kendo-angular-dialog';

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
    IssueFormComponent,
    MapViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),

    // Kendo modules
    BrowserAnimationsModule,
    ButtonsModule,
    UploadModule,
    DialogModule
  ],
  providers: [WindowRefService, DataApiService, MapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
