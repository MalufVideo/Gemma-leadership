import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { QUESTIONS, OPTIONS } from '../constants';
import { saveAnswer } from '../services/surveyService';
import { AnswerOption } from '../types';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const Play: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // No session ID provided
  if (!sessionId) {
    return (
      <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md shadow-xl max-w-md">
          <AlertTriangle size={60} className="mx-auto text-yellow-400 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Sessão não encontrada</h2>
          <p className="text-brand-100 mb-6">
            É necessário escanear o QR Code fornecido pelo facilitador para entrar em uma sessão específica.
          </p>
          <Link to="/" className="px-6 py-2 bg-white text-brand-900 rounded-full font-bold">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswer = async (option: AnswerOption) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const questionId = QUESTIONS[currentQuestionIndex].id;
    await saveAnswer(sessionId, questionId, option);
    
    setIsSubmitting(false);

    if (currentQuestionIndex < QUESTIONS.length - 1) {
       // Small artificial delay for feedback
       setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        window.scrollTo(0, 0);
       }, 150);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md shadow-xl animate-pulse-slow">
          <CheckCircle2 size={80} className="mx-auto text-green-400 mb-6" />
          <h2 className="text-3xl font-bold mb-4">Obrigado!</h2>
          <p className="text-xl text-brand-100">Suas respostas foram enviadas.</p>
          <p className="mt-4 text-sm opacity-75">Aguarde os resultados no telão.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 h-2">
        <div 
          className="bg-brand-500 h-2 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4">
        <div className="flex-1 flex flex-col justify-center py-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 text-center min-h-[160px] flex items-center justify-center relative">
             <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block px-3 py-1 bg-brand-900 text-white rounded-full text-xs font-bold shadow">
                {currentQuestionIndex + 1} / {QUESTIONS.length}
              </span>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight mt-2">
              {currentQuestion.text}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 h-96">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                disabled={isSubmitting}
                className={`${opt.color} flex flex-col items-center justify-center p-4 rounded-xl shadow-md transform transition active:scale-95 hover:brightness-110 text-white h-full disabled:opacity-70 disabled:scale-100`}
              >
                <span className="text-4xl mb-2 drop-shadow-md">{opt.icon}</span>
                <span className="font-bold text-lg md:text-xl drop-shadow-sm text-center leading-tight">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs py-4">
          ID da Sessão: {sessionId.slice(0, 8)}...
        </p>
      </div>
    </div>
  );
};

export default Play;