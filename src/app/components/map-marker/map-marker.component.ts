import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
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

  private marker: any;
  private author: Observable<Author>;
  private userClicked: boolean = false;

  private hasLiked: Observable<boolean> = Observable.of(false);
  private likes: Observable<number> = Observable.of(0);
  private owned: Observable<boolean> = Observable.of(false);

  constructor(
    private mapService: MapService,
    private geocoder: GeocodingService,
    private data: DataApiService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {

    this.hasLiked = this.data.hasLiked(this.issue.$ref.key);
    this.likes = this.data.getTotalLikes(this.issue.$ref.key);
    this.owned = this.issue.take(1).map(issue => this.auth.getUser().getValue().uid == issue.author);

    this.marker = new Marker(this.el.nativeElement)
      .setLngLat([30.5, 50.5])
      // .setPopup(this.popup)
      .addTo(this.mapService.map);

    this.issue.subscribe(
      iss => {
        this.author = this.data.getAuthor(this.issue.author);
        this.marker.setLngLat([iss.long, iss.lat]);
      }
    );

    if(this.startOpen) {
      let cb = (p) => {
        this.router.navigate(['/map']);
        // this.popup.off(popupCloseCb);
      };
      var p = new Popup()
        .setDOMContent(this.popupEl.nativeElement)
        .setLngLat(this.marker.getLngLat())
        .on('close', cb.bind(p))
        .addTo(this.mapService.map);
    }
  }


  solve() {
    this.issue.update({
      solved: true
    });
  }

  like() {

    this.data.performLike(this.issue.$ref.key);
  }

  click() {
    this.issue.first().subscribe(
      iss => {
        this.userClicked = true;
        this.router.navigate(['/map', iss.iid]);
      }
    );
  }

}
