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
      tap((response:LoginResponse)=>{
        const user: User = {
          id: response.id,
          email: response.email,
          first_name: response.first_name,
          last_name: response.last_name,
          role: response.role,
          phone_number: response.phone_number,
          address: response.address,
          cnic: response.cnic,
          is_active: response.is_active,
          date_joined: response.date_joined,
          last_login: response.last_login,
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          image: (response as any).image,
          show_room_name: (response as any).show_room_name
        };

        // Store user data properly with all required tokens
        localStorage.setItem('authToken', response.access_token);
        localStorage.setItem('userRole', response.role);
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        //console.log('User stored successfully:', user);
        //console.log('User role:', response.role);
        
        // Navigate based on role
        this.handleRoleBasedRedirect(user.role);
      })
    );
  }
  
 private handleRoleBasedRedirect(role: string): void {
    //console.log('Redirecting user with role:', role); // Debug log
    switch (role.toLowerCase()) {
      case 'admin':
      case 'show_room_owner':
      case 'showroomowner':
      case 'show room owner':
        //console.log('Navigating to admin dashboard'); // Debug log
        this.router.navigate(['/admin']);
        break;
      case 'client':
      case 'investor':
        //console.log('Navigating to client dashboard'); // Debug log
        this.router.navigate(['/client']);
        break;
      default:
        //console.log('Unknown role, redirecting to login'); // Debug log
        this.router.navigate(['/login']);
        break;
    }
  }

  // Update getRedirectUrl to be more specific
  getRedirectUrl(): string {
    const user = this.getCurrentUser();
    if (!user) return '/login';
    
    switch (user.role.toLowerCase()) {
      case 'admin':
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }


  setCurrentUser(user: User, token: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    
    // Navigate based on role
    this.handleRoleBasedRedirect(user.role);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  hasRole(role: string): boolean {
    const userRole = localStorage.getItem('userRole');
    return userRole === role;
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
        this.logout();
      }
    }
  }
}