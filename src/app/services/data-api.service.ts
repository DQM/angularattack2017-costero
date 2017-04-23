import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { AngularFire, FirebaseListObservable, FirebaseApp } from 'angularfire2';
import * as firebase from 'firebase';
import { UUID } from 'angular2-uuid';

import { WindowRefService } from './window-ref.service';
import { AuthService } from './auth.service';
import { Issue } from "../core/issue";
import { Location } from "../core/location.class";
import { Author } from "../core/author";

@Injectable()
export class DataApiService {

  private db: any;
  private storage: any;
  private issues: any;
  private locations: any;

  private window: any;

  constructor(private af: AngularFire, @Inject(FirebaseApp) firebaseApp: firebase.app.App, windowRef: WindowRefService, private auth: AuthService) {

    this.window = windowRef.nativeWindow

    this.db = af.database;

    this.storage = firebaseApp.storage();

    this.issues = this.db.list('/issues');
    this.locations = this.db.list('/locations');

  }

  public getStorage() {
    return this.storage;
  }

  public getAllIssues(): FirebaseListObservable<any> {

    return this.issues;
  }

  public getTopIssues(limit?: number): Observable<Issue[]> {

    limit = limit || 50;

    return this.db.list('/issues', {
      query: {
        orderByChild: '_likes',
        limitToLast: limit
      }
    }).map( arr => arr.sort( (a, b) => -(a._likes - b._likes) ) );
  }

  public getRecentIssues(limit?: number): Observable<Issue[]> {
    limit = limit || 50;
    return this.db.list('/issues', {
      query: {
        orderByChild: 'date_created',
        limitToLast: limit
      }
    }).map( arr => arr.sort( (a, b) => -(a.date_created - b.date_created) ) );
  }

  public addIssue(issue: Issue): Promise<any> {

    return new Promise( (resolve, reject) => {

      issue.iid = UUID.UUID();

      this.auth.getUser().first().subscribe(
        user => {

          issue.author = user.uid;

          let newKey = this.issues.push(issue).key;
          let geoFire = new this.window.GeoFire(this.locations.$ref);
          geoFire.set(newKey, [issue.lat, issue.long]).then(resolve).catch(reject);

        },
        reject
      );

    });

  }

  public uploadPhoto(file: any, contentType: string) {

    let metadata = {
      contentType: contentType || 'image/jpeg'
    };

    let uuid = UUID.UUID();
    let ref = this.storage.ref('/issues_photos');
    let uploadTask = ref.child(uuid + '-' + file.name).put(file);

    return new UploadTask(uploadTask, file);

  }

  public getIssueFromIID(iid: string): Observable<Issue> {

    return this.db.list('/issues/', {
      query: {
        orderByChild: 'iid',
        equalTo: iid,
        limitToFirst: 1
      }
    })
    // return Issue or null
    .map(res => res && res.length > 0 ? res[0] : null);

  }

  public getIssuesAround(location: Location, radius: number) : IssuesLocationQuery {

    return new IssuesLocationQuery(new this.window.GeoFire(this.locations.$ref), this.db, location, radius);

  }

  public getAuthor(authorId: string): BehaviorSubject<Author> {

    let bhs = new BehaviorSubject(null);

    this.db.object('/users/'+authorId).subscribe(bhs);

    return bhs;
  }

  public performLike(issueId): Promise<boolean> {

    return new Promise( (resolve, reject) => {

      this.hasLiked(issueId).take(1).subscribe(

        liked => {
          if(liked) return resolve(true);

          this.db.object('/issues/' + issueId + '/likes_uids/' + this.auth.getUser().getValue().uid).set(true)
          .then(() => {

            this.getTotalLikes(issueId).subscribe(
              total => this.db.object('/issues/' + issueId + '/_likes').set(total).then(resolve).catch(reject),
              err => reject(err)
            );

          }).catch(reject);
        },
        reject

      );

    });

  }

  public removeLike(issueId): Promise<boolean> {

    return new Promise( (resolve, reject) => {

      return this.db.object('/issues/' + issueId + '/likes_uids/' + this.auth.getUser().getValue().uid).remove().then(() => {

        this.getTotalLikes(issueId).subscribe(
          total => this.db.object('/issues/' + issueId + '/_likes').set(total).then(resolve).catch(reject),
          err => reject(err)
        );

      }).catch(reject);

    });

  }

  public hasLiked(issueId: string): Observable<boolean> {

    return this.db.list('/issues/' + issueId + '/likes_uids', {
      query: {
        orderByKey: true,
        equalTo: this.auth.getUser().getValue().uid,
        limitToFirst: 1
      }
    }).map(res => res.length > 0);

  }

  public getTotalLikes(issueId: string): Observable<number> {

    return this.db.list('/issues/' + issueId + '/likes_uids')
    .map(res => res.length);

  }

}


export class UploadTask {

  private _downloadUrl: string = '';
  private _completed: boolean = false;
  private _file: any = null;

  private _task: Observable<any>;

  constructor(private firebaseTask: any, file: any) {

    this._file = file;

    this._task = Observable.create(observer => {

      this.firebaseTask.on('state_changed',
        // stream cb
        snapshot => {
          let progress = (snapshot.bytesTransferred / snapshot.totalBytes);
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


	public get file(): any  {
		return this._file;
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

  private _geoQuery: any = null;

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

  public updateQuery() {

    this._resultMap = [];
    this._bhs.next(Object.keys(this._resultMap).map(vk => this._resultMap[vk]));

    // Create a GeoQuery centered at 'location'
    if (!this._geoQuery || !this._running) {
      this._geoQuery = this.geoFire.query({
        center: [this._location.latitude, this._location.longitude],
        radius: this._radius
      });
    } else {

      this._geoQuery.updateCriteria({
        center: [this._location.latitude, this._location.longitude],
        radius: this._radius
      });

    }

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
	}


	public get location(): Location {
		return this._location;
	}

	public set location(value: Location) {
		this._location = value;
	}

}
