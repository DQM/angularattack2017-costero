import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { DataApiService } from '../../services/data-api.service';
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
  @Input('issue') issueObs: any;

  private editing: boolean;
  private marker: any;
  private popup: any;
  private issue: Issue;
  private author: Observable<Author>;
  private popupVisible: boolean = false;

  private hasLiked: Observable<boolean> = Observable.of(false);
  private likes: Observable<number> = Observable.of(0);

  constructor(private mapService: MapService, private geocoder: GeocodingService, private data: DataApiService) {
    this.editing = false;

  }

  ngOnInit() {

    this.hasLiked = this.data.hasLiked(this.issueObs.$ref.key);
    this.likes = this.data.getTotalLikes(this.issueObs.$ref.key);

    this.popup = new Popup()
      // .setHTML('Title: asdasjjjjjjjjjjjjjjjj j asdla ksjdlaks jdkalsjd lkajdklasjd lkajd lkajdlkajdl');
      .setDOMContent(this.popupEl.nativeElement);

    this.marker = new Marker(this.el.nativeElement)
      .setLngLat([30.5, 50.5])
      .setPopup(this.popup)
      .addTo(this.mapService.map);

    this.issueObs.subscribe(
      iss => {
        this.issue = iss;
        this.author = this.data.getAuthor(this.issue.author);
        this.marker.setLngLat([iss.long, iss.lat]);
      }
    );

    this.mapService.map.on('click', (e: MapMouseEvent) => {
      if (this.editing) {
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

  owned() {
    return false;
  }

  solved() {
    // TODO
  }

  like() {

    this.data.performLike(this.issueObs.$ref.key);

  }

}