import {Component, FORM_DIRECTIVES, OnInit, Renderer} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {GoogleMap} from './google_map.component';
import 'rxjs/Rx';

@Component({
  selector: 'my-app',
  templateUrl: 'app/google_map/app.component.html',
  styleUrls: ['app/google_map/app.component.css'],
  directives: [GoogleMap]
})
export class AppComponent {
  markers: google.maps.MarkerOptions[] = [];
  heatmapData: google.maps.LatLng[] = [];
  zoom: number = 8; // 20 is max
  center: google.maps.LatLng = new google.maps.LatLng(50.4333, 30.5167);
  markersLocalTime: any[] = [];
  myLocalTime:any;
  isGettingMyTime:boolean;

  constructor( private http: Http ) {
  }
  
  addLocation(position: google.maps.LatLng) {
    let locationData:any;
    let queryAddress = 'https://maps.googleapis.com/maps/api/timezone/json?location='
      + position.lat() +','+ position.lng() 
      + '&timestamp=' + this.getCurrentTimestamp()
      + '&key=AIzaSyCTvkmrEfvM7IwoK-gLWb36b4DobbFdEas';
    this.http.get(queryAddress)
      .map(response => response.json())
      .subscribe(
        data => {
          if (data.status !== 'ZERO_RESULTS') {
            this.addMarker(position);
            this.addLocalTime(this.calcTime(data.dstOffset + data.rawOffset), data.timeZoneId);
          }
        },
        err => console.error(err),
        () => console.log('done')
      );
  }

  addLocalTime(localTime:string, timeZoneId:string) {
    this.markersLocalTime = this.markersLocalTime.concat([{
      localTime: localTime, 
      timeZoneId: timeZoneId
    }]);
  }

  addMarker(position: google.maps.LatLng) {
    // this.markers.push() won't work. It won't trigger change event.
    this.markers = this.markers.concat([{
      position: position,
      label: 'A',
      title: 'Click me to delete.'
    }]);
  }

  getMyTime() {
    this.isGettingMyTime = true;
    this.getLocalTime();
  }

  getLocalTime() {
    this.http.get('http://ip-api.com/json')
      .map(response => response.json())
      .subscribe(
        data => {
          this.getLocation(new google.maps.LatLng(data.lat, data.lon));
        },
        err => console.error(err),
        () => console.log('done')
      );
  }

  getLocation(position: google.maps.LatLng) {
    let locationData:any;
    let queryAddress = 'https://maps.googleapis.com/maps/api/timezone/json?location='
      + position.lat() +','+ position.lng() 
      + '&timestamp=' + this.getCurrentTimestamp()
      + '&key=AIzaSyCTvkmrEfvM7IwoK-gLWb36b4DobbFdEas';
    this.http.get(queryAddress)
      .map(response => response.json())
      .subscribe(
        data => {
          if (data.status !== 'ZERO_RESULTS') {
            this.myLocalTime = this.calcTime(data.dstOffset + data.rawOffset);
          }
        },
        err => console.error(err),
        () => console.log('done')
      );
  }

  calcTime(offset:number) {
    let d = new Date();
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    return this.getFormattedTime(new Date(utc + (1000*offset)));
  }
  
  getFormattedTime(d:Date) {
    return ('0' + d.getHours()).slice(-2) + ':' 
      + ('0' + d.getMinutes()).slice(-2) + ':' 
      + ('0' + d.getSeconds()).slice(-2);
  }

  getCurrentTimestamp() {
    return Date.now() / 1000;
  }

  removeItems() {
    this.removeMarker();
    this.removeLocalTime();
  }

  removeMarker() {
    // this.markers.pop() won't work. It won't trigger change event.
    this.markers = this.markers.slice(0, -1);
  }

  removeLocalTime() {
    // this.markersLocalTime.pop() won't work. It won't trigger change event.
    this.markersLocalTime = this.markersLocalTime.slice(0, -1);
  }
}