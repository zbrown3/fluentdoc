import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-ellipsis',
  standalone: true,
  templateUrl: './ellipsis.component.html',
  imports: [NgForOf],
  providers: [],
  styleUrls: ['./ellipsis.component.scss'],
})
export class EllipsisComponent {}
