import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../core/config/app.config';

interface DictionaryRequest {
  user_id: string;
  dictionary_item: string;
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(private http: HttpClient, private config: AppConfig) {}

  addToDictionary(item: string): Observable<any> {
    const request: DictionaryRequest = {
      user_id: '1', // Hardcoded for testing
      dictionary_item: item
    };

    return this.http.post(this.config.dictionaryEndpoint, request);
  }

  getDictionaries(): Observable<any> {
    return this.http.get('http://127.0.0.1:8001/dictionary/1');
  }
} 