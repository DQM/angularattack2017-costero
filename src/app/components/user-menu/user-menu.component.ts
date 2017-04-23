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
        console.log(user);
        this.user = user;
      }
    );
  }

  ngOnInit() { }

  public itemClick(dataItem: any): void {
    // console.log(`You clicked ${dataItem.text}`);
    if (dataItem.text == "Logout") {
      this.auth.logout();
      this.user = null;
    } else if (dataItem.text == "My issues") {
      console.log("My Issues");
    }
  }

  private getUser() {
    this.auth.getUser().subscribe(
      user => {
        console.log(user);
        this.user = user;
      }
    );
  }

  public login() {
    this.auth.login()
      .then(() => this.getUser())
      .catch(err => console.log(err));
  }

}
