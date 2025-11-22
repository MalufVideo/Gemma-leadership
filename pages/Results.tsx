import React, { useEffect, useState } from 'react';
import { Answer, AnswerOption } from '../types';
import { QUESTIONS, OPTIONS } from '../constants';
import { getAnswers } from '../services/surveyService';
import { BarChart3 } from 'lucide-react';

const Results: React.FC = () => {
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);

  const fetchData = () => {
    const data = getAnswers();
    setAnswers(data);
    const unique = new Set(data.map(a => a.sessionId));
    setTotalParticipants(unique.size);
  };

  useEffect(() => {
    fetchData();
    // Listen to changes from local storage (other tabs)
    window.addEventListener('storage', fetchData);
    
    // Also poll for changes within the same tab/browser context if needed
    const interval = setInterval(fetchData, 2000);

    return () => {
      window.removeEventListener('storage', fetchData);
      clearInterval(interval);
    };
  }, []);

  // Helper to get stats for a specific question
  const getQuestionStats = (questionId: number) => {
    const qAnswers = answers.filter(a => a.questionId === questionId);
    const total = qAnswers.length;
    
    const stats = OPTIONS.map(opt => {
      const count = qAnswers.filter(a => a.option === opt.value).length;
      const percentage = total === 0 ? 0 : Math.round((count / total) * 100);
      return { ...opt, count, percentage };
    });

    return { total, stats };
  };

  // Calculate overall average sentiment (simplified)
  // Assuming scale: Sempre=4, Quase Sempre=3, Quase Nunca=2, Nunca=1
  // This is just a rough visualization metric
  const calculateOverallScore = () => {
    if (answers.length === 0) return 0;
    
    const scoreMap: Record<string, number> = {
      [AnswerOption.SEMPRE]: 100,
      [AnswerOption.QUASE_SEMPRE]: 75,
      [AnswerOption.QUASE_NUNCA]: 25,
      [AnswerOption.NUNCA]: 0,
    };

    let totalScore = 0;
    answers.forEach(a => {
      totalScore += scoreMap[a.option] || 0;
    });

    return Math.round(totalScore / answers.length);
  };

  const overallScore = calculateOverallScore();

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-200 pb-4">
          <div>
             <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Resultados da Equipe</h1>
             <p className="text-slate-500 mt-2">Dados atualizados em tempo real</p>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 text-right">
             <div>
                <span className="block text-3xl font-bold text-brand-600">{totalParticipants}</span>
                <span className="text-xs uppercase font-bold text-slate-400">Participantes</span>
             </div>
             <div>
                <span className="block text-3xl font-bold text-emerald-600">{overallScore}%</span>
                <span className="text-xs uppercase font-bold text-slate-400">Adesão Positiva</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {QUESTIONS.map((q) => {
            const { total, stats } = getQuestionStats(q.id);
            
            return (
              <div key={q.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
                <div className="mb-4 flex gap-3 items-start">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm">
                    {q.id}
                  </span>
                  <h3 className="font-semibold text-slate-800 leading-snug">{q.text}</h3>
                </div>

                <div className="mt-auto space-y-3">
                  {stats.map((stat) => (
                    <div key={stat.value} className="relative">
                      <div className="flex justify-between text-xs font-medium text-slate-500 mb-1 z-10 relative">
                        <span className="flex items-center gap-1">
                           <span className={stat.color.replace('bg-', 'text-')}>●</span> {stat.label}
                        </span>
                        <span>{stat.count} ({stat.percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`${stat.color} h-full transition-all duration-500 ease-out`}
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  
                  {total === 0 && (
                     <div className="text-center py-4 text-slate-300 italic text-sm">
                       Aguardando respostas...
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;