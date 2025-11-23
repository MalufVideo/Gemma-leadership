import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Answer, AnswerOption } from '../types';
import { QUESTIONS, OPTIONS } from '../constants';
import { getAnswersForSession, subscribeToSessionAnswers, getSession } from '../services/surveyService';
import { BarChart, Bar, Cell, ResponsiveContainer, LabelList } from 'recharts';
import { Loader2, AlertCircle } from 'lucide-react';

const Results: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sessionName, setSessionName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Load initial data
    const init = async () => {
      const [sess, ans] = await Promise.all([
        getSession(sessionId),
        getAnswersForSession(sessionId)
      ]);
      
      if (sess) setSessionName(sess.name);
      setAnswers(ans);
      setLoading(false);
    };
    init();

    // Subscribe to realtime updates
    const subscription = subscribeToSessionAnswers(sessionId, (payload) => {
      const newAnswer = {
        id: payload.new.id,
        questionId: payload.new.question_id,
        option: payload.new.option_value as AnswerOption,
        sessionId: payload.new.session_id
      };
      setAnswers(prev => [...prev, newAnswer]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
         <div className="text-center">
            <AlertCircle className="mx-auto mb-2" size={40} />
            <p>Nenhuma sessão selecionada.</p>
            <p className="text-sm">Acesse através do painel Admin.</p>
         </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-brand-600">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const totalResponses = answers.length;

  const getChartData = (questionId: number) => {
    const qAnswers = answers.filter(a => a.questionId === questionId);
    
    return OPTIONS.map(opt => {
      const count = qAnswers.filter(a => a.option === opt.value).length;
      let fill = '#cbd5e1'; 
      if (opt.color.includes('kahoot-red')) fill = '#e21b3c';
      if (opt.color.includes('kahoot-blue')) fill = '#1368ce';
      if (opt.color.includes('kahoot-yellow')) fill = '#d89e00';
      if (opt.color.includes('kahoot-green')) fill = '#26890c';

      return {
        name: opt.label,
        value: count,
        fill: fill,
      };
    });
  };

  return (
    <div className="h-screen w-screen bg-slate-50 flex flex-col overflow-hidden p-2">
      {/* Header Compact */}
      <header className="flex justify-between items-center px-4 py-2 shrink-0 bg-white rounded-lg shadow-sm mb-2 border border-slate-200">
         <div className="flex items-center gap-4">
           <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Resultados</h1>
           <span className="text-lg text-brand-600 font-medium border-l border-slate-300 pl-4">{sessionName}</span>
         </div>
         
         <div className="flex items-center gap-6">
            <div className="flex gap-4 text-xs font-bold text-slate-600">
               <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#26890c]"></span> Quase Sempre</div>
               <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-[#e21b3c]"></span> Quase Nunca</div>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded text-right">
              <span className="text-sm font-bold text-slate-700">{totalResponses}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 ml-2">Total</span>
            </div>
         </div>
      </header>

      {/* Grid Layout 10x2 */}
      <div className="flex-1 min-h-0 grid grid-cols-10 grid-rows-2 gap-2">
        {QUESTIONS.map((q) => {
          const data = getChartData(q.id);
          
          return (
            <div key={q.id} className="bg-white rounded shadow-sm border border-slate-200 flex flex-col p-1 min-w-0">
              <div 
                className="text-[10px] leading-3 text-slate-700 font-semibold mb-1 text-center h-8 flex items-center justify-center overflow-hidden px-1"
                title={q.text}
              >
                <span className="line-clamp-2">{q.id}. {q.text}</span>
              </div>

              <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 15, right: 5, left: 5, bottom: 0 }}>
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                      <LabelList 
                        dataKey="value" 
                        position="top" 
                        style={{ fontSize: '12px', fontWeight: 'bold', fill: '#334155' }} 
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;