import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent implements OnInit {

  constructor(private mapService: MapService) { }

  ngOnInit() {

    let map = new Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      zoom: 5,
      center: [-78.880453, 42.897852]
    });

    this.mapService.map = map;
  }

}
