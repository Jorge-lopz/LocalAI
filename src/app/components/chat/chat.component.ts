import { Component } from '@angular/core';
import { Bubble } from '../../model/bubble';
import { DataService } from '../../services/data.service';
import { Model } from '../../model/model';
import { get } from 'node:http';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  bubbles: Bubble[] = [];
  bubbleContainer: any;
  text: string = '';
  selectedModel: Model | undefined = undefined;
  runningQuery = false;
  models: Model[] = [];

  constructor(public data: DataService) {
    if (data.isBrowser && window.localStorage.length > 1) {
      let localStorage = window.localStorage;
      // GET MODELS
      data.models$.subscribe((models) => {
        this.models = Object.values(models);
        let selectedModelId = localStorage.getItem('selected_model');
        this.selectedModel = this.models.find(
          (model) => model.id === selectedModelId
        );
        if (!this.selectedModel) {
          this.selectedModel = this.models[0];
          if (this.selectedModel?.id) {
            localStorage.setItem('selected_model', this.selectedModel?.id);
          }
        }
        if (this.models.length == 0) {
          let noModel = {
            avatar: '',
            name: 'NO MODELS AVAILABLE',
            id: '',
          };
          this.models.push(noModel);
          this.selectedModel = noModel;
        }
      });
      this.init();
    }
  }

  updateSelectedModel = () =>
    localStorage.setItem('selected_model', this.selectedModel!.id);

  async init() {
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
  }

  ngAfterViewInit() {
    if (this.data.isBrowser) {
      this.bubbleContainer = document.querySelector('#bubbles')!;
      // TODO - Initial model selector
      // Scroll down
      this.scrollDown();
    }
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
    if (this.text.trim() === '' || this.runningQuery) return;
    const activeModel = this.getActiveModel();
    if (!activeModel) return;
    this.updatePromptUI(target);
    this.runningQuery = true;

    let bubble: Bubble | null = {
      message: '',
      response: true,
      model: this.selectedModel!,
    };
    this.bubbles.push(bubble);

    this.data
      .sendPromptToAPI(
        this.text,
        activeModel,
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
    return Object.keys(this.data.models).find(
      (key) =>
        JSON.stringify(this.data.models[key]) ===
        JSON.stringify(this.selectedModel)
    )!;
  }
}
