import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { GeocodingService } from '../../services/geocoding.service';
import { MapService } from '../../services/map.service';
import { Location } from '../../core/location.class';
import { Issue } from '../../core/issue';
import { MapMouseEvent, Popup, Marker, LngLat } from 'mapbox-gl';

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss']
})
export class MapMarkerComponent implements OnInit {
  @ViewChild('markerEl') el: ElementRef;
  @Input() issue: any;

  private editing: boolean;
  private marker: any;

  constructor(private mapService: MapService, private geocoder: GeocodingService) {
    this.editing = false;

  }

  ngOnInit() {

    this.marker = new Marker(this.el.nativeElement)
      .setLngLat([30.5, 50.5])
      .addTo(this.mapService.map);

    this.issue.subscribe(
      iss => {
        this.marker.setLngLat([iss.long, iss.lat]);
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
