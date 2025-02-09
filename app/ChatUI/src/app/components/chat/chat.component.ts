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
    new Bubble('hola', false),
    new Bubble('hola', true, this.data.models['deepseek-r1:1.5b']),
    new Bubble('hola', false),
    new Bubble('hola', true, this.data.models['deepseek-r1:1.5b']),
    new Bubble('hola', false),
    new Bubble('hola', true, this.data.models['deepseek-r1:1.5b']),
    new Bubble('hola', false),
    new Bubble('hola', true, this.data.models['deepseek-r1:1.5b']),
    new Bubble('hola', false),
    new Bubble('hola', true, this.data.models['deepseek-r1:1.5b']),
    new Bubble('hola', false),
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
  cambiarColor(button: HTMLButtonElement) {
    let rgba = window.getComputedStyle(button).backgroundColor;
    let [r, g, b, a = 1] = rgba.match(/[\d.]+/g)!.map(Number);
    let alpha = Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase();
    let colorButton = `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
      .toUpperCase()}${alpha}`;

    if (colorButton === '#00000000') {
      console.log(colorButton);
      button.style.backgroundColor = 'var(--primary-color)';
      return;
    } else {
      console.log(colorButton);
      button.style.backgroundColor = '#00000000';
      return;
    }
  }
}
