import { Component } from '@angular/core';

import { Issue } from "./core/issue";
import { MapMarkerComponent } from './components/map-marker/map-marker.component';
import { DataApiService, UploadTask } from "./services/data-api.service";
import { MapService } from './services/map.service';
import { GeocodingService } from './services/geocoding.service';
import { Location } from './core/location.class';
import { LngLat, Map } from 'mapbox-gl';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app works!';

  private issues: any;

  constructor(private mapService: MapService, private data: DataApiService, private geocoder: GeocodingService) {

    let issue = new Issue();
    issue.title = 'geo';
    issue.lat = -7.140095;
    issue.long = -34.851654;
    // data.addIssue(issue);

    this.issues = this.data.getIssuesAround([-8.0431353, -35.0062387], 300);
    console.log(this.issues);

  }

  onButtonClick() {
    this.title = 'Hello from Kendo UI';
  }

  selectFile(event) {
    let file = event.srcElement.files[0];
    console.log(file);
    let uploadTask: UploadTask = this.data.uploadPhoto(file, file.type);
    uploadTask.task.subscribe(state => {

      // state: {
      //  downloadUrl: string,
      //  progress: number
      // }
      //
      console.log(state);

    }, error => {
      console.log(error);
    }, () => {
      console.log('complete. Url: ' + uploadTask.downloadURL);
    });
  }

}
