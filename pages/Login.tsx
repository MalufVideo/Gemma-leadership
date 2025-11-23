import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Default to admin if no specific return destination
  const from = location.state?.from?.pathname || '/admin';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'nielsegemma2025') {
      sessionStorage.setItem('gemmaconsult_auth', 'true');
      navigate(from, { replace: true });
    } else {
      setError(true);
      // Shake animation trigger could go here
    }
  };

  return (
    <div className="min-h-screen bg-brand-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-brand-600 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-500 mb-4 shadow-inner">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold">Acesso Restrito</h2>
          <p className="text-brand-100 text-sm mt-2">Área administrativa e resultados</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha de Administrador</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                className={`w-full px-4 py-3 rounded-xl border text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all ${
                  error 
                    ? 'border-red-500 focus:ring-red-100 bg-red-50' 
                    : 'border-slate-200 focus:ring-brand-100 focus:border-brand-500'
                }`}
                placeholder="••••••••"
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1 font-medium">
                  Senha incorreta. Tente novamente.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Entrar <ArrowRight size={20} />
            </button>
          </form>
          
          <div className="mt-6 text-center">
             <button 
               onClick={() => navigate('/')}
               className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
             >
               Voltar ao Início
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;