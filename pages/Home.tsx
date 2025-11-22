import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, BarChart2, Settings } from 'lucide-react';

const Home: React.FC = () => {
  const playUrl = `${window.location.href}#/play`; // Construct the play URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(playUrl)}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-brand-900 to-brand-600 p-4 text-white">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-12 items-center">
        
        <div className="flex-1 text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Avaliação de <br/>
            <span className="text-brand-500">Liderança</span>
          </h1>
          <p className="text-xl text-brand-100 max-w-lg">
            Uma pesquisa interativa em tempo real. Escaneie o código para participar através do seu celular.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
             <Link to="/play" className="flex items-center gap-2 px-6 py-3 bg-white text-brand-900 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
               <Smartphone size={20} />
               Participar (Mobile)
             </Link>
             <Link to="/results" className="flex items-center gap-2 px-6 py-3 bg-brand-500 text-white rounded-full font-bold shadow-lg hover:bg-brand-400 transition-colors">
               <BarChart2 size={20} />
               Ver Resultados
             </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <h3 className="text-brand-900 font-bold text-center mb-4 uppercase tracking-wider">Escaneie para Entrar</h3>
            <div className="bg-gray-100 p-2 rounded-lg">
               <img src={qrCodeUrl} alt="QR Code to Join" className="w-64 h-64 mix-blend-multiply" />
            </div>
            <p className="text-center text-gray-500 text-sm mt-4 font-mono truncate w-64 mx-auto">
              {playUrl}
            </p>
          </div>
        </div>

      </div>
      
      <div className="fixed bottom-4 right-4">
        <Link to="/admin" className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors">
          <Settings className="text-white/50" size={24} />
        </Link>
      </div>
    </div>
  );
};

export default Home;