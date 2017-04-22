import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { UUID } from 'angular2-uuid';

import { WindowRefService } from './window-ref.service';
import { Issue } from "../core/issue";

@Injectable()
export class DataApiService {

  private af: any;
  private db: any;
  private storage: any;
  private issues: any;
  private locations: any;

  private window: any;

  constructor(af: AngularFire, @Inject(FirebaseApp) firebaseApp: firebase.app.App, windowRef: WindowRefService) {

    this.window = windowRef.nativeWindow

    this.af = af;
    this.db = af.database;

    this.storage = firebaseApp.storage();

    this.issues = this.db.list('/issues');
    this.locations = this.db.list('/locations');

  }

  public getAllIssues(): FirebaseListObservable<any> {

    return this.issues;
  }

  public addIssue(issue: Issue) {

    let newKey = this.issues.push(issue).key;
    let geoFire = new this.window.GeoFire(this.locations.$ref);
    geoFire.set(newKey, [issue.lat, issue.long]);

  }

  public uploadPhoto(file: any, contentType: string) {

    let metadata = {
      contentType: contentType || 'image/jpeg'
    };

    let uuid = UUID.UUID();
    let ref = this.storage.ref('/issues_photos');
    let uploadTask = ref.child(uuid + '-' + file.name).put(file);

    return new UploadTask(uploadTask);

  }

  public getIssuesAround(location: any, radius: number) : IssuesLocationQuery {

    return new IssuesLocationQuery(new this.window.GeoFire(this.locations.$ref), this.db, location, radius);

  }

}

export class UploadTask {

  private _downloadUrl: string = '';
  private _completed: boolean = false;

  private _task: Observable<any>;

  constructor(private firebaseTask: any) {

    this._task = Observable.create(observer => {

      this.firebaseTask.on('state_changed',
        // stream cb
        snapshot => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          let downloadURL = this.firebaseTask.snapshot.downloadURL;
          observer.next({
            progress: progress,
            downloadURL: downloadURL,
            snapshot: snapshot
          });
        },
        // error cb
        (error) => observer.error(error),
        // complete cb
        () => {
          this._completed = true; return observer.complete()
        });

    });

  }

  public get downloadURL(): string {
    return this.firebaseTask.snapshot.downloadURL;
  }

  public get completed(): boolean {
    return this._completed;
  }

  public get task(): Observable<any> {
    return this._task;
  }

}

export class IssuesLocationQuery {

  private _radius: number = 100; // 100km
  private _location: Location;

  private _running: boolean;

  private _geoQuery: any;

  private _bhs: BehaviorSubject<Issue[]>;

  private _resultMap: any = {};

  constructor(private geoFire: any, private db: any, location: Location, radius: number) {

    this._bhs = new BehaviorSubject([]);

    this._location = location;
    this._radius = radius;

    this.updateQuery();

  }

  public stop() {
    if(!this._running) return;

    this._running = false;

    this._geoQuery.cancel();
  }

  private updateQuery() {

    if (this._geoQuery) {
      this._geoQuery.cancel();
    }

    this._resultMap = [];
    this._bhs.next(Object.keys(this._resultMap).map(vk => this._resultMap[vk]));

    // Create a GeoQuery centered at 'location'
    this._geoQuery = this.geoFire.query({
      center: this._location,
      radius: this._radius
    });

    this._running = true;

    let onKeyEnteredRegistration = this._geoQuery.on("key_entered", (key, location, distance) => {
      this._resultMap[key] = this.db.object('/issues/' + key);
      this._bhs.next(Object.keys(this._resultMap).map(vk => this._resultMap[vk]));
    });

    var onKeyExitedRegistration = this._geoQuery.on("key_exited", (key, location, distance) => {
      if (key in this._resultMap) {
        delete this._resultMap[key];
        this._bhs.next(Object.keys(this._resultMap).map(vk => this._resultMap[vk]));
      }
    });

    var onReadyRegistration = this._geoQuery.on("ready", () => {
      // don not call complete or the observable will stop receiving signals
      // observer.complete();
    });

  }

  public get issues() : BehaviorSubject<Issue[]> {
    return this._bhs;
  }

	public get radius(): number  {
		return this._radius;
	}

	public set radius(value: number ) {
		this._radius = value;
    this.updateQuery();
	}


	public get location(): Location {
		return this._location;
	}

	public set location(value: Location) {
		this._location = value;
    this.updateQuery();
	}

}
