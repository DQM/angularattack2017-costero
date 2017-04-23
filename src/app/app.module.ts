import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AngularFireModule } from 'angularfire2';
import { NgProgressModule } from 'ng2-progressbar';

// Services
import { WindowRefService } from './services/window-ref.service';
import { DataApiService } from './services/data-api.service';
import { MapService } from './services/map.service';
import { GeocodingService } from "./services/geocoding.service";
import { AuthService } from "./services/auth.service";

// Components
import { AppComponent } from './components/app/app.component';
import { AppHomeComponent } from './components/app-home/app-home.component';
import { AppStatsComponent } from './components/app-stats/app-stats.component';
import { IssueFormComponent } from './components/issue-form/issue-form.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { MapMarkerComponent } from './components/map-marker/map-marker.component';
import { MapSidebarComponent } from './components/map-sidebar/map-sidebar.component';

// Kendo Modules
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadModule } from '@progress/kendo-angular-upload';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ScrollViewModule } from '@progress/kendo-angular-scrollview';
import { PopupModule } from '@progress/kendo-angular-popup';

// Router
import { RouterModule, Routes } from '@angular/router';
import { IssueListItemComponent } from './components/issue-list-item/issue-list-item.component';
import { UserMenuComponent } from './components/user-menu/user-menu.component';

const appRoutes: Routes = [
  // { path: '', component: AppComponent},
  { path: '', redirectTo: '/map/browse', pathMatch: 'full' },
  { path: 'map', redirectTo: '/map/browse', pathMatch: 'full' },
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
    MapMarkerComponent,
    MapSidebarComponent,
    IssueListItemComponent,
    UserMenuComponent
  ],
  imports: [
    // Router
    RouterModule.forRoot(appRoutes),

    // Modules
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),

    // Kendo modules
    BrowserAnimationsModule,
    ButtonsModule,
    UploadModule,
    DialogModule,
    LayoutModule,
    InputsModule,
    DropDownsModule,
    ScrollViewModule,
    PopupModule,

    NgProgressModule
  ],
  providers: [
    // Services
    WindowRefService,
    DataApiService,
    MapService,
    GeocodingService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
