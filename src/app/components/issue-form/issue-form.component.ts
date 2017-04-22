import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.css']
})
export class IssueFormComponent implements OnInit {
  public opened: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  submitForm() {
    this.opened = true;
  }

  close() {
    this.opened = false;
  }

}
