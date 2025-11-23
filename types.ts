export enum AnswerOption {
  QUASE_SEMPRE = 'Quase sempre',
  QUASE_NUNCA = 'Quase nunca',
}

export interface Question {
  id: number;
  text: string;
}

export interface Answer {
  id?: string;
  questionId: number; // mapped from question_id in DB
  option: AnswerOption; // mapped from option_value in DB
  timestamp?: number; // optional, DB handles created_at
  sessionId: string;
}

export interface SurveyState {
  answers: Answer[];
  isActive: boolean;
  currentRound: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  fill: string;
}

export interface Session {
  id: string;
  name: string;
  status: 'active' | 'finished';
  created_at: string;
}