import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { MapService } from '../../services/map.service';
import { GeocodingService } from '../../services/geocoding.service';
import { DataApiService } from '../../services/data-api.service';
import { LngLat } from 'mapbox-gl';

import { Issue } from '../../core/issue';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss']
})
export class IssueFormComponent implements OnInit {
  private issue: Issue;
  private added: boolean;
  private error: string;

  constructor(private mapService: MapService, private geocoder: GeocodingService, private data: DataApiService) {

    this.issue = new Issue();

    this.updateGeo();

    this.added = false;
    this.error = "";
  }

  ngOnInit() {

    this.mapService.map.on('moveend', this.updateGeo.bind(this));

  }

  updateGeo() {

    let center: LngLat = this.mapService.map.getCenter();
    let latlng: any = {};
    latlng.longitude = center.lng;
    latlng.latitude = center.lat;
    this.geocoder.buildLocation(latlng)
      .subscribe(location => {
        this.issue.city = location.address.city;
        this.issue.state = location.address.state;
        this.issue.country = location.address.country;
      }, error => console.error(error));

    this.issue.lat = center.lat;
    this.issue.long = center.lng;

  }

  submitForm() {
    this.issue.solved = false;
    this.issue.date_created = new Date().toUTCString();
    this.data.addIssue(this.issue)
      .then(() => this.successAdding)
      .catch(err => this.failAdding());
  }

  successAdding() {
    this.added = true;
    this.issue = new Issue();
  }

  failAdding() {
    this.error = "Error, try again.";
  }

  closeDialog() {
    this.added = false;
  }

}
