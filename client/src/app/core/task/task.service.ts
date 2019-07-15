import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  constructor(private http: HttpClient, private socket: Socket) {}

  private domain = environment.domain;

  registerSocket(email) {
    this.socket.emit('register', email);
  }

  getData() {
    return this.socket.fromEvent<any>('private_chat').pipe(map(res => res));
  }

  setTask(task): Observable<any> {
    return this.http.post<any>(`${this.domain}/task/set_task`, {
      name: task.name
    });
  }

  editTask(task): Observable<any> {
    return this.http.put<any>(`${this.domain}/task/edit_task`, task);
  }

  getTasks(): Observable<any> {
    return this.http.get<any>(`${this.domain}/task/get_tasks`);
  }

  deleteTask(task): Observable<any> {
    return this.http.delete<any>(`${this.domain}/task/delete_task/${task._id}`);
  }

  shareTask(_id: string, _email: string): void {
    this.http
      .post<any>(`${this.domain}/task/share_task`, { email: _email, id: _id })
      .subscribe(res => {
        this.socket.emit('private_chat', {
          to: _email
        });
      });
  }
}
