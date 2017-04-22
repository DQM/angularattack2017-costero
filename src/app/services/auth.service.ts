import { Injectable, Inject } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { AngularFire, FirebaseListObservable, FirebaseApp, AuthProviders, AuthMethods } from 'angularfire2';

import { WindowRefService } from './window-ref.service';

@Injectable()
export class AuthService {

  private _bhs: BehaviorSubject<any>;

  constructor(private af: AngularFire, @Inject(FirebaseApp) private firebaseApp: firebase.app.App, windowRef: WindowRefService) {

    this._bhs = new BehaviorSubject(null);

    this.af.auth.subscribe(
      auth => { this._bhs.next(auth ? auth.auth : null) },
      err => this._bhs.error(err),
      () => this._bhs.complete()
    );

  }

  public getUser(): BehaviorSubject<any> {

    return this._bhs;

  }

  public get isLoggedIn() {
    return this._bhs.getValue() != null;
  }

  public login(){

    this.af.auth.login({
      provider: AuthProviders.Facebook,
      method: AuthMethods.Popup,
    });

  }

  public logout() {
    return this.af.auth.logout();
  }

}
