import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  /**
   * Intercepts HTTP requests and adds Authorization header with Bearer token
   * @param req - The outgoing HTTP request
   * @param next - The next interceptor in the chain or the HTTP handler
   * @returns Observable of the HTTP event
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // Step 1: Get the auth token from localStorage
    const authToken = localStorage.getItem('authToken');
    
    // Step 2: Check if we have a token and if the request needs authentication
    if (authToken && this.shouldAddAuthHeader(req.url)) {
      
      // Step 3: Clone the request and add the Authorization header
      // Note: HTTP requests are immutable, so we must clone to modify
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      
      //consolele.log('🔐 Auth Interceptor: Added Bearer token to request:', req.url);
      
      // Step 4: Pass the cloned request to the next handler and handle auth errors
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          return this.handleAuthError(error);
        })
      );
    }
    
    // Step 5: If no token or request doesn't need auth, pass original request
    //consolele.log('📤 Auth Interceptor: Request sent without auth header:', req.url);
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleAuthError(error);
      })
    );
  }

  /**
   * Determines if the request URL should have auth header added
   * @param url - The request URL
   * @returns boolean indicating if auth header should be added
   */
  private shouldAddAuthHeader(url: string): boolean {
    // Don't add auth header to login/register endpoints
    const excludedEndpoints = [
      '/api/login/',
      '/api/register/',
      '/api/forgot-password/',
      '/api/reset-password/'
    ];
    
    // Check if the URL contains any excluded endpoints
    return !excludedEndpoints.some(endpoint => url.includes(endpoint));
  }

  /**
   * Handles authentication errors globally
   * @param error - The HTTP error response
   * @returns Observable that throws the error
   */
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      // Token is invalid or expired
      //consolele.log('🚫 Auth Interceptor: 401 Unauthorized - Redirecting to login');
      
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('user_role');
      
      // Redirect to login page
      this.router.navigate(['/login']);
    } else if (error.status === 403) {
      // User doesn't have permission
      //consolele.log('🚫 Auth Interceptor: 403 Forbidden - Access denied');
    }
    
    // Re-throw the error so components can still handle it if needed
    return throwError(() => error);
  }
}