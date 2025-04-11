import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../core/config/app.config';
import { AuthService } from './auth.service';

export interface GrammarResponse {
  success: boolean;
  data: {
    corrected: string;
    explanation: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CorrectGrammarMcpService {
  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  correctGrammar(text: string): Observable<GrammarResponse> {
    return this.http.post<GrammarResponse>(
      `${this.config.grammarEndpoint}/correct`, 
      { text },
      { headers: this.getAuthHeaders() }
    );
  }
} 