import { Component, Input } from '@angular/core';
import { QUILL_CONFIG } from '../common/utils/constants';
import { QuillEditorComponent } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { StoryService } from '../services/story-service/story.service.spec';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-story',
  standalone: true,
  imports: [QuillEditorComponent, FormsModule],
  providers: [StoryService],
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent {
  @Input() story: any = {};
  @Input() languageId: string = '';
  @Input() languageName: string = '';

  protected readonly QUILL_CONFIG = QUILL_CONFIG;

  constructor(
    private storyService: StoryService,
    private toastr: ToastrService,
  ) {}

  getPlaceholderTitle() {
    return `The World of ${this.languageName}`;
  }

  saveStory() {
    this.storyService.updateStory(this.story).subscribe({
      next: () => {
        this.toastr.success('Story updated successfully');
      },
      error: () => {
        this.toastr.error('There was an error!');
      },
    });
  }
}
