import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Issue } from '../../core/issue';
import { DataApiService } from '../../services/data-api.service';

@Component({
  selector: 'app-map-sidebar',
  templateUrl: './map-sidebar.component.html',
  styleUrls: ['./map-sidebar.component.scss']
})
export class MapSidebarComponent implements OnInit {
  private recentIssues: Observable<Issue[]>;
  private topIssues: Observable<Issue[]>;
  private myIssues: Observable<Issue[]>;
  public addReport: boolean = false;

  constructor(private data: DataApiService) {
    this.recentIssues = this.data.getRecentIssues();
    this.topIssues = this.data.getTopIssues();
    this.myIssues = this.data.getMyIssues();
  }

  ngOnInit() { }

  public openDialog() {
    this.addReport = true;
  }

  public closeDialog(cause?: string) {
    this.addReport = false;
  }

}
