import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [() => {
      const authService = inject(AuthService);
      const router = inject(Router);
      return authService.isAuthenticated$.pipe(
        map(isAuthenticated => {
          if (!isAuthenticated) {
            return router.createUrlTree(['/login']);
          }
          return true;
        })
      );
    }]
  }
];
