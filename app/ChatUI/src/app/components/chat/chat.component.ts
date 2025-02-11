import { Component } from '@angular/core';
import { Bubble } from '../../model/bubble';
import { DataService } from '../../services/data.service';
import { Model } from '../../model/model';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  bubbles: Bubble[] = [];

  constructor(private data: DataService) {
    if (data.isBrowser) {
      let storedBubbles = window.localStorage.getItem('bubbles');
      if (storedBubbles) {
        this.bubbles = JSON.parse(storedBubbles).map(
          (b: any) =>
            new Bubble(
              b.message,
              b.response,
              Object.values(data.models).find(
                (value: any) => value.id === b.model
              ) as Model
            )
        );
        console.log(this.bubbles);
      }
    }
  }

  ngAfterViewInit() {
    if (this.data.isBrowser) {
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
      console.log(this.bubbles);
      setTimeout(() => {
        window.scrollTo({
          top: document.querySelector('#bubbles')!.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
      // TODO Call API
    }
  }

  exportData() {
    // TODO export data
  }
}
