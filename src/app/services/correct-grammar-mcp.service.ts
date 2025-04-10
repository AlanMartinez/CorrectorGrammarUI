import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../core/config/app.config';

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
    private config: AppConfig
  ) { }

  correctGrammar(text: string): Observable<GrammarResponse> {
    return this.http.post<GrammarResponse>(`${this.config.grammarEndpoint}/correct`, { text });
  }
} 