import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(role: UserRole): boolean {
    if (this.authService.hasRole(role)) {
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
} 