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
      let storedBubbles = window.localStorage.getItem('bubbles');
      if (storedBubbles) {
        this.bubbles = JSON.parse(storedBubbles).map(
          (b: any) => new Bubble(b.message, b.response, b.model)
        );
      }
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      window.scrollTo({
        top: document.querySelector('#bubbles')!.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  text: string = '';

  setHeight(target: HTMLTextAreaElement) {
    target.style.height = 'auto';
    target.style.height =
      Math.min(
        target.scrollHeight,
        parseInt(getComputedStyle(target).maxHeight)
      ) + 'px';
  }

  onPromptChange(event: Event): void {
    let target = event.target as HTMLTextAreaElement;
    this.text = target.value;
    this.setHeight(target);
  }
  onPromptSent(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.text.trim() === '') return; // Stop if empty input
      (event.target as HTMLTextAreaElement).value = '';
      this.setHeight(event.target as HTMLTextAreaElement);
      this.bubbles.push(new Bubble(this.text, false));
      this.text = '';
      window.localStorage.setItem('bubbles', JSON.stringify(this.bubbles)); // TODO - Cypher it beforehand with user-specific key form DB
      setTimeout(() => {
        window.scrollTo({
          top: document.querySelector('#bubbles')!.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
      // TODO Call API
    }
  }
}
