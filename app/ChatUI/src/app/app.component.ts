import { Component, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css',
})
export class AppComponent {
  @ViewChild('chatComponent') chatComponent: any;

  profileOpen: boolean = false;
  email: string | null = null;

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
        this.email = this.data.user?.email;
        this.profileOpen = !this.profileOpen;
      } else this.data.loginOAuth();
    });
  }
  async logout() {
    await this.data.logout();
    this.profileOpen = false;
    this.email = null;
    window.location.reload();
  }
}
