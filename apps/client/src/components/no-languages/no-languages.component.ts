import {Component, Input} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-languages',
  standalone: true,
  imports: [RouterLink],
  providers: [],
  templateUrl: './no-languages.component.html',
  styleUrls: ['./no-languages.component.scss'],
})
export class NoLanguagesComponent {
  @Input() isPublicRoute: boolean = false;
  constructor() {}
}
