import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoreComponent } from './core.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CoreComponent,
    children: [
      {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: './task/task.module#TaskModule'
      },
      {
        path: 'auth',
        canActivate: [AuthGuard],
        loadChildren: './auth/auth.module#AuthModule',
        data: { isAuth: true }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
