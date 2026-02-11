import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // 🚨 Not logged in
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role;
    const expectedRole = route.data?.['role'];

    // 🚫 Role mismatch
    if (expectedRole && userRole !== expectedRole) {

      // If USER tries to access ADMIN route
      if (userRole === 'USER') {
        router.navigate(['/invoice']);   // safe user page
      }

      // If somehow ADMIN tries wrong route (future-proofing)
      else {
        router.navigate(['/dashboard']);
      }

      return false;
    }

    // ✅ Role matches
    return true;

  } catch (error) {
    // Token broken or invalid
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return false;
  }
};
