import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = this.authService.getCurrentUser();
    const token = localStorage.getItem('authToken');

    //consolele.log('AuthGuard - Current user:', currentUser); // Debug log
    //consolele.log('AuthGuard - Token:', token); // Debug log

    if (currentUser && token) {
      //consolele.log('AuthGuard - Valid authentication found'); // Debug log
      return true;
    }

    //consolele.log('AuthGuard - No valid authentication, redirecting to login'); // Debug log
    this.router.navigate(['/login']);
    return false;
  }
}