import { Routes } from '@angular/router';
export const routes: Routes = [
    {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
      path: 'home',
      loadComponent: () =>
        import('./components/public/home/home.component').then(m => m.HomeComponent)
    },
    {
      path: 'profile',
      loadComponent: () =>
        import('./components/customer/profile/profile.component').then(m => m.ProfileFormComponent)
    },
    {
      path: 'reservation',
      loadComponent: () =>
        import('./components/public/reservation/reservation.component').then(m => m.ReservationFormComponent)
    },
    { path: 'change-password', 
      loadComponent: () =>
        import('./components/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent)
    },
    {
      path: '',
      redirectTo: 'register',
      pathMatch: 'full'
    }
  ];