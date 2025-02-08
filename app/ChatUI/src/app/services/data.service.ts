import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  models = {
    'deepseek-coder:1.3b': {
      avatar: 'deepseek.svg',
      name: 'Deepseek coder (1.3b)',
      id: '1',
    },
    'deepseek-r1:1.5b': {
      avatar: 'deepseek.svg',
      name: 'Deepseek-r1 (1.5b)',
      id: '2',
    },
    'llama3.2:3b': {
      avatar: 'llama.svg',
      name: 'Llama 3.2 (3b)',
      id: '3',
    },
    'deepseek-llm:7b': {
      avatar: 'deepseek.svg',
      name: 'Deepseek llm (7b)',
      id: '4',
    },
    'deepseek-coder:6.7b': {
      avatar: 'deepseek.svg',
      name: 'Deepseek coder (6.7b)',
      id: '5',
    },
    'deepseek-r1:8b': {
      avatar: 'deepseek.svg',
      name: 'Deepseek-r1 (8b)',
      id: '6',
    },
  };

  constructor() {}
}
