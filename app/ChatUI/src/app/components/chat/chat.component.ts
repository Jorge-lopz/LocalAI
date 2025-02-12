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
  search = false;
  coder = false;
  deepthink = false;
  text: string = '';
  selectedModel: Model | undefined = undefined;

  constructor(public data: DataService) {
    if (data.isBrowser) {
      let localStorage = window.localStorage;
      // GET MODEL
      let selectedModelId = localStorage.getItem('selected_model');
      if (!selectedModelId) {
        // If no model was previously selected
        this.selectedModel = Object.values(this.data.models).find(
          (model: any) => model.id === '9aab369a853b' // Deepseek-llm
        ) as Model;
        localStorage.setItem('selected_model', this.selectedModel.id);
      } else {
        this.selectedModel = Object.values(data.models).find(
          (model: any) => model.id === selectedModelId
        ) as Model;
      }
      // GET BUTTONS
      this.toggleButton('search', localStorage.getItem('search') == 'true');
      this.toggleButton('coder', localStorage.getItem('coder') == 'true');
      this.toggleButton(
        'deepthink',
        localStorage.getItem('deepthink') == 'true'
      );
      // GET BUBBLES
      let storedBubbles = localStorage.getItem('bubbles');
      if (storedBubbles) {
        this.bubbles = JSON.parse(storedBubbles).map(
          (b: any) =>
            ({
              message: b.message,
              response: b.response,
              model: Object.values(data.models).find(
                (value: any) => value.id === b.model
              ) as Model,
            } as Bubble)
        );
        console.log(this.bubbles);
      }
    }
  }

  ngAfterViewInit() {
    // Scroll down
    if (this.data.isBrowser) {
      window.scrollTo({
        top: document.querySelector('#bubbles')!.scrollHeight,
        behavior: 'smooth',
      });
      // Check model button
      (
        document.getElementById(
          this.selectedModel!.name.startsWith('Llama') ? 'llama' : 'deepseek'
        )! as HTMLInputElement
      ).checked = true;
    }
  }

  toggleButton(name: String, state: boolean | null = null) {
    switch (name) {
      case 'search':
        this.search = state != null ? state : !this.search;
        localStorage.setItem('search', this.search.toString());
        break;
      case 'coder':
        this.coder = state != null ? state : !this.coder;
        localStorage.setItem('coder', this.coder.toString());
        break;
      case 'deepthink':
        this.deepthink = state != null ? state : !this.deepthink;
        localStorage.setItem('deepthink', this.deepthink.toString());
        break;
    }
  }

  switchModel(name: String) {
    console.log(this.selectedModel);
    if (name === 'Llama')
      this.selectedModel = Object.values(this.data.models).find((model: any) =>
        model.name.startsWith('Llama')
      ) as Model;
    else if (name === 'Deepseek')
      this.selectedModel = Object.values(this.data.models).find(
        (model: any) => model.id === '9aab369a853b' // Deepseek-llm
      ) as Model;

    localStorage.setItem('selected_model', this.selectedModel!.id);
  }

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
      this.bubbles!.push({ message: this.text, response: false } as Bubble);
      this.text = '';
      localStorage.setItem('bubbles', JSON.stringify(this.bubbles)); // TODO - Cypher it beforehand with user-specific key form DB
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
