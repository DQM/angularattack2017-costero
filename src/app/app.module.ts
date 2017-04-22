import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';

// Services
import { WindowRefService } from './services/window-ref.service';
import { DataApiService } from './services/data-api.service';
import { MapService } from './services/map.service';
import { GeocodingService } from "./services/geocoding.service";
import { AuthService } from "./services/auth.service";

// Components
import { AppComponent } from './components/app/app.component';
import { IssueFormComponent } from './components/issue-form/issue-form.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { MapMarkerComponent } from './components/map-marker/map-marker.component';

// Kendo Modules
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DialogModule } from '@progress/kendo-angular-dialog';

// Router
import { RouterModule, Routes } from '@angular/router';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { AppStatsComponent } from './components/app-stats/app-stats.component';

const appRoutes: Routes = [
  // { path: '', component: AppComponent},
  { path: 'map', component: MapViewComponent},
  // { path: 'home', redirectTo: '/map', pathMatch: 'full'},
  { path: 'stats', component: AppStatsComponent},
  { path: 'map/:issueId', component: MapViewComponent}
];

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
    MapViewComponent,
    AppHomeComponent,
    AppStatsComponent,
    MapMarkerComponent
  ],
  imports: [
    // Router
    RouterModule.forRoot(appRoutes),

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
  providers: [
    WindowRefService,
    DataApiService,
    MapService,
    GeocodingService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
