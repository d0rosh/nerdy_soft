import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TaskService } from './task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
  task: { _id?: string; name?: string } = { _id: '', name: '' };
  email: string;
  subscriptions: Subscription[] = [];
  dataTasks: Array<{ _id: string; name: string }>;

  constructor(
    private snackBar: MatSnackBar,
    private taskService: TaskService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.taskService.getTasks().subscribe(
        data => {
          this.dataTasks = data.tasks.reduce((acc, task, index) => {
            let cloned = { ...task, emails: [] };

            data.emails.forEach(data => {
              if (data.task_id === cloned._id) {
                cloned.emails.push(data.user_email);
              }
            });
            acc[index] = { ...cloned };
            return acc;
          }, []);
        },
        err => console.log(err)
      )
    );

    this.subscriptions.push(
      this.taskService.getData().subscribe(data => {
        this.dataTasks = data.data;
      })
    );
  }

  saveTask() {
    if (this.task['_id']) {
      this.subscriptions.push(
        this.taskService.editTask(this.task).subscribe(
          res => {
            this.snackBar.open('Successfully updated task!', 'Close', {
              duration: 2000,
              panelClass: 'green-snackbar',
              verticalPosition: 'top'
            });
          },
          err => console.log(err)
        )
      );
      this.task = { _id: '', name: '' };
    } else {
      if (this.task['name']) {
        this.subscriptions.push(
          this.taskService.setTask(this.task).subscribe(
            res => {
              this.dataTasks = [...this.dataTasks, res];
              this.snackBar.open('Successfully added task!', 'Close', {
                duration: 2000,
                panelClass: 'green-snackbar',
                verticalPosition: 'top'
              });
            },
            err => console.log(err)
          )
        );
        this.task = { _id: '', name: '' };
      } else {
        this.snackBar.open('This field must not be empty!', 'Close', {
          duration: 2000,
          panelClass: 'red-snackbar',
          verticalPosition: 'bottom'
        });
      }
    }
  }

  editTask(elem) {
    this.task = elem;
  }

  deleteTask(elem) {
    this.subscriptions.push(
      this.taskService.deleteTask(elem).subscribe(
        res => {
          this.dataTasks = this.dataTasks.filter(task => task._id != elem._id);
          this.snackBar.open('Successfully deleted task!', 'Close', {
            duration: 2000,
            panelClass: 'green-snackbar',
            verticalPosition: 'top'
          });
        },
        err => console.log(err)
      )
    );
  }

  shareEmail(task, email) {
    if (email.value) {
      this.taskService.shareTask(task._id, email.value);
      email.value = '';
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
