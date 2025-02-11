import { Model } from './model';

export interface Bubble {
  message: string;
  response: boolean;
  model: Model | null;
}
