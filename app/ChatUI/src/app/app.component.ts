import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataService } from './services/data.service';
import { ProfileComponent } from './components/profile/profile.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('profileButton') profileButton!: ElementRef;
  @ViewChild(ProfileComponent) popupComponent!: ProfileComponent;

  constructor(public data: DataService) {}

  clearBubbles() {
    if (this.data.isBrowser) {
      window.localStorage.removeItem('bubbles');
      window.location.reload();
    }
  }

  openProfile() {
    this.data.checkUserSession().then((isLoggedIn) => {
      if (isLoggedIn) {
        console.log('Logged in');
        this.popupComponent.toggle();
      } else {
        this.data.loginOAuth();
      }
    });
  }
}
