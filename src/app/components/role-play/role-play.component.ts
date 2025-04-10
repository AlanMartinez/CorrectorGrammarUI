import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message } from '../../models/message';
import { Dictionary } from '../../models/dictionary';
import { MessageService } from '../../services/message.service';
import { RolePlayService } from '../../services/role-play.service';
import { DictionarySelectionComponent } from '../dictionary-selection/dictionary-selection.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-role-play',
  standalone: true,
  imports: [CommonModule, FormsModule, DictionarySelectionComponent],
  templateUrl: './role-play.component.html',
  styleUrls: ['./role-play.component.css']
})
export class RolePlayComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild(DictionarySelectionComponent) private dictionarySelection!: DictionarySelectionComponent;
  
  // Chat properties
  newMessage = '';
  messages: Message[] = [];
  isLoading = false;
  selectedDictionaries: Dictionary[] = [];

  // View state
  showDictionarySelection = true;

  constructor(
    private messageService: MessageService,
    private rolePlayService: RolePlayService
  ) {
    this.messageService.messages$.subscribe(messages => {
      this.messages = messages;
    });
    this.messageService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngAfterViewChecked() {
    if (!this.showDictionarySelection) {
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  onStartSession(dictionaries: Dictionary[]) {
    console.log('Starting session with dictionaries:', dictionaries);
    this.selectedDictionaries = dictionaries;
    this.showDictionarySelection = false;
    this.messageService.clearMessages();
    this.rolePlayService.clearClientId();

    // Add initial message
    const dictionaryNames = dictionaries.map(d => d.name).join(', ');
    const welcomeMessage: Message = {
      role: 'assistant',
      content: `Welcome to your role-play session! I'll help you practice using vocabulary from: ${dictionaryNames}. Let's begin!`
    };
    this.messageService.addMessage(welcomeMessage);
  }

  sendMessage() {
    const messageText = this.newMessage.trim();
    if (!messageText || this.isLoading) return;

    console.log('Sending message:', messageText);
    
    const userMessage: Message = {
      role: 'user',
      content: messageText
    };

    this.messageService.addMessage(userMessage);
    this.newMessage = '';
    this.messageService.setLoading(true);

    // Call the role-play API
    this.rolePlayService.chat(messageText, this.selectedDictionaries)
      .pipe(
        finalize(() => {
          console.log('Request completed');
          this.messageService.setLoading(false);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Received response:', response);
          this.rolePlayService.setClientId(response.client_id);
          const assistantMessage: Message = {
            role: 'assistant',
            content: response.content
          };
          this.messageService.addMessage(assistantMessage);
        },
        error: (error) => {
          console.error('Error in role-play chat:', error);
          const errorMessage: Message = {
            role: 'assistant',
            content: 'Sorry, there was an error processing your message. Please try again.'
          };
          this.messageService.addMessage(errorMessage);
        }
      });
  }

  backToDictionarySelection() {
    console.log('Going back to dictionary selection');
    this.showDictionarySelection = true;
    this.messageService.clearMessages();
    this.rolePlayService.clearClientId();
    if (this.dictionarySelection) {
      this.dictionarySelection.resetSelections();
    }
  }
}
