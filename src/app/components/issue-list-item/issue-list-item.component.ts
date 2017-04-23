import { Component, OnInit, Input } from '@angular/core';

import { Issue } from '../../core/issue';

@Component({
  selector: 'app-issue-list-item',
  templateUrl: './issue-list-item.component.html',
  styleUrls: ['./issue-list-item.component.scss']
})
export class IssueListItemComponent implements OnInit {

  @Input() issue: Issue;

  constructor() { }

  ngOnInit() {
  }

}
