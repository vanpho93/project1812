import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppState } from './types';
import { Request } from './services/request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private store: Store<AppState>, private request: Request) {
    this.testService();
  }

  testService() {
    this.request.get('/abcd')
  }
}
