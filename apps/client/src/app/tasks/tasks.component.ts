import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import {
  FaIconComponent,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faPlus, faTasks, faTimes } from '@fortawesome/free-solid-svg-icons';
import { TaskService } from '../services/task-service/task.service';
import { SUCCESS_STATUS } from '../common/utils/constants';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    FaIconComponent,
    DatePipe,
    NgIf,
    NgForOf,
    LoadingSpinnerComponent,
  ],
  providers: [],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  loading = true;

  // modalRef: BsModalRef;
  response: any;

  tasks: any = [];
  showCompletedTasks = false;
  hasCompletedTask = false;

  taskFormSubmitted = false;
  taskForm = new FormGroup({
    task: new FormControl('', [Validators.required]),
    completed: new FormControl(false),
  });
  // convenience getter for easy access to form fields
  get f() {
    return this.taskForm.controls;
  }

  // labelForm: FormGroup;
  // labelFormSubmitted = false;
  // this.labelForm = this.formBuilder.group({
  //     name: ['', [Validators.required]],
  //     color: ['', [Validators.required]]
  // });
  //
  //
  // // convenience getter for easy access to form fields
  // get l() {
  //     return this.labelForm.controls;
  // }
  //
  // label: string;

  ngOnInit() {
    /** spinner starts on init */
    this.spinner.show();
    // load incomplete user tasks
    this.getIncompleteTasks();
  }

  constructor(
    library: FaIconLibrary,
    private taskService: TaskService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    library.addIcons(faTasks, faPlus, faTimes);
  }

  getIncompleteTasks() {
    // load user tasks
    const userId: string | null = localStorage.getItem('userId');
    this.taskService.getUserTasks(userId).subscribe({
      next: (response: any) => {
        this.tasks = response['data']['tasks'];
        this.hasCompletedTask = this.hasAtLeastOneCompletedTask();
        if (!this.showCompletedTasks) {
          // filter complete tasks
          this.tasks = this.tasks.filter(function (value: any) {
            return value.completed === false;
          });
        }
        this.spinner.hide();
        this.loading = false;
      },
      error: () => {
        this.toastr.error('An error occurred. Please try again later.');
      },
    });
  }

  /**
   * Format time using Moment.js for data like:
   * 20 minutes ago
   * @param date
   */
  // formatTimeFromNow(date: string) {
  //     const formattedDate = moment(date);
  //     return (moment(formattedDate).fromNow());
  // }

  hasAtLeastOneCompletedTask() {
    let hasCompletedTask = false;
    for (let i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].completed) {
        hasCompletedTask = true;
      }
    }
    return hasCompletedTask;
  }

  toggleCompletedTasks() {}

  addTask() {
    this.taskFormSubmitted = true;

    // stop here if form is invalid
    if (this.taskForm.invalid) {
      return;
    }

    const taskData: any = {
      task: this.taskForm.controls.task.value,
      creatorId: localStorage.getItem('userId'),
    };

    this.taskService.addTask(taskData).subscribe({
      next: (response) => {
        this.response = response;
        if (this.response['status'] === SUCCESS_STATUS) {
          this.tasks = this.response['data']['tasks'];
          this.toastr.success('Task added successfully.');
        } else {
          this.toastr.error('An error occurred. Please try again later.');
        }
        this.resetTaskForm();
      },
      error: () => {
        this.toastr.error('An error occurred. Please try again later.');
        this.resetTaskForm();
      },
    });
  }

  removeTask(id: string) {
    this.taskService.deleteTask(id).subscribe({
      next: (response) => {
        this.response = response;
        if (this.response['status'] === SUCCESS_STATUS) {
          this.tasks = this.response['data']['tasks'];
          this.toastr.success('Task deleted successfully.');
        } else {
          this.toastr.error('An error occurred. Please try again later.');
        }
      },
      error: () => {
        this.toastr.error('An error occurred. Please try again later.');
      },
    });
  }

  completeTask(event: any, id: string) {
    this.taskService.completeTask(event.currentTarget.checked, id).subscribe({
      next: (response: any) => {
        this.response = response;
        if (this.response['status'] === SUCCESS_STATUS) {
          this.tasks = this.response['data']['tasks'];
          this.toastr.success('Task updated successfully.');
        } else {
          this.toastr.error('An error occurred. Please try again later.');
        }
      },
      error: () => {
        this.toastr.error('An error occurred. Please try again later.');
      },
    });
  }

  resetTaskForm() {
    // reset form
    this.taskFormSubmitted = false;
    this.taskForm.reset();
  }
}
