import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { LoginDto, RegisterDto, AuthResponse } from '../interfaces/auth.interface';
import { User, UserRole } from '../interfaces/user.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';
  private isBrowser: boolean;
  private currentUser: User | null = null;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private isAuthenticatedSubject: BehaviorSubject<boolean>;
  isAuthenticated$: Observable<boolean>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    
    // Initialiser l'état d'authentification
    const token = this.getToken();
    const user = this.getCurrentUser();
    const isAuthenticated = !!token && !!user;
    
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(isAuthenticated);
    this.isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
    
    if (isAuthenticated && user) {
      this.currentUser = user;
      this.isAuthenticatedSubject.next(true);
    }
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginDto).pipe(
      tap(response => {
        if (this.isBrowser) {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUser = response.user;
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  register(registerDto: RegisterDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registerDto);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
    this.currentUser = null;
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    if (!this.isBrowser) return false;
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    if (this.currentUser) {
      return this.currentUser;
    }

    if (!this.isBrowser) return null;
    
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        return this.currentUser;
      } catch {
        return null;
      }
    }
    return null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  checkAuthState(): void {
    const token = this.getToken();
    const user = this.getCurrentUser();
    const isAuthenticated = !!token && !!user;
    
    if (isAuthenticated && user) {
      this.currentUser = user;
      this.isAuthenticatedSubject.next(true);
    } else {
      this.currentUser = null;
      this.isAuthenticatedSubject.next(false);
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === UserRole.ADMIN;
  }
} 