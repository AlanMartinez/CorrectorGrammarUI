import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../core/config/app.config';
import { AuthService } from './auth.service';

interface DictionaryRequest {
  user_id: string;
  dictionary_item: string;
}

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  constructor(
    private http: HttpClient, 
    private config: AppConfig,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  addToDictionary(item: string): Observable<any> {
    const request: DictionaryRequest = {
      user_id: this.authService.getUserId() || '1',
      dictionary_item: item
    };

    return this.http.post(this.config.dictionaryEndpoint, request, {
      headers: this.getAuthHeaders()
    });
  }

  getDictionaries(): Observable<any> {
    const userId = this.authService.getUserId();
    return this.http.get(`${this.config.dictionaryEndpoint}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
} 