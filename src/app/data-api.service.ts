import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

import { WindowRefService } from './window-ref.service';
import { Issue } from "./issue";

@Injectable()
export class DataApiService {

  private db: any;
  private issues: any;
  private locations: any;

  private window : any;

  constructor(af: AngularFire, windowRef: WindowRefService) {

    this.db = af.database;
    this.issues = this.db.list('/issues');
    this.locations = this.db.list('/locations');

    this.window = windowRef.nativeWindow

  }

  public getAllIssues(): FirebaseListObservable<any> {

    return this.issues;
  }

  public addIssue(issue: Issue) {

    let newKey = this.issues.push(issue).key;
    let geoFire = new this.window.GeoFire(this.locations.$ref);
    geoFire.set(newKey, [issue.lat, issue.long]);

  }

  public getIssuesAround(location: any, radius: number) {

    return Observable.create(observer => {

      let geoFire = new this.window.GeoFire(this.locations.$ref);

      let resultMap = {};

      // Create a GeoQuery centered at 'location'
      let geoQuery = geoFire.query({
        center: location,
        radius: radius
      });

      let onKeyEnteredRegistration = geoQuery.on("key_entered", (key, location, distance) => {
        resultMap[key] = this.db.object('/issues/' + key);
        observer.next( Object.keys(resultMap).map(vk => resultMap[vk]) );
      });

      // observer.complete();

    });

  }

}
