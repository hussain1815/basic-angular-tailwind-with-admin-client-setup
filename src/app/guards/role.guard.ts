import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // TEMPORARILY COMMENTED OUT FOR DEVELOPMENT - BYPASS ROLE CHECK
    const requiredRoles = route.data['roles'] as Array<string>;
    const userRole = localStorage.getItem('user_role');
    // console.log('this is userRole', userRole);

    // console.log('RoleGuard - Required roles:', requiredRoles);
    // console.log('RoleGuard - User role:', userRole);

    if (!userRole) {
      // console.log('RoleGuard - No user role found, redirecting to unauthorized');
      this.router.navigate(['/unauthorized']);
      return false;
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = requiredRoles.includes(userRole);
      // console.log('RoleGuard - Has required role:', hasRole);

      if (!hasRole) {
        // console.log('RoleGuard - User does not have required role, redirecting to unauthorized');
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    // console.log('RoleGuard - Access granted');
    // BYPASS: Always allow access for development
    return true;
  }
}