import { Component, OnInit } from '@angular/core';

import { GeocodingService } from '../../services/geocoding.service';
import { DataApiService } from "../../services/data-api.service";
import { MapService } from '../../services/map.service';
import { LngLat, Map, MapMouseEvent, Popup, Marker } from 'mapbox-gl';
import { MapMarkerComponent } from '../map-marker/map-marker.component';
import { ILatLng } from '../../core/latLng.interface';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  private editing: boolean;

  private issuesLocationQuery: any = null;

  constructor(private mapService: MapService, private geocoder: GeocodingService, private data: DataApiService) {

  }

  ngOnInit() {

    let map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 15,
      center: [-78.880453, 42.897852]
    });

    this.mapService.map = map;

    this.geocoder.getCurrentLocation().subscribe(
      location => {
        this.mapService.setCurrentPosition(location.longitude, location.latitude);
        this.issuesLocationQuery = this.data.getIssuesAround(location, 5);
      },
      err => { console.log(err); },
      () => { }
    );

  }

}
