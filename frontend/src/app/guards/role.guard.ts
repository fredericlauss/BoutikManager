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

  canActivate(): boolean {
    const user = this.authService.getCurrentUser();
    if (user && user.role === UserRole.ADMIN) {
      return true;
    }

    this.router.navigate(['/products']);
    return false;
  }
} 