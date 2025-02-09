import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  models = {
    'deepseek-r1:1.5b': {
      avatar: 'models/deepseek.svg',
      name: 'Deepseek-r1 (1.5b)',
      id: '2',
    },
    'llama3.2:3b': {
      avatar: 'models/llama.svg',
      name: 'Llama 3.2 (3b)',
      id: '3',
    },
    'deepseek-llm:7b': {
      avatar: 'models/deepseek.svg',
      name: 'Deepseek llm (7b)',
      id: '4',
    },
    'deepseek-coder:6.7b': {
      avatar: 'models/deepseek.svg',
      name: 'Deepseek coder (6.7b)',
      id: '5',
    },
  };

  constructor() {}
}
