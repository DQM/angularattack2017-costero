import { Injectable, Inject, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

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
        observer.next(Object.keys(resultMap).map(vk => resultMap[vk]));
      });

      // observer.complete();

    });

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
