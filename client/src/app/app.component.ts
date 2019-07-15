import { Component, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationEnd
} from '@angular/router';
import { AuthServices } from './core/auth/auth.service';
import { TaskService } from './core/task/task.service';
import { CurrentUser } from './core/auth/auth.interfaces';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {
  isLoadingPage: boolean;
  subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private authService: AuthServices,
    private taskService: TaskService
  ) {
    this.isLoadingPage = true;
  }

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.authService.setToken(localStorage.getItem('token'));
      this.authService.iniCurrentUser();
      this.subscriptions.push(
        this.authService.getCurrentUser().subscribe((user: CurrentUser) => {
          user ? this.taskService.registerSocket(user.email) : null;
        })
      );
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.isLoadingPage = true;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          this.isLoadingPage = false;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
