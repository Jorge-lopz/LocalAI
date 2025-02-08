import { Component, Input } from '@angular/core';
import { Bubble } from '../../model/bubble';

@Component({
  selector: 'app-bubble',
  standalone: false,
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.css'],
})
export class BubbleComponent {
  @Input() bubble!: Bubble;
}
