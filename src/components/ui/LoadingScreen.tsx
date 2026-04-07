import { Loader2, Sparkles } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Elementos Decorativos de Fundo (Minimalistas) */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-pink-100/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-indigo-100/20 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Logo Container com Animação de Respiração */}
        <div className="relative mb-8 group">
          {/* Glow effect atrás do ícone */}
          <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse" />
          
          <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 flex items-center justify-center relative transform rotate-3 animate-bounce-gentle">
            <span className="text-pink-600 text-5xl font-black italic select-none">S</span>
            
            {/* Pequeno detalhe brilhante no canto do ícone */}
            <div className="absolute -top-1 -right-1 text-pink-300">
               <Sparkles size={20} fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Texto de Identidade */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase">
            Salao <span className="text-pink-600">App</span>
          </h2>
          
          {/* Status Bar Elegante */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-pink-500/60" size={16} strokeWidth={3} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">
                Sincronizando Studio
              </span>
            </div>
            
            {/* Linha de progresso minimalista (indeterminada) */}
            <div className="w-32 h-[2px] bg-slate-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-pink-500/40 animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer de Versão (Discreto) */}
      <div className="absolute bottom-10 left-0 right-0 text-center">
        <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
          High Performance Management • v1.5
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-8px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-bounce-gentle {
          animation: bounce-gentle 4s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}} />
    </div>
  );
};