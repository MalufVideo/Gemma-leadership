import React, { useState, useEffect } from 'react';
import { Trash2, Play, Link as LinkIcon, BarChart2, QrCode, Copy, Check, Monitor } from 'lucide-react';
import { createSession, getSessions } from '../services/surveyService';
import { Session } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const [sessionName, setSessionName] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    const data = await getSessions();
    setSessions(data);
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionName.trim()) return;

    setLoading(true);
    const session = await createSession(sessionName);
    setLoading(false);

    if (session) {
      setSessionName('');
      await loadSessions();
      setExpandedSessionId(session.id); // Auto expand new session
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  const getPlayUrl = (sessionId: string) => 
    `${window.location.origin}${window.location.pathname}#/play?sessionId=${sessionId}`;

  const getQrUrl = (sessionId: string) => 
    `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getPlayUrl(sessionId))}`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openPresenterMode = (sessionId: string) => {
    window.open(`#/presenter?sessionId=${sessionId}`, '_blank');
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Painel Administrativo</h1>

      {/* Create Session Card */}
      <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-brand-500 mb-10">
        <h2 className="text-xl font-bold mb-4 text-slate-800">Nova Sessão</h2>
        <form onSubmit={handleCreateSession} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-grow w-full">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Sessão / Turma</label>
            <input 
              type="text" 
              className="w-full p-3 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none placeholder-slate-400"
              placeholder="Ex: Liderança - Turma Outubro"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto bg-brand-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            {loading ? 'Criando...' : 'Criar Sessão'} <Play size={20} />
          </button>
        </form>
      </div>

      <h2 className="text-xl font-bold text-slate-700 mb-4">Histórico de Sessões</h2>

      <div className="flex flex-col gap-4">
        {sessions.length === 0 && (
          <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
            Nenhuma sessão encontrada. Crie uma acima para começar.
          </div>
        )}

        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-300">
            {/* Header Row */}
            <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-slate-800 truncate">{session.name}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Criada em: {new Date(session.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                   onClick={() => navigate(`/results?sessionId=${session.id}`)}
                   className="flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded-lg font-medium transition-colors flex"
                >
                  <BarChart2 size={18} /> Resultados
                </button>
                <button 
                   onClick={() => toggleExpand(session.id)}
                   className={`flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors flex ${expandedSessionId === session.id ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <QrCode size={18} /> {expandedSessionId === session.id ? 'Fechar' : 'Conectar'}
                </button>
              </div>
            </div>

            {/* Expanded QR / Link Area */}
            {expandedSessionId === session.id && (
              <div className="bg-slate-50 border-t border-slate-100 p-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* Left Column: QR and Link */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 shrink-0">
                        <img 
                          src={getQrUrl(session.id)} 
                          alt="QR Code" 
                          className="w-40 h-40 mix-blend-multiply" 
                        />
                      </div>
                      
                      <div className="space-y-4 w-full">
                        <div>
                          <h4 className="font-bold text-slate-700 mb-1">Entrada dos Participantes</h4>
                          <p className="text-sm text-slate-500">Envie o link ou exiba o código.</p>
                        </div>
                        
                        <div className="relative">
                          <input 
                            readOnly
                            type="text" 
                            value={getPlayUrl(session.id)}
                            className="w-full pl-3 pr-12 py-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-600 font-mono shadow-sm"
                          />
                          <button 
                            onClick={() => copyToClipboard(getPlayUrl(session.id), session.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors"
                            title="Copiar URL"
                          >
                            {copiedId === session.id ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Presenter Mode */}
                  <div className="w-full md:w-72 bg-slate-200/50 p-4 rounded-xl border border-slate-200">
                     <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                       <Monitor size={18} /> Modo Apresentação
                     </h4>
                     <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                       Abra uma tela exclusiva para o telão (LED) com o QR Code gigante e botão para revelar os resultados.
                     </p>
                     <button
                        onClick={() => openPresenterMode(session.id)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-lg font-bold hover:bg-slate-700 transition shadow-lg text-sm"
                    >
                        <Monitor size={18} /> Abrir no Telão
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;