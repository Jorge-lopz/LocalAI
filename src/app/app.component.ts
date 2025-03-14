import { Component, ViewChild } from '@angular/core';
import { DataService } from './services/data.service';
import swal from 'sweetalert2';

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
  remote: boolean = false;

  constructor(public data: DataService) {
    if (data.isBrowser) {
      this.remote = window.localStorage.getItem('remote') === 'true';
    }
  }

  clearBubbles() {
    if (this.data.isBrowser) {
      window.localStorage.removeItem('bubbles');
      window.location.reload();
    }
  }

  getDomain(url: string): string {
    return new URL(url).hostname;
  }

  async toggleRemote() {
    if (this.remote) {
      this.remote = false;
      window.localStorage.setItem('remote', 'false');
      this.data.changeUrl('localhost:8080');
      window.location.reload();
    } else {
      const { value: url } = await swal.fire({
        input: 'url',
        theme: 'dark',
        inputLabel: 'Server URL address',
        inputPlaceholder: 'Enter the URL',
      });
      if (url) {
        window.localStorage.setItem('remote', 'true');
        this.remote = true;
        this.data.changeUrl('https://' + this.getDomain(url));
        window.location.reload();
      }
    }
  }
}
