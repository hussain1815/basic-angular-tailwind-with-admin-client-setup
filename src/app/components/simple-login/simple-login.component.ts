import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-simple-login',
  standalone: true,
  imports: [FormsModule,CommonModule,ReactiveFormsModule,],
  templateUrl: './simple-login.component.html',
  styleUrl: './simple-login.component.scss'
})
export class SimpleLoginComponent implements OnInit {
 username: string = '';
  password: string = '';
   loginForm: FormGroup;
   isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // console.log('User already logged in, redirecting to dashboard');
        
        // Check user role and redirect accordingly
        const userRole = user.user_role || user.role || '';
        
        if (this.isAdminRole(userRole)) {
          this.router.navigate(['/admin']);
        } else if (this.isClientRole(userRole)) {
          this.router.navigate(['/client']);
        } else {
          // Default redirect for unknown roles
          this.router.navigate(['/admin']);
        }
      }
    });
  }

  private isAdminRole(role: string): boolean {
    const adminRoles = ['Clinic Owner', 'admin', 'show_room_owner', 'showroomowner', 'show room owner'];
    return adminRoles.includes(role);
  }

  private isClientRole(role: string): boolean {
    const clientRoles = ['Receptionist', 'receptionist', 'client', 'investor', 'user'];
    return clientRoles.includes(role);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials = this.loginForm.value;

      // Use real API login
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          //console.log('Login successful:', response);
          // Navigation is handled in the auth service
        },
        error: (error) => {
          this.isLoading = false;
          // console.error('Login error:', error);
          this.errorMessage = error.error?.message || error.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}