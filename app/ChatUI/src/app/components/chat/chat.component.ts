import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Bubble } from '../../model/bubble';
import { DataService } from '../../services/data.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  data = new DataService();
  bubbles: Bubble[] = [];
  isBrowser: boolean;

  constructor(data: DataService, @Inject(PLATFORM_ID) platformId: any) {
    this.data = data;
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      console.log('Is browser'); // INFO Here
      this.bubbles = JSON.parse(window.localStorage.getItem('bubbles') || '[]');
    }
  }

  text: string = '';

  onPromptChange(event: Event): void {
    let target = event.target as HTMLTextAreaElement;
    this.text = target.value;
    target.style.height = 'auto';
    target.style.height =
      Math.min(
        target.scrollHeight,
        parseInt(getComputedStyle(target).maxHeight)
      ) + 'px';
  }
  onPromptSent(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.bubbles.push(new Bubble(this.text, false));
      if (this.isBrowser) {
        window.localStorage.setItem('bubbles', JSON.stringify(this.bubbles)); // TODO - Cypher it beforehand with user-specific key form DB
      }
      // TODO Call API
    }
  }
}
