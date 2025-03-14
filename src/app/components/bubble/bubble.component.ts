import { Component, Input, DoCheck } from '@angular/core';
import { Bubble } from '../../model/bubble';
import { marked } from 'marked';
import hljs from 'highlight.js/lib/common';

@Component({
  selector: 'app-bubble',
  standalone: false,
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css'],
})
export class BubbleComponent {
  @Input() bubble!: Bubble;
  html = '';

  private previousMessage: string = '';

  ngAfterViewChecked(): void {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      hljs.highlightBlock(block as HTMLElement);
    });
  }

  async ngDoCheck() {
    if (this.bubble && this.bubble.message !== this.previousMessage) {
      this.html = await marked.parse(this.bubble.message);
      this.previousMessage = this.bubble.message;
    }
  }
}
