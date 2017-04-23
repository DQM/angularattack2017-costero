import { Component, OnInit } from '@angular/core';

import { Issue } from '../../core/issue';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss']
})
export class MapSidebarComponent implements OnInit {
  private recentIssues: any;
  private addReport: boolean = false;

  constructor(private data: DataApiService) {
    this.recentIssues = this.data.getRecentIssues();
  }

  ngOnInit() { }

  public openDialog() {
    this.addReport = true;
  }

  public closeDialog(cause?: string) {
    this.addReport = false;
    console.log("Closing...");
  }

}
