import { AnswerOption, Question } from './types';

export const QUESTIONS: Question[] = [
  { id: 1, text: "Tenho compreensão do que meu líder me demanda" },
  { id: 2, text: "Me parece claro o que meu líder está dizendo durante nossas conversas" },
  { id: 3, text: "Meu líder se assegura de que meu entendimento sobre sua fala está correto" },
  { id: 4, text: "Minha líder checa meu entendimento sobre o que está sento dito ou solicitado" },
  { id: 5, text: "Meu líder esclarece claramente as prioridades de tarefa" },
  { id: 6, text: "Tenho liberdade para questionar os posicionamentos do meu líder" },
  { id: 7, text: "Meu líder faz aquilo que fala" },
  { id: 8, text: "Confio que meu líder sabe me direcionar para o cumprimento da estratégia" },
  { id: 9, text: "Meu líder mostra firmeza diante de decisões difíceis" },
  { id: 10, text: "Sinto que meu líder toma decisões com objetividade" },
  { id: 11, text: "Meu líder favorece as trocas e relacionamento entre os integrantes do time" },
  { id: 12, text: "Meu líder confia em mim" },
  { id: 13, text: "Meu líder sustenta sua posição diante de pressão" },
  { id: 14, text: "Meu líder enfrenta eventual competição velada dentro do time" },
  { id: 15, text: "Meu líder sustenta uma posição impopular se for necessária para o negócio" },
  { id: 16, text: "Meu líder demonstra saber lidar com erros próprios de forma adequada" },
  { id: 17, text: "Meu líder demonstra saber lidar com erros dos liderados de forma construtiva" },
  { id: 18, text: "Meu líder faz o que é o melhor para o negócio mesmo que não seja aprovado pelos liderados" },
  { id: 19, text: "Meu líder promove ações para fortalecer a confiança interna do time" },
  { id: 20, text: "Meu líder ouve minhas necessidades" },
];

export const OPTIONS = [
  { label: AnswerOption.QUASE_SEMPRE, color: 'bg-kahoot-green', value: AnswerOption.QUASE_SEMPRE, icon: '▲' },
  { label: AnswerOption.QUASE_NUNCA, color: 'bg-kahoot-red', value: AnswerOption.QUASE_NUNCA, icon: '■' },
];

export const STORAGE_KEY = 'gemmaconsult_data';
export const STATUS_KEY = 'gemmaconsult_status';