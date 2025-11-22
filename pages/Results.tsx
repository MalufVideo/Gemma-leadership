import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Answer, AnswerOption } from '../types';
import { QUESTIONS, OPTIONS } from '../constants';
import { getAnswersForSession, subscribeToSessionAnswers, getSession } from '../services/surveyService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
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

  // Calculate stats
  const uniqueParticipants = new Set(answers.map(a => a.sessionId)).size; // Note: In supabase raw version, we might not have distinct user IDs unless we store a cookie UUID. 
  // *Fix*: Since Supabase answers table doesn't track "who" strictly without auth, we can just count total answers divided by questions answered, or just show "Total Responses". 
  // For better accuracy in this anon-mode, let's just show Total Responses.
  const totalResponses = answers.length;

  // Data transformation for Recharts
  const getChartData = (questionId: number) => {
    const qAnswers = answers.filter(a => a.questionId === questionId);
    const total = qAnswers.length;

    return OPTIONS.map(opt => {
      const count = qAnswers.filter(a => a.option === opt.value).length;
      // Map Tailwind classes to Hex codes for Recharts
      let fill = '#cbd5e1'; // default gray
      if (opt.color.includes('kahoot-red')) fill = '#e21b3c';
      if (opt.color.includes('kahoot-blue')) fill = '#1368ce';
      if (opt.color.includes('kahoot-yellow')) fill = '#d89e00';
      if (opt.color.includes('kahoot-green')) fill = '#26890c';

      return {
        name: opt.label,
        value: count,
        total: total,
        fill: fill,
        label: opt.label // clean label
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-200 pb-4 sticky top-0 bg-slate-50 z-10 pt-4">
          <div>
             <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Resultados</h1>
             <h2 className="text-xl text-brand-600 font-medium mt-1">{sessionName || 'Sessão Ativa'}</h2>
          </div>
          <div className="flex gap-6 mt-4 md:mt-0 text-right">
             <div>
                <span className="block text-3xl font-bold text-slate-700">{totalResponses}</span>
                <span className="text-xs uppercase font-bold text-slate-400">Respostas Totais</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {QUESTIONS.map((q) => {
            const data = getChartData(q.id);
            const totalForQ = data.reduce((acc, curr) => acc + curr.value, 0);
            
            return (
              <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 break-inside-avoid">
                <div className="mb-6 flex gap-3 items-start h-16">
                  <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-sm">
                    {q.id}
                  </span>
                  <h3 className="font-bold text-slate-800 text-lg leading-snug">{q.text}</h3>
                </div>

                <div className="h-48 w-full">
                  {totalForQ > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={100} 
                          tick={{fontSize: 11, fill: '#64748b'}} 
                          interval={0}
                        />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-slate-300 italic text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
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