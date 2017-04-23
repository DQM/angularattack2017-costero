import { AngularFire, FirebaseObjectObservable } from 'angularfire2';

export class Issue {

  public iid: string = '';
  public lat: number = 0;
  public long: number = 0;
  public title: string = '';
  public description: string = '';
  public photos: string[] = [''];
  public author: string = '';
  public solved: boolean = false;
  public city: string = '';
  public state: string = '';
  public country: string = '';
  public date_created: number = 0;
  public date_solved: number = 0;
  public likes_uids: string[] = [];

  constructor() {
  }

}
