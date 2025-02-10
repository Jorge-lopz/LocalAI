import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  url = 'https://nutrition-activists-eminem-brisbane.trycloudflare.com';
  models: any;

  constructor() {
    this.fetchModels();
  }

  async fetchModels() {
    try {
      const response = await fetch(this.url + '/models', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        mode: 'cors',
      });

      // TODO problema con el CORS por algún motivo

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      this.models = await response.json();
      console.log('Models:', this.models);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  }
}
