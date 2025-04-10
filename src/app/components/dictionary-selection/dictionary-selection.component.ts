import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DictionaryService } from '../../services/dictionary.service';
import { Dictionary } from '../../models/dictionary';

@Component({
  selector: 'app-dictionary-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dictionary-selection.component.html',
  styleUrls: ['./dictionary-selection.component.css']
})
export class DictionarySelectionComponent implements OnInit {
  @Output() startSession = new EventEmitter<Dictionary[]>();
  
  dictionaries: Dictionary[] = [];
  filteredDictionaries: Dictionary[] = [];
  searchQuery: string = '';

  constructor(private dictionaryService: DictionaryService) {}

  ngOnInit() {
    this.loadDictionaries();
  }

  loadDictionaries() {
    this.dictionaryService.getDictionaries().subscribe({
      next: (response: any) => {
        if (typeof response === 'string') {
          try {
            response = JSON.parse(response);
            console.log('Parsed response:', response);
          } catch (e) {
            console.error('Failed to parse response:', e);
            return;
          }
        }

        // Handle different response structures
        let dictionariesData: any[] = [];
        
        if (Array.isArray(response)) {
          dictionariesData = response;
        } else if (response && typeof response === 'object') {
          if (response.data && Array.isArray(response.data)) {
            dictionariesData = response.data;
          } else if (response.dictionaries && Array.isArray(response.dictionaries)) {
            dictionariesData = response.dictionaries;
          } else if (response.items && Array.isArray(response.items)) {
            dictionariesData = response.items;
          } else {
            // Try to convert object to array if it's a dictionary of dictionaries
            dictionariesData = Object.values(response);
          }
        }

        console.log('Processed dictionaries data:', dictionariesData);

        if (!Array.isArray(dictionariesData) || dictionariesData.length === 0) {
          console.error('No valid dictionary data found in response');
          return;
        }

        this.dictionaries = dictionariesData.map((dict: any) => ({
          id: dict.id || 0,
          name: dict.item,
          selected: false
        }));
        
        console.log('Final dictionaries array:', this.dictionaries);
        this.filterDictionaries();
      },
      error: (error) => {
        console.error('Error loading dictionaries:', error);
      }
    });
  }

  filterDictionaries() {
    if (!this.searchQuery) {
      this.filteredDictionaries = [...this.dictionaries];
      return;
    }

    this.filteredDictionaries = this.dictionaries.filter(dict =>
      dict.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearch() {
    this.filterDictionaries();
  }

  toggleDictionary(dictionary: Dictionary) {
    dictionary.selected = !dictionary.selected;
  }

  getSelectedDictionaries(): Dictionary[] {
    return this.dictionaries.filter(dict => dict.selected);
  }

  startRolePlay() {
    const selectedDictionaries = this.getSelectedDictionaries();
    if (selectedDictionaries.length > 0) {
      this.startSession.emit(selectedDictionaries);
    }
  }

  resetSelections() {
    this.dictionaries.forEach(dict => dict.selected = false);
    this.searchQuery = '';
    this.filterDictionaries();
  }
}
