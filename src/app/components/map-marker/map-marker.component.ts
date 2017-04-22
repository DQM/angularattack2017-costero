import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { GeocodingService } from '../../services/geocoding.service';
import { MapService } from '../../services/map.service';
import { Location } from '../../core/location.class';
import { Issue } from '../../core/issue';
import { MapMouseEvent, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss']
})
export class MapMarkerComponent implements OnInit {
  @Input() issue: any;

  private editing: boolean;
  private marker: any;

  constructor(private mapService: MapService, private geocoder: GeocodingService) {
    this.editing = false;

  }

  ngOnInit() {

    this.marker = new Marker()
      .setLngLat([30.5, 50.5])
      .addTo(this.mapService.map);

    // console.log(this.marker);

    this.issue.subscribe(
      iss => {
        console.log(iss);
        this.marker.setLngLat([iss.lat, iss.long]);
      }
    );

    this.mapService.map.on('click', (e: MapMouseEvent) => {
      if (this.editing) {
        this.geocoder.buildLocation(e.lngLat)
          .subscribe(location => {
            // let marker = new Popup()
            //   .setHTML(location.address.formatted)
            //   .setLngLat(e.lngLat)
            //   .addTo(this.mapService.map);
          }, error => console.error(error));
      }
    });
  }

  toggleEditing() {
    this.editing = !this.editing;
  }
}
