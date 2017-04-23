import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { NgProgressService } from "ng2-progressbar";

import { MapService } from '../../services/map.service';
import { GeocodingService } from '../../services/geocoding.service';
import { DataApiService } from '../../services/data-api.service';
import { LngLat } from 'mapbox-gl';

import { Issue } from '../../core/issue';

@Component({
  selector: 'app-issue-form',
  templateUrl: './issue-form.component.html',
  styleUrls: ['./issue-form.component.scss']
})
export class IssueFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;


  private issue: Issue;
  private added: boolean;
  private error: string;

  private loadingImages: boolean = false;
  private submitAfterLoadingImages: boolean = false;
  private showWaitingPopup: boolean = false;

  private photos: any[] = [];

  constructor(
    private mapService: MapService,
    private geocoder: GeocodingService,
    private data: DataApiService,
    private pService: NgProgressService
  ) {

    this.issue = new Issue();

    this.updateGeo();

    this.added = false;
    this.error = "";
  }

  ngOnInit() {

    this.mapService.map.on('moveend', this.updateGeo.bind(this));

  }

  updateGeo() {

    let center: LngLat = this.mapService.map.getCenter();
    let latlng: any = {};
    latlng.longitude = center.lng;
    latlng.latitude = center.lat;
    this.geocoder.buildLocation(latlng)
      .subscribe(location => {
        this.issue.city = location.address.city;
        this.issue.state = location.address.state;
        this.issue.country = location.address.country;
      },
      error => {
        // console.error(error);
        this.issue.city = '';
        this.issue.state = '';
        this.issue.country = '';
      }
      );

    this.issue.lat = center.lat;
    this.issue.long = center.lng;

  }

  clearWaitingPopup() {
    this.showWaitingPopup = false;
  }

  checkWaitingPopup() {
    if(this.loadingImages) {
      this.showWaitingPopup = true;
    }
  }

  submitForm() {
    if(this.loadingImages) {
      this.submitAfterLoadingImages = true;
      return;
    }
    this.pService.start();

    this.issue.solved = false;
    this.issue.date_created = new Date().getTime();
    this.issue.photos = this.photos.map(photo => photo.downloadURL);
    this.data.addIssue(this.issue)
      .then(() => this.successAdding())
      .catch(err => this.failAdding(err));
  }

  successAdding() {
    this.added = true;
    this.issue = new Issue();
    this.photos = [];
    this.pService.done();
  }

  failAdding(err) {
    console.log(err);
    this.error = "Error, try again.";
  }

  closeDialog() {
    this.added = false;
  }

  openFileSelection() {
    this.fileInput.nativeElement.click();
  }

  onSelectFile(event) {
    this.loadingImages = true;
    // max 5 files
    let files: any[] = [];
    for (let i = 0; i < 5 && i < event.srcElement.files.length;i++) {

      files.push(event.srcElement.files[i]);

    }

    this.pService.start();

    let percentile = 1/files.length;
    let tasks = files.map(file => this.data.uploadPhoto(file, file.type) );

    let promises = tasks.map(task => {

      return new Promise<any>( (resolve, reject) => {

        let lastProgress = 0;
        task.task.subscribe(

          state => {

            let delta = state.progress * percentile - lastProgress;
            this.pService.inc(delta);
            lastProgress = state.progress * percentile;

          },
          err => reject,
          () => resolve({
            downloadURL: task.downloadURL,
            name: task.file.name,
            ref: task.ref
          })
        );
      });
    });

    Promise.all(promises).then((files) => {
      this.pService.done();
      this.photos = this.photos.concat(files);
      this.loadingImages = false;

      if (this.submitAfterLoadingImages) {
        this.submitForm();
        this.submitAfterLoadingImages = false;
      }

    }).catch(err => console.log);

  }

  removePhoto(index) {
    this.photos[index].ref.delete().then(() => {

      this.photos.splice(index, 1);

    }).catch(console.log);
  }

}
