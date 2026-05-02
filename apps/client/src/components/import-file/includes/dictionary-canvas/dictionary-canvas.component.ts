import {Component} from "@angular/core";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-dictionary-canvas',
  standalone: true,
  templateUrl: './dictionary-canvas.component.html',
  imports: [
    JsonPipe
  ],
  styleUrls: ['./dictionary-canvas.component.scss']
})
export class DictionaryCanvasComponent {
  constructor() {
  }
}
