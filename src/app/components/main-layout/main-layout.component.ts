import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorrectorComponent } from '../corrector/corrector.component';
import { RolePlayComponent } from '../role-play/role-play.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, CorrectorComponent, RolePlayComponent],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {
  activeSection: 'corrector' | 'roleplay' = 'corrector';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  switchSection(section: 'corrector' | 'roleplay') {
    this.activeSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 