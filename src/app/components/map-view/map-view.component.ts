import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/switchMap';

import { GeocodingService } from '../../services/geocoding.service';
import { DataApiService } from "../../services/data-api.service";
import { MapService } from '../../services/map.service';
import { LngLat, Map, MapMouseEvent, Popup, Marker } from 'mapbox-gl';
import { MapMarkerComponent } from '../map-marker/map-marker.component';
import { ILatLng } from '../../core/latLng.interface';
import { Location } from '../../core/location.class';
import { Issue } from '../../core/issue';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  private editing: boolean;

  private issuesLocationQuery: any = null;

  private selectedIssueId: string = null;

  constructor(
    private mapService: MapService,
    private geocoder: GeocodingService,
    private data: DataApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {

  }

  ngOnInit() {

    let map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 15,
      center: [-78.880453, 42.897852]
    });

    this.mapService.map = map;

    this.route.params
    // map to Observable<Issue>
    .switchMap( params => {
      if(params['issueId']) {
        this.selectedIssueId = params['issueId'];
        return this.data.getIssueFromIID(params['issueId']);
      }
      this.selectedIssueId = null;
      return Observable.throw('Issue not found')
    })
    .subscribe(
      issue => {

        let location = new Location();
        location.latitude = issue.lat;
        location.longitude = issue.long;
        this.issuesLocationQuery = this.data.getIssuesAround(location, 5);
        this.mapService.setCurrentPosition(issue.long, issue.lat);

      },
      // No issue selected
      err => {

        this.geocoder.getCurrentLocation().subscribe(
          location => {
            this.issuesLocationQuery = this.data.getIssuesAround(location, 5);
            this.mapService.setCurrentPosition(location.longitude, location.latitude);
          },
          err => { console.log(err); },
          () => { }
        );

      }
    );

  }

}
