import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
export class SimpleLoginComponent {
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
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || error.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}