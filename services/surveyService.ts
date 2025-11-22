import { STORAGE_KEY, STATUS_KEY } from '../constants';
import { Answer, AnswerOption } from '../types';

// Helper to dispatch events so other tabs update
const notifyChange = () => {
  window.dispatchEvent(new Event('storage'));
};

export const getAnswers = (): Answer[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveAnswer = (questionId: number, option: AnswerOption) => {
  const currentAnswers = getAnswers();
  const newAnswer: Answer = {
    questionId,
    option,
    timestamp: Date.now(),
    sessionId: getCurrentSessionId(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...currentAnswers, newAnswer]));
  notifyChange();
};

export const resetSurvey = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  // Update session ID to invalidate old sessions if we were doing strict session management
  // For this demo, just clearing the array is sufficient.
  notifyChange();
};

export const getCurrentSessionId = (): string => {
  let id = localStorage.getItem('gemmaconsult_session_id');
  if (!id) {
    id = Math.random().toString(36).substring(7);
    localStorage.setItem('gemmaconsult_session_id', id);
  }
  return id;
};

export const getSurveyStatus = (): boolean => {
  return localStorage.getItem(STATUS_KEY) === 'ACTIVE';
};

export const setSurveyStatus = (isActive: boolean) => {
  localStorage.setItem(STATUS_KEY, isActive ? 'ACTIVE' : 'PAUSED');
  notifyChange();
};