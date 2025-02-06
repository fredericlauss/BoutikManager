import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    @if (authService.isLoggedIn()) {
      <app-navbar />
    }
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: calc(100vh - 64px); // Hauteur totale moins la hauteur de la navbar
      background-color: #f3f4f6;
    }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}
}
