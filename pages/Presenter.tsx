import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BarChart2, Loader2, Smartphone, Monitor } from 'lucide-react';
import { getSession } from '../services/surveyService';
import { Session } from '../types';

const Presenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      getSession(sessionId).then(setSession);
    }
  }, [sessionId]);

  if (!sessionId || !session) {
     return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
          <Loader2 className="animate-spin w-12 h-12 text-brand-500" />
          <p className="animate-pulse">Carregando sessão...</p>
        </div>
     );
  }

  const playUrl = `${window.location.origin}${window.location.pathname}#/play?sessionId=${sessionId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(playUrl)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-8 text-white">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Text and Instructions */}
        <div className="space-y-10 text-center lg:text-left order-2 lg:order-1">
          <div>
            <span className="text-brand-400 font-bold tracking-widest uppercase text-lg border border-brand-400 px-3 py-1 rounded-full">
              Sessão Interativa
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold mt-6 leading-tight text-white drop-shadow-lg">
              {session.name}
            </h1>
          </div>
          
          <div className="space-y-6">
             <div className="flex items-center justify-center lg:justify-start gap-4 text-3xl text-slate-300 font-light">
                <Smartphone className="w-10 h-10 text-brand-500" />
                <p>Aponte a câmera do celular</p>
             </div>
             <p className="text-xl font-mono text-slate-400 bg-white/5 p-6 rounded-xl border border-white/10 inline-block">
               {playUrl}
             </p>
          </div>

          <div className="pt-10 border-t border-white/10">
            <button 
              onClick={() => navigate(`/results?sessionId=${sessionId}`)}
              className="group bg-brand-600 hover:bg-brand-500 text-white text-2xl font-bold py-6 px-12 rounded-2xl shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:shadow-[0_0_50px_rgba(14,165,233,0.5)] transition-all transform hover:scale-105 flex items-center gap-4 mx-auto lg:mx-0 ring-4 ring-brand-700/50"
            >
              <BarChart2 className="w-8 h-8 group-hover:animate-bounce" />
              <span>Exibir Resultados</span>
            </button>
            <p className="text-slate-500 mt-4 text-sm flex items-center gap-2 justify-center lg:justify-start">
               <Monitor size={14} /> 
               Clique quando todos tiverem respondido
            </p>
          </div>
        </div>

        {/* Right Side: Giant QR Code */}
        <div className="flex justify-center order-1 lg:order-2">
          <div className="bg-white p-8 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] mix-blend-multiply" 
            />
            <div className="text-center mt-4 text-slate-900 font-bold text-xl uppercase tracking-widest opacity-30">
                GemmaConsult
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presenter;