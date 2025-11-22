import React, { useState, useEffect } from 'react';
import { Trash2, Users, CheckCircle } from 'lucide-react';
import { resetSurvey, getAnswers } from '../services/surveyService';

const Admin: React.FC = () => {
  const [responseCount, setResponseCount] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [resetConfirmed, setResetConfirmed] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const answers = getAnswers();
      setResponseCount(answers.length);
      const uniqueSessions = new Set(answers.map(a => a.sessionId));
      setUniqueUsers(uniqueSessions.size);
    };

    updateStats();
    
    // Listen for updates from other tabs
    window.addEventListener('storage', updateStats);
    const interval = setInterval(updateStats, 2000); // Poll just in case

    return () => {
      window.removeEventListener('storage', updateStats);
      clearInterval(interval);
    };
  }, []);

  const handleReset = () => {
    if (confirm('Tem certeza? Isso apagará TODAS as respostas coletadas.')) {
      resetSurvey();
      setResetConfirmed(true);
      setTimeout(() => setResetConfirmed(false), 2000);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8 border-b pb-4">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Stats Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-brand-500">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-brand-100 rounded-full text-brand-600">
              <Users size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Participação</h3>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-slate-900">{uniqueUsers}</p>
              <p className="text-sm text-slate-500">Participantes Ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">{responseCount}</p>
              <p className="text-sm text-slate-500">Total de Respostas</p>
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-kahoot-red">
           <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-red-100 rounded-full text-kahoot-red">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Controle de Sessão</h3>
          </div>
          <p className="text-slate-500 text-sm mb-6">
            Ao iniciar uma nova rodada, limpe os dados anteriores. Esta ação é irreversível.
          </p>
          <button 
            onClick={handleReset}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
          >
            {resetConfirmed ? <CheckCircle size={20} /> : <Trash2 size={20} />}
            {resetConfirmed ? 'Reiniciado com Sucesso!' : 'Limpar Dados e Reiniciar'}
          </button>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <h4 className="font-bold text-slate-700 mb-2">Instruções</h4>
        <ul className="list-disc list-inside text-slate-600 space-y-1 text-sm">
          <li>Peça aos participantes para escanearem o QR Code na tela inicial.</li>
          <li>Monitore o número de participantes ativos neste painel.</li>
          <li>Quando todos terminarem, exiba a página de <strong>Resultados</strong> no telão.</li>
          <li>Use o botão acima para limpar os dados antes de uma nova turma.</li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;