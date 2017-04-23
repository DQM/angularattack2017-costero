import { Component, OnInit } from '@angular/core';

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
  private title: string;
  private description: string;
  private city: string;
  private state: string;
  private country: string;
  private latitude: number;
  private longitude: number;
  private added: boolean;
  private error: string;

  constructor(private mapService: MapService, private geocoder: GeocodingService, private data: DataApiService) {
    let center: LngLat = this.mapService.map.getCenter();
    let latlng: any = {};
    latlng.longitude = center.lng;
    latlng.latitude = center.lat;
    this.geocoder.buildLocation(latlng)
      .subscribe(location => {
        this.city = location.address.city;
        this.state = location.address.state;
        this.country = location.address.country;
        console.log(location);
      }, error => console.error(error));

    this.latitude = center.lat;
    this.longitude = center.lng;

    this.title = "";
    this.description = "";
    this.added = false;
    this.error = "";
  }

  ngOnInit() { }

  submitForm() {
    let issue = new Issue();
    issue.title = this.title;
    issue.description = this.description;
    issue.city = this.city;
    issue.state = this.state;
    issue.country = this.country;
    issue.lat = this.latitude;
    issue.long = this.longitude;
    issue.solved = false;
    issue.date_created = new Date().toUTCString();
    this.data.addIssue(issue)
      .then(() => this.successAdding)
      .catch(err => this.failAdding());
  }

  successAdding() {
    this.added = true;
  }

  failAdding() {
    this.error = "Error, try again.";
  }

  closeDialog() {
    this.added = false;
  }

}
