import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { User, NewUser, CurrentUser } from './auth.interfaces';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  constructor(private http: HttpClient) {}

  private token: string = null;
  private user$: BehaviorSubject<CurrentUser> = new BehaviorSubject(null);
  private domain = environment.domain;

  login(user: User): Observable<{ token: string; user: any }> {
    console.log(this.domain);
    return this.http
      .post<{ token: string; user: any }>(`${this.domain}/auth/login`, user)
      .pipe(
        tap(({ token, user }) => {
          localStorage.setItem('token', token);
          this.setToken(token);
          this.setCurrentUser(user);
        }),
        catchError(this._handleError)
      );
  }

  setToken(token: string): void {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.setToken(null);
    localStorage.clear();
    this.setCurrentUser(null);
  }

  signUp(user: NewUser): Observable<NewUser> {
    return this.http
      .post<NewUser>(`${this.domain}/auth/signup`, user)
      .pipe(catchError(this._handleError));
  }

  iniCurrentUser() {
    this.http.get<CurrentUser>(`${this.domain}/profile/current_user`).subscribe(
      user => {
        this.setCurrentUser(user);
        this.setToken(localStorage.getItem('token'));
      },
      err => {
        localStorage.clear();
        this.setToken(null);
        this.setCurrentUser(null);
      }
    );
  }

  setCurrentUser(user): void {
    if (user) {
      user.avatar = user.avatar == '' ? 'assets/img/user.png' : user.avatar;
    }
    this.user$.next(user);
  }

  getCurrentUser(): Observable<CurrentUser> {
    return this.user$;
  }

  private _handleError(err: HttpErrorResponse) {
    return throwError(err.error.message);
  }
}
