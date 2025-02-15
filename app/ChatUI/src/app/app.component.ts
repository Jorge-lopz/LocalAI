import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(public dataService: DataService) {}
  openProfile() {
    this.dataService.checkUserSession().then((isLoggedIn) => {
      if (isLoggedIn) {
        // TODO - Open profile dialog
      } else {
        //this.data;
      }
    });
  }
}
