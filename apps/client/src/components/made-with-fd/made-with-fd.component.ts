import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-made-with-fd',
  standalone: true,
  imports: [RouterLink],
  providers: [],
  templateUrl: './made-with-fd.component.html',
  styleUrls: ['./made-with-fd.component.scss'],
})
export class MadeWithFluentDocComponent {
  @Input() isPublicRoute: boolean = false;
  constructor() {}
}
