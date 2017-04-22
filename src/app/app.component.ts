import { Component } from '@angular/core';

import { DataApiService } from "./data-api.service";
import { Issue } from "./issue";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  private issues : any;

  constructor(data: DataApiService) {

    let issue = new Issue();
    issue.title = 'geo';
    issue.lat = -7.140095;
    issue.long = -34.851654;
    // data.addIssue(issue);

    this.issues = data.getIssuesAround([-8.0431353, -35.0062387], 2);
    console.log(this.issues);


  }

}
