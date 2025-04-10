import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorrectorComponent } from './components/corrector/corrector.component';
import { RolePlayComponent } from './components/role-play/role-play.component';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CorrectorComponent, RolePlayComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeSection: 'corrector' | 'roleplay' = 'corrector';

  constructor(private messageService: MessageService) {}

  switchSection(section: 'corrector' | 'roleplay') {
    this.activeSection = section;
    this.messageService.clearMessages();
  }
}
