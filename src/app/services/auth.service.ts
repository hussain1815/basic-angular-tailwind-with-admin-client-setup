import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { User, LoginRequest, LoginResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check if user is already logged in
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/api/login/`, credentials).pipe(
      tap((response: LoginResponse) => {
        const user: User = {
          id: response.id,
          email: response.email,
          full_name: response.full_name,
          user_role: response.user_role,
          user_details: response.user_details,
          clinic: response.clinic,
          profile_photo: response.profile_photo,
          is_active: response.is_active,
          token: response.token,
          first_name: response.full_name?.split(' ')[0] || '',
          last_name: response.full_name?.split(' ').slice(1).join(' ') || '',
          role: response.user_role,
          access_token: response.token,
          refresh_token: response.token, // Using same token for both
          image: response.profile_photo
        };

        // Store user data properly with all required tokens
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user_role', response.user_role);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        // console.log('User stored successfully:', user);
        // console.log('User role:', response.user_role);
        
        // Navigate based on role
        this.handleRoleBasedRedirect(user.user_role);
      })
    );
  }
  
 private handleRoleBasedRedirect(role: string): void {
    // console.log('Redirecting user with role:', role); // Debug log
    switch (role.toLowerCase()) {
      case 'admin':
      case 'clinic owner':
      case 'Clinic Owner':
      case 'show_room_owner':
      case 'showroomowner':
      case 'show room owner':
        // console.log('Navigating to admin dashboard'); // Debug log
        this.router.navigate(['/admin']);
        break;
      case 'client':
      case 'Receptionist':
      case 'receptionist':
      case 'investor':
        // console.log('Navigating to client dashboard'); // Debug log
        this.router.navigate(['/client']);
        break;
      default:
        // console.log('Unknown role, redirecting to login'); // Debug log
        this.router.navigate(['/login']);
        break;
    }
  }

  // Update getRedirectUrl to be more specific
  getRedirectUrl(): string {
    const user = this.getCurrentUser();
    if (!user) return '/login';
    
    const role = user.user_role || user.role || '';
    switch (role.toLowerCase()) {
      case 'admin':
      case 'Clinic Owner':
      case 'show_room_owner':
      case 'showroomowner':
      case 'show room owner':
        return '/admin';
      case 'client':
      case 'investor':
        return '/client';
      default:
        return '/login';
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user_role');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }


  setCurrentUser(user: User, token: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user_role', user.user_role || user.role || '');
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Navigate based on role
    this.handleRoleBasedRedirect(user.user_role || user.role || '');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  hasRole(role: string): boolean {
    const user_role = localStorage.getItem('user_role');
    return user_role === role;
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        // console.error('Error parsing user from storage:', error);
        this.logout();
      }
    }
  }
}