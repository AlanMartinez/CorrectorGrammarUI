export interface Message {
  role: 'user' | 'assistant';
  content: string;
  explanation?: string;
}

export interface GrammarResponse {
  success: boolean;
  data: {
    corrected: string;
    explanation: string;
  };
}
