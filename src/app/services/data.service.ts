import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Model } from '../model/model';
import { BehaviorSubject } from 'rxjs';

interface ApiResponse {
  response?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isBrowser: boolean = false;
  models: Record<string, Model> = {};
  private modelsSubject = new BehaviorSubject<Record<string, Model>>({});
  models$ = this.modelsSubject.asObservable();

  user: any;

  subdomain: string | undefined = undefined;

  supabase: any;

  url: string = '';
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  setModels() {
    this.modelsSubject.next(this.models);
  }

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.url = window.localStorage.getItem('url') || '';

      // API - MODELS
      this.models =
        JSON.parse(window.localStorage.getItem('models') || '[]') || [];
      this.fetchModels();
    }
  }

  changeUrl(url: string) {
    this.url = url;
    window.localStorage.setItem('url', url);
    console.log('URL Changed');
    this.fetchModels();
  }

  async fetchModels() {
    console.log(this.url);
    try {
      const response = await fetch(`${this.url}/models`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      this.models = ((await response.json()) as ApiResponse).response;
      window.localStorage.setItem('models', JSON.stringify(this.models));
      this.setModels();
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  }

  async sendPromptToAPI(
    inputText: string,
    model: string,
    history: Array<{ role: string; message: string }>,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${this.url}/generate`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          prompt: inputText,
          model: model,
          history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          onChunk(chunk);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
