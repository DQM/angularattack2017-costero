import { Component, OnInit, OnDestroy, OnChanges, Input, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
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
export class MapMarkerComponent implements OnInit, OnDestroy {
  @ViewChild('markerEl') el: ElementRef;
  @ViewChild('markerPopupEl') popupEl: ElementRef;
  @Input('issue') issue: any;
  @Input('selected') selected: any;

  private marker: any;
  private popup: any = null;
  private author: Observable<Author>;

  private hasLiked: Observable<boolean> = Observable.of(false);
  private likes: Observable<number> = Observable.of(0);
  private owned: Observable<boolean> = Observable.of(false);

  constructor(
    private mapService: MapService,
    private geocoder: GeocodingService,
    private data: DataApiService,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {

    this.marker = new Marker(this.el.nativeElement)
      .setLngLat([30.5, 50.5])
      // .setPopup(this.popup)
      .addTo(this.mapService.map);

    this.popup = new Popup({
      closeButton: false
    })
      .setDOMContent(this.popupEl.nativeElement)
      .setLngLat(this.marker.getLngLat());

    if (this.selected) {
      this.popup.addTo(this.mapService.map);
    }

    this.hasLiked = this.data.hasLiked(this.issue.$ref.key);
    this.likes = this.data.getTotalLikes(this.issue.$ref.key);
    this.owned = this.auth.getUser().map(user => user && user.uid == this.issue.author);

    this.issue.subscribe(
      iss => {

        if(!iss || !iss.long || !iss.lat) {
          if(this.popup) this.popup.remove();
          this.marker.remove();
          return;
        }

        this.author = this.data.getAuthor(iss.author);

        this.marker.setLngLat([iss.long, iss.lat]);

        if (this.popup) {
          this.popup.setLngLat([iss.long, iss.lat]);
        }

      }
    );

  }

  ngOnDestroy() {
    if(this.popup) {
      this.popup.remove();
      this.popup = null;
    }
  }

  public isOpen() {
    return this.popup && this.popup.isOpen();
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
        this.router.navigate(['/map', iss.iid]);
      }
    );
  }

  close() {
    this.router.navigate(['/map']);
  }

}
