import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { DataApiService } from '../../services/data-api.service';
import { Issue } from '../../core/issue';

@Component({
  selector: 'app-issue-list-item',
  templateUrl: './issue-list-item.component.html',
  styleUrls: ['./issue-list-item.component.scss']
})
export class IssueListItemComponent implements OnInit {

  @Input() issue: Issue;

  private likes: Observable<number> = Observable.of(0);

  constructor(private data: DataApiService,) {

  }

  ngOnInit() {
    // console.log(this.issue);
    this.likes = this.data.getTotalLikes((<any> this.issue).$key);
  }

}
