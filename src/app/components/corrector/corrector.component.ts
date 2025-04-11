import { Component, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Message, GrammarResponse } from '../../models/message';
import { MessageService } from '../../services/message.service';
import { CorrectGrammarMcpService } from '../../services/correct-grammar-mcp.service';
import { DictionaryService } from '../../services/dictionary.service';

@Component({
  selector: 'app-corrector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './corrector.component.html',
  styleUrls: ['./corrector.component.css']
})
export class CorrectorComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  newMessage = '';
  messages: Message[] = [];
  isLoading = false;
  activePopupId: number | null = null;
  showFloatingButton = false;
  floatingButtonPosition = { top: 0, left: 0 };
  selectedText = '';

  constructor(
    private messageService: MessageService,
    private grammarService: CorrectGrammarMcpService,
    private dictionaryService: DictionaryService
  ) {
    this.messageService.messages$.subscribe(messages => {
      this.messages = messages;
    });
    this.messageService.isLoading$.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isFloatingButtonClick = target.closest('.floating-button');
    if (isFloatingButtonClick) {
      return;
    }
    
    if (!target.closest('.info-icon')) {
      this.activePopupId = null;
    }
    if (!target.closest('.floating-button')) {
      this.showFloatingButton = false;
    }
  }

  @HostListener('mouseup', ['$event'])
  handleTextSelection(event: MouseEvent) {
    // If clicking the floating button, ignore the selection
    const target = event.target as HTMLElement;
    if (target.closest('.floating-button')) {
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (!selectedText || selectedText.length === 0) {
      this.showFloatingButton = false;
      return;
    }
    
    // Get the range and its bounding rectangle
    const range = selection?.getRangeAt(0);
    if (!range) {
      this.showFloatingButton = false;
      return;
    }
    
    const rect = range.getBoundingClientRect();
    
    if (!rect) {
      this.showFloatingButton = false;
      return;
    }
    
    const isInPopup = target.closest('.popup-content');
    if (isInPopup) {
      this.showFloatingButton = false;
      return;
    }
    
    const container = range.commonAncestorContainer;
    let element: Element | null = null;
    
    if (container.nodeType === Node.TEXT_NODE) {
      element = container.parentElement;
    } else if (container.nodeType === Node.ELEMENT_NODE) {
      element = container as Element;
    }
    
    const isInMessageContent = element?.classList?.contains('message-content');

    if (isInMessageContent) {
      this.selectedText = selectedText;
      
      // Calculate position relative to viewport
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Get the viewport-relative coordinates
      const top = rect.top + scrollTop;
      const left = rect.left + (rect.width / 2);
      
      // Set button position
      this.floatingButtonPosition = {
        top: top - 40,
        left: left
      };
      
      // Force button to show
      setTimeout(() => {
        this.showFloatingButton = true;
      });
    
    } else {
      this.showFloatingButton = false;
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: this.newMessage
    };

    this.messageService.addMessage(userMessage);
    const messageToSend = this.newMessage;
    this.newMessage = '';
    this.messageService.setLoading(true);

    this.grammarService.correctGrammar(messageToSend).subscribe({
      next: (response: GrammarResponse) => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: this.formatGrammarResponse(response),
          explanation: response.data.explanation
        };
        this.messageService.addMessage(assistantMessage);
        this.messageService.setLoading(false);
      },
      error: (error) => {
        const errorMessage: Message = {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request. Please try again.'
        };
        this.messageService.addMessage(errorMessage);
        this.messageService.setLoading(false);
        console.error('Error:', error);
      }
    });
  }

  private formatGrammarResponse(response: GrammarResponse): string {
    if (!response.success || !response.data) {
      return 'No grammar corrections were made.';
    }
    return response.data.corrected;
  }

  togglePopup(event: MouseEvent, messageIndex: number) {
    event.stopPropagation();
    this.activePopupId = this.activePopupId === messageIndex ? null : messageIndex;
  }

  addToDictionary() {
    if (this.selectedText) {
      this.dictionaryService.addToDictionary(this.selectedText)
        .subscribe({
          next: (response) => {
          },
          error: (error) => {
            console.error('Error adding word to dictionary:', error);
          }
        });
    }
  }
}
