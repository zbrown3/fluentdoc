import {Component, Input, ViewEncapsulation} from '@angular/core';
import { SanitizeHtmlPipe } from '../../common/pipes/sanitize-html-pipe';

import { Story } from '../../../utils/types';

@Component({
  selector: 'app-view-language-stories',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [SanitizeHtmlPipe],
  providers: [],
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.scss'],
})
export class StoriesComponent {
  constructor() {}

  @Input() story?: Story = undefined;
  @Input() languageName?: string = '';
}
