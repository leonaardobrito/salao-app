import { LogOut, ArrowLeft } from 'lucide-react';
import { AuthService } from '../../services/AuthService';

interface MainLayoutProps {
  children: React.ReactNode;
  view: string;
  setView: (v: any) => void;
  salonName?: string;
  customerName?: string;
}

export const MainLayout = ({ children, view, setView, salonName, customerName }: MainLayoutProps) => {
  const isRoot = view === 'home';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      <header className="bg-white/80 backdrop-blur-md p-6 sticky top-0 z-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isRoot && (
            <button 
              onClick={() => setView('home')} 
              className="p-2 bg-slate-50 rounded-xl text-slate-900 active:scale-95 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-xl font-black text-blue-900 tracking-tighter uppercase leading-none">
              {isRoot ? salonName : customerName || view}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Sistema Ativo</span>
            </div>
          </div>
        </div>
        
        {isRoot && (
          <button 
            onClick={() => AuthService.signOut()}
            className="p-2 text-slate-900 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        )}
      </header>

      <main className="flex-1 p-4 max-w-md mx-auto w-full pb-28 animate-in fade-in duration-500">
        {children}
      </main>
    </div>
  );
};