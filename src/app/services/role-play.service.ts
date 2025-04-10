import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { Dictionary } from '../models/dictionary';
import { AppConfig } from '../core/config/app.config';

export interface RolePlayRequest {
  text: string;
  topics: string[];
  client_id?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ApiRolePlayData {
  response: string;
  client_id: string;
}

export interface RolePlayResponse {
  content: string;
  client_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolePlayService {
  private currentClientId: string | null = null;

  constructor(private http: HttpClient, private config: AppConfig) {}

  chat(text: string, topics: Dictionary[]): Observable<RolePlayResponse> {
    const request: RolePlayRequest = {
      text,
      topics: topics.map(t => t.name),
      ...(this.currentClientId && { client_id: this.currentClientId })
    };

    console.log('Sending request:', request);
    
    return this.http.post<ApiResponse<ApiRolePlayData>>(`${this.config.rolePlayEndpoint}/chat`, request)
      .pipe(
        map(response => ({
          content: response.data.response,
          client_id: response.data.client_id
        })),
        catchError(error => {
          console.error('API Error:', error);
          throw error;
        })
      );
  }

  setClientId(clientId: string) {
    this.currentClientId = clientId;
    console.log('Client ID set to:', clientId);
  }

  clearClientId() {
    this.currentClientId = null;
    console.log('Client ID cleared');
  }
} 