import React, { useState } from 'react';
import { Trash2, Users, Play, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { createSession } from '../services/surveyService';
import { Session } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [sessionName, setSessionName] = useState('');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    setLoading(true);
    const session = await createSession(sessionName);
    setLoading(false);

    if (session) {
      setCurrentSession(session);
    }
  };

  const playUrl = currentSession 
    ? `${window.location.origin}${window.location.pathname}#/play?sessionId=${currentSession.id}`
    : '';
    
  const qrCodeUrl = currentSession 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(playUrl)}`
    : '';

  const goToResults = () => {
    if (currentSession) {
      navigate(`/results?sessionId=${currentSession.id}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Painel Administrativo</h1>
      <p className="text-slate-500 mb-8">Crie uma nova sessão para gerar um código único para esta turma.</p>

      {!currentSession ? (
        <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-brand-500">
          <h2 className="text-xl font-bold mb-4 text-slate-800">Nova Sessão</h2>
          <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Sessão / Turma</label>
              <input 
                type="text" 
                className="w-full p-3 bg-white text-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none placeholder-slate-500"
                placeholder="Ex: Liderança - Turma A"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-brand-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Iniciar Sessão'} <Play size={20} />
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-brand-900 mb-4 border-b pb-2">Entrada dos Participantes</h3>
            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                 <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64 mix-blend-multiply" />
              </div>
              <div className="text-center w-full">
                <p className="text-sm text-slate-500 font-mono bg-slate-100 p-2 rounded break-all mb-4">
                  {playUrl}
                </p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => navigator.clipboard.writeText(playUrl)}
                    className="text-brand-600 text-sm hover:underline flex items-center justify-center gap-1"
                  >
                    <LinkIcon size={16} /> Copiar Link
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-green-500">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Sessão Ativa</h3>
              <p className="text-3xl font-bold text-brand-600 mb-1">{currentSession.name}</p>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">ID: {currentSession.id}</p>
              
              <div className="mt-8">
                <p className="text-slate-600 mb-4">Quando todos os participantes entrarem, vá para a tela de resultados.</p>
                <button 
                  onClick={goToResults}
                  className="w-full py-4 bg-brand-500 text-white font-bold rounded-xl shadow-lg hover:bg-brand-400 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  Ver Resultados <ArrowRight size={24} />
                </button>
              </div>
            </div>

            <button 
              onClick={() => setCurrentSession(null)}
              className="p-4 bg-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-300 transition"
            >
              ← Criar outra sessão
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;