import { isPlatformBrowser } from '@angular/common';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';

interface ApiResponse {
  response?: any;
}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  isBrowser: boolean;
  models: any = {};

  url = 'https://cart-controversy-generally-confusion.trycloudflare.com';
  headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.models =
        JSON.parse(window.localStorage.getItem('models') || '[]') || [];
      this.fetchModels();
    }
  }

  async fetchModels() {
    try {
      const response = await fetch(`${this.url}/models`, {
        method: 'GET',
        headers: this.headers,
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      this.models = ((await response.json()) as ApiResponse).response;
      window.localStorage.setItem('models', JSON.stringify(this.models));
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  }
}
