import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { Dictionary } from '../models/dictionary';
import { AppConfig } from '../core/config/app.config';
import { AuthService } from './auth.service';

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
  success: boolean;
  data: {
    response: string;
    client_id: string;
  };
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

  constructor(
    private http: HttpClient, 
    private config: AppConfig,
    private authService: AuthService
  ) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  chat(text: string, topics: Dictionary[]): Observable<RolePlayResponse> {
    const request: RolePlayRequest = {
      text,
      topics: topics.map(t => t.name),
      ...(this.currentClientId && { client_id: this.currentClientId })
    };

    console.log('Sending request:', request);
    console.log('Using endpoint:', this.config.rolePlayEndpoint);
    
    return this.http.post<ApiResponse<ApiRolePlayData>>(
      `${this.config.rolePlayEndpoint}/chat`, 
      request,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        const innerData = response.data.data;
        return {
          content: innerData.response,
          client_id: innerData.client_id
        };
      }),
      catchError(error => {
        console.error('API Error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error
        });
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