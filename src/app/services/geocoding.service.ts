// Based on: https://github.com/haoliangyu/ngx-mapboxgl-starter/blob/master/public_src/services/geocoding.service.ts

import {Http, Headers, Response} from '@angular/http';
import {Injectable} from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Location } from '../core/location.class';
import { Address } from '../core/address';
import {LngLat, LngLatBounds} from 'mapbox-gl';

@Injectable()
export class GeocodingService {
    http: Http;

    private positionObservable: BehaviorSubject<Location> = null;

    constructor(http: Http) {
      this.http = http;

      this.initPositionObs();
    }

    private initPositionObs() {
      this.positionObservable = new BehaviorSubject(new Location());

      let options = { timeout: 20000 };
      if (navigator.geolocation) {

        let id = navigator.geolocation.watchPosition(
          pos => {
            let meta: any = {};
            meta.timestamp = pos.timestamp;
            meta.altitude = pos.coords.altitude;
            meta.accuracy = pos.coords.accuracy;

            // build location
            this.buildLocation(pos.coords, meta).subscribe(
              (location) => this.positionObservable.next(location),
              (err) => { this.positionObservable.error(err); navigator.geolocation.clearWatch(id); },
              () => {}
            );

          },
          error => {
            this.positionObservable.error(error);
            navigator.geolocation.clearWatch(id);
          },
          options);

      } else {
        this.positionObservable.error('Browser Geolocation service failed.');
      }

    }

    public get position() {

      return this.positionObservable;

    }

    public buildLocation(lngLat: LngLat, meta?: any): Observable<Location> {
      return Observable.create(observer => {

        let location = new Location();
        location.latitude = lngLat.latitude;
        location.longitude = lngLat.longitude;

        if(meta) {
          Object.keys(meta).forEach(k => location[k] = meta[k]);
        }

        // query address and push location when done
        this.regeocode(location).subscribe(
          (address) => location.address = address,
          (err) => observer.error(err),
          () => { observer.next(location); observer.complete(); }
        );

      });
    }

    geocode(address: string) {
        return this.http
            .get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}`)
            .map(res => res.json())
            .map(result => {
                if (result.status !== 'OK') { throw new Error('unable to geocode address'); }

                let location = new Location();
                location.address = result.results[0].formatted_address;
                location.latitude = result.results[0].geometry.location.lat;
                location.longitude = result.results[0].geometry.location.lng;

                let viewPort = result.results[0].geometry.viewport;
                location.viewBounds = new LngLatBounds(
                    new LngLat(viewPort.southwest.lng, viewPort.southwest.lat),
                    new LngLat(viewPort.northeast.lng, viewPort.northeast.lat)
                );

                return location;
            });
    }

    regeocode(lngLat: LngLat): Observable<Address> {
        return this.http
          .get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lngLat.latitude},${lngLat.longitude}`)
          .map(res => res.json())
          .map(result => {
            if (result.status !== 'OK' || result.results.length < 1) { throw new Error('unable to geocode lat/lng'); }

            let address = new Address();
            address.raw = result;
            address.formatted = result.results[0].formatted_address;

            result.results[0].address_components.forEach(component => {

              // possible city
              if (component.types.indexOf('administrative_area_level_2') > -1) {
                address.city = component.long_name;
                return;
              }

              // possible city 2
              if (component.types.indexOf('locality') > -1) {
                address.city = component.long_name;
                return;
              }

              // possible state
              if (component.types.indexOf('administrative_area_level_1') > -1) {
                address.state = component.long_name;
                return;
              }

              // country
              if (component.types.indexOf('country') > -1) {
                address.country = component.long_name;
                return;
              }

            });

            return address;
          });
    }

}
