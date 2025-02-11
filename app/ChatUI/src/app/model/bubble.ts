import { DataService } from '../services/data.service';
import { Model } from './model';

export class Bubble {
  constructor(
    private message: string,
    private response: boolean,
    private model: Model | null = null
  ) {}

  getMessage(): string {
    return this.message;
  }

  isResponse(): boolean {
    return this.response;
  }

  getModel(): Model | null {
    return this.model;
  }
}
