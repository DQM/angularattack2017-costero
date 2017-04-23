import { Component, OnInit, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { DataApiService } from '../../services/data-api.service';
import { Issue } from '../../core/issue';

@Component({
  selector: 'app-issue-list-item',
  templateUrl: './issue-list-item.component.html',
  styleUrls: ['./issue-list-item.component.scss']
})
export class IssueListItemComponent implements OnInit {

  @Input() issue: Issue;
  @Input() showOwnerActions: boolean = false;

  private likes: Observable<number> = Observable.of(0);
  private hasLiked: Observable<boolean> = Observable.of(false);
  private owned: Observable<boolean> = Observable.of(false);

  constructor(private data: DataApiService, private auth: AuthService) {


  }

  ngOnInit() {
    // console.log(this.issue);
    this.hasLiked = this.data.hasLiked((<any>this.issue).$key);
    this.likes = this.data.getTotalLikes((<any> this.issue).$key);

    this.owned = this.auth.getUser().map(user => user.uid == this.issue.author);
  }

  toggleLike() {

    this.hasLiked.first().subscribe(

      liked => {
        if(liked) {
          this.data.removeLike((<any>this.issue).$key).then().catch(console.log);
        } else {
          this.data.performLike((<any>this.issue).$key).then().catch(console.log);;
        }
      }

    );

  }

  toggleSolve() {
    this.data.solveIssue((<any>this.issue).$key, !this.issue.solved).then().catch(console.log);
  }

  delete() {
    this.data.deleteIssue((<any>this.issue).$key).then().catch(console.log);
  }

}
