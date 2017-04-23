import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { DataApiService } from '../../services/data-api.service';
import { AuthService } from '../../services/auth.service';
import { GeocodingService } from '../../services/geocoding.service';
import { MapService } from '../../services/map.service';
import { Location } from '../../core/location.class';
import { Issue } from '../../core/issue';
import { Author } from '../../core/author';
import { MapMouseEvent, Popup, Marker, LngLat } from 'mapbox-gl';

@Component({
  selector: 'app-map-marker',
  templateUrl: './map-marker.component.html',
  styleUrls: ['./map-marker.component.scss']
})
export class MapMarkerComponent implements OnInit {
  @ViewChild('markerEl') el: ElementRef;
  @ViewChild('markerPopupEl') popupEl: ElementRef;
  @Input('issue') issue: any;
  @Input('startOpen') startOpen: boolean = false;

  private editing: boolean;
  private marker: any;
  private popup: any;
  private author: Observable<Author>;
  private popupVisible: boolean = false;

  private hasLiked: Observable<boolean> = Observable.of(false);
  private likes: Observable<number> = Observable.of(0);
  private owned: Observable<boolean> = Observable.of(false);

  constructor(private mapService: MapService, private geocoder: GeocodingService, private data: DataApiService, private auth: AuthService) {
    this.editing = false;

  }

  ngOnInit() {

    this.hasLiked = this.data.hasLiked(this.issue.$ref.key);
    this.likes = this.data.getTotalLikes(this.issue.$ref.key);
    this.owned = this.issue.take(1).map(issue => this.auth.getUser().getValue().uid == issue.author);

    this.popup = new Popup()
      .setDOMContent(this.popupEl.nativeElement);

    this.marker = new Marker(this.el.nativeElement)
      .setLngLat([30.5, 50.5])
      .setPopup(this.popup)
      .addTo(this.mapService.map);

    this.issue.subscribe(
      iss => {
        this.author = this.data.getAuthor(this.issue.author);
        this.marker.setLngLat([iss.long, iss.lat]);
      }
    );

    this.mapService.map.on('click', (e: MapMouseEvent) => {
      if (!this.editing) {
        let latlng: any = {};
        latlng.longitude = e.lngLat.lng;
        latlng.latitude = e.lngLat.lat;

        this.geocoder.buildLocation(latlng)
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

  solve() {
    this.issue.update({
      solved: true
    });
  }

  like() {

    this.data.performLike(this.issue.$ref.key);

  }

}
