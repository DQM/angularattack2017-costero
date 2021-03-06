import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {
  private user: any;
  private options: Array<any> = [
    { text: 'My issues'},
    { text: 'Logout'}
  ];;

  constructor(private auth: AuthService) {
    auth.getUser().subscribe(
      user => {
        this.user = user;
      }
    );
  }

  ngOnInit() { }

  private getUser() {
    this.auth.getUser().subscribe(
      user => {
        this.user = user;
      }
    );
  }

  public login() {
    this.auth.login()
      .then(() => this.getUser())
      .catch(err => console.log(err));
  }

  public logout() {
    this.auth.logout();
    this.user = null;
  }

}
