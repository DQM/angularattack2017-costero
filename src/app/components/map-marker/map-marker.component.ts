import { Component, OnInit } from '@angular/core';
import { GeocodingService } from '../../services/geocoding.service';
import { MapService } from '../../services/map.service';
import { Location } from '../../core/location.class';
import { MapMouseEvent, Popup } from 'mapbox-gl';

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss']
})
export class MapMarkerComponent implements OnInit {
  editing: boolean;

  constructor(private mapService: MapService, private geocoder: GeocodingService) {
    this.editing = false;
  }

  ngOnInit() {
    this.mapService.map.on('click', (e: MapMouseEvent) => {
      if (this.editing) {
        this.geocoder.buildLocation(e.lngLat)
          .subscribe(location => {
            let marker = new Popup()
              .setHTML(location.address.formatted)
              .setLngLat(e.lngLat)
              .addTo(this.mapService.map);
          }, error => console.error(error));
      }
    });
  }

  toggleEditing() {
    this.editing = !this.editing;
  }
}
