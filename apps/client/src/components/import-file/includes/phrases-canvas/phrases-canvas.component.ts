import {Component} from "@angular/core";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-phrases-canvas',
  standalone: true,
  templateUrl: './phrases-canvas.component.html',
  imports: [
    JsonPipe
  ],
  styleUrls: ['./phrases-canvas.component.scss']
})
export class PhrasesCanvasComponent {
  constructor() {
  }
}
