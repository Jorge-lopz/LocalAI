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
  bubbleContainer: any;
  search = false;
  coder = false;
  deepthink = false;
  text: string = '';
  loggedIn = false;
  selectedModel: Model | undefined = undefined;
  runningQuery = false;

  constructor(public data: DataService) {
    if (data.isBrowser && window.localStorage.length > 1) {
      let localStorage = window.localStorage;
      // GET MODEL
      let selectedModelId = localStorage.getItem('selected_model');
      if (!selectedModelId) {
        // If no model was previously selected
        this.selectedModel = Object.values(this.data.models).find(
          (model: any) => model.id === '357c53fb659c' // Qwen
        ) as Model;
        localStorage.setItem('selected_model', this.selectedModel.id);
      } else {
        this.selectedModel = Object.values(data.models).find(
          (model: any) => model.id === selectedModelId
        ) as Model;
      }
      this.init();
    }
  }

  async init() {
    // Check authentication
    if (await this.data.checkUserSession()) {
      this.loggedIn = true;
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
              model: b.model,
            } as Bubble)
        );
      }
    } else this.loggedIn = false;
  }

  ngAfterViewInit() {
    if (this.data.isBrowser) {
      this.bubbleContainer = document.querySelector('#bubbles')!;
      // Check model button
      (
        document.getElementById(
          this.selectedModel!.name.startsWith('Llama')
            ? 'llama'
            : this.selectedModel!.name.startsWith('Qwen')
            ? 'qwen'
            : 'deepseek'
        )! as HTMLInputElement
      ).checked = true;
      // Scroll down
      this.scrollDown();
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
        if (this.coder) this.toggleButton('deepthink', false);
        break;
      case 'deepthink':
        this.deepthink = state != null ? state : !this.deepthink;
        localStorage.setItem('deepthink', this.deepthink.toString());
        if (this.deepthink) this.toggleButton('coder', false);
        break;
    }
  }

  switchModel(name: String) {
    if (name === 'Deepseek')
      this.selectedModel = Object.values(this.data.models).find(
        (model: any) => model.id === '9aab369a853b' // Deepseek-llm
      ) as Model;
    else if (name === 'Qwen')
      this.selectedModel = Object.values(this.data.models).find((model: any) =>
        model.name.startsWith('Qwen')
      ) as Model;
    else if (name === 'Llama')
      this.selectedModel = Object.values(this.data.models).find((model: any) =>
        model.name.startsWith('Llama')
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

  exportData() {
    const jsonData = this.formatHistory(this.bubbles, true);
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: 'datos.json',
    });

    a.click();
    URL.revokeObjectURL(a.href);
  }

  async onEnterPressed(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (this.text.trim() === '') return; // Stop if empty input
      await this.sendPrompt(event.target! as HTMLTextAreaElement);
      this.text = '';
    }
  }

  scrollDown() {
    setTimeout(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      });
    }, 100);
  }

  async updatePromptUI(target: HTMLTextAreaElement) {
    target.value = '';
    this.setHeight(target);
    this.bubbles!.push({ message: this.text, response: false } as Bubble);
    this.scrollDown();
  }

  formatHistory(bubbles: Bubble[], fullHistory: boolean = false): any {
    const startIndex = fullHistory ? 0 : -12;
    const endIndex = fullHistory ? bubbles.length : -2;

    return bubbles.slice(startIndex, endIndex).map((bubble) => {
      return {
        role: bubble.response ? 'assistant' : 'user',
        content: bubble.message,
      };
    });
  }

  async sendPrompt(target: HTMLTextAreaElement) {
    // Check authentication
    if (!(await this.data.checkUserSession())) {
      this.data.loginOAuth();
      return;
    }
    if (this.text.trim() === '' || this.runningQuery) return;
    this.updatePromptUI(target);
    this.runningQuery = true;

    let bubble: Bubble | null = {
      message: '',
      response: true,
      model: this.selectedModel!,
    };
    this.bubbles.push(bubble);
    const activeModel = this.getActiveModel();

    this.data
      .sendPromptToAPI(
        this.text,
        activeModel,
        'medium',
        this.formatHistory(this.bubbles),
        (chunk: string) => {
          if (this.runningQuery == false) {
            bubble = null;
          }
          if (!bubble) return;
          bubble.message += chunk;
          // INFO - Scroll on response -> this.scrollDown();
        }
      )
      .then(() => {
        localStorage.setItem('bubbles', JSON.stringify(this.bubbles));
      })
      .catch((error) => {
        console.error('Error al enviar el prompt:', error);
      })
      .finally(() => {
        this.runningQuery = false;
      });
  }

  stopPrompt() {
    this.runningQuery = false;
    let field = document.getElementById('autoExpand')! as HTMLTextAreaElement;
    this.text = field.value;
    field.focus();
  }

  getActiveModel(): string {
    if (this.selectedModel?.name.startsWith('Deepseek'))
      return this.deepthink
        ? 'deepseek-r1:1.5b'
        : this.coder
        ? 'deepseek-coder:1.3b'
        : 'deepseek-llm:7b';
    else if (this.selectedModel?.name.startsWith('Qwen'))
      return this.coder ? 'qwen2.5-coder:3b' : 'qwen2.5:3b';
    else if (this.selectedModel?.name.startsWith('Llama')) return 'llama3.2:3b';
    else return 'error';
  }
}
