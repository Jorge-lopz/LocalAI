import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  isOpen: boolean = false;

  email = 'jlpenero2005@gmail.com';

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
