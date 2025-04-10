import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppConfig {
  private readonly config = {
    apiUrl: environment.apiUrl,
    endpoints: {
      grammar: `${environment.apiUrl}/grammar`,
      rolePlay: `${environment.apiUrl}/role-play`,
      dictionary: `${environment.apiRestUrl}/dictionary`
    }
  };

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get grammarEndpoint(): string {
    return this.config.endpoints.grammar;
  }
  
  get rolePlayEndpoint(): string {
    return this.config.endpoints.rolePlay;
  }

  get dictionaryEndpoint(): string {
    return this.config.endpoints.dictionary;
  }
} 