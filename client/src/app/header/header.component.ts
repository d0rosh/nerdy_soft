import { Component, OnInit } from '@angular/core';
import { AuthServices } from '../core/auth/auth.service';
import { Router } from '@angular/router';
import { CurrentUser } from '../core/auth/auth.interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser$: CurrentUser;

  constructor(private authService: AuthServices, private router: Router) {}

  visibleBtn(): boolean {
    return this.authService.isAuthenticated();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(
      user => {
        this.currentUser$ = user;
      },
      err => console.log(err)
    );
  }
}
