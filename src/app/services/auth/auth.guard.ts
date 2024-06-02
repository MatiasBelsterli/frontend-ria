import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (!localStorage.getItem('token')) {
    router.navigate(['/login']);
    return false;
  }
  if (route.data['roles'].includes(localStorage.getItem('role'))) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (!localStorage.getItem('token')) {
    return true;
  }

  router.navigate(['/']);
  return false;
}
