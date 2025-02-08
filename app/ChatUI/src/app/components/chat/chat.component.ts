import { Component } from '@angular/core';
import { Bubble } from '../../model/bubble';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-chat',
  standalone: false,
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  data = new DataService();

  constructor(data: DataService) {
    this.data = data;
  }

  bubbles = [
    new Bubble('hola', true, this.data.models['llama3.2:3b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['deepseek-r1:8b']),
    new Bubble('hola', true, this.data.models['llama3.2:3b']),
    new Bubble('adios', false),
  ];

  text: string = '';

  onPromptChange(event: Event): void {
    let target = event.target as HTMLTextAreaElement;
    this.text = target.value;
    target.style.height = 'auto';
    target.style.height =
      Math.min(
        target.scrollHeight,
        parseInt(getComputedStyle(target).maxHeight)
      ) + 'px';
  }
}
