import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/switchMap';

import { WindowRefService } from '../../services/window-ref.service';
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

  private window: any;

  constructor(
    private mapService: MapService,
    private geocoder: GeocodingService,
    private data: DataApiService,
    private route: ActivatedRoute,
    private router: Router,
    windowRef: WindowRefService
  ) {

    this.window = windowRef.nativeWindow;

  }

  ngOnInit() {

    let map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 15,
      center: [-78.880453, 42.897852]
    });

    this.mapService.map = map;

    this.mapService.map.on('click', (e: MapMouseEvent) => {
        let latlng: any = {};
        latlng.longitude = e.lngLat.lng;
        latlng.latitude = e.lngLat.lat;

        this.mapService.map.setCenter([e.lngLat.lng, e.lngLat.lat]);

        this.geocoder.buildLocation(latlng)
          .subscribe(location => {
            let marker = new Popup()
              .setHTML(location.address.formatted)
              .setLngLat(e.lngLat)
              .addTo(this.mapService.map);
          }, error => console.error(error));
    });

    this.mapService.map.on('moveend', this.updateQuery.bind(this, 'moveend'));
    // this.mapService.map.on('zoomend', this.updateQuery.bind(this, 'zoomend'));

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

        if(issue == null) {
          this.router.navigate(['/map']);
          return;
        }

        if (this.issuesLocationQuery) {
          this.issuesLocationQuery.stop();
          this.issuesLocationQuery = null;
        }
        let location = new Location();
        location.latitude = issue.lat;
        location.longitude = issue.long;
        this.mapService.setCurrentPosition(location.longitude, location.latitude);
        this.issuesLocationQuery = this.data.getIssuesAround(location, 5);

      },
      // No issue selected
      err => {

        this.geocoder.getCurrentLocation().subscribe(
          location => {
            if (this.issuesLocationQuery) {
              this.issuesLocationQuery.stop();
              this.issuesLocationQuery = null;
            }
            this.issuesLocationQuery = this.data.getIssuesAround(location, 5);
            this.mapService.setCurrentPosition(location.longitude, location.latitude);
          },
          err => { console.log(err); },
          () => { }
        );

      }
    );

  }

  getIssues() {
    if(!this.issuesLocationQuery) return Observable.of([]);
    return this.issuesLocationQuery.issues;
  }

  updateQuery(from) {

    let bounds = this.mapService.map.getBounds();
    let center = bounds.getCenter();
    let south = bounds.getSouth();

    let radius = this.window.GeoFire.distance(
      [center.lat, center.lng],
      [south, center.lng]
    );

    let location = new Location();
    location.latitude = center.lat;
    location.longitude = center.lng;

    if(this.issuesLocationQuery) {
      this.issuesLocationQuery.radius = radius;
      this.issuesLocationQuery.location = location;
      this.issuesLocationQuery.updateQuery();
    }

  }

}
