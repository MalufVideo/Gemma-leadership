export enum AnswerOption {
  SEMPRE = 'Sempre',
  QUASE_SEMPRE = 'Quase sempre',
  QUASE_NUNCA = 'Quase nunca',
  NUNCA = 'Nunca',
}

export interface Question {
  id: number;
  text: string;
}

export interface Answer {
  questionId: number;
  option: AnswerOption;
  timestamp: number;
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