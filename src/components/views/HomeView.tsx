import { Search, Package, Settings, UserPlus } from 'lucide-react';
import InviteManager from '../InviteManager';

export const HomeView = ({ onNavigate, role }: { onNavigate: (v: any) => void, role: string | null }) => (
  <div className="space-y-6">
    <section className="grid grid-cols-2 gap-4">
      <button 
        onClick={() => onNavigate('search')}
        className="col-span-2 h-44 bg-pink-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-xl shadow-pink-200 active:scale-[0.98] transition-all group"
      >
        <Search size={32} className="group-hover:scale-110 transition-transform" />
        <div className="text-left">
          <p className="text-2xl font-black leading-tight">Atendimento</p>
          <p className="text-pink-100 text-xs font-medium opacity-80">Iniciar mistura ou ver histórico</p>
        </div>
      </button>

      <div className="contents">
        <HomeCard 
          icon={<Package size={28} className="text-indigo-500" />} 
          title="Estoque" 
          subtitle="Produtos" 
          onClick={() => onNavigate('inventory')} 
        />
        <HomeCard 
          icon={<Settings size={28} className="text-slate-400" />} 
          title="Ajustes" 
          subtitle="Configurações" 
          onClick={() => onNavigate('settings')} 
        />
      </div>
    </section>

    {role === 'owner' && (
      <div className="animate-in slide-in-from-bottom-2 duration-700">
        <InviteManager />
      </div>
    )}
  </div>
);

const HomeCard = ({ icon, title, subtitle, onClick }: any) => (
  <button 
    onClick={onClick}
    className="h-40 bg-white rounded-[2.5rem] p-6 text-slate-800 flex flex-col justify-between shadow-sm border border-slate-100 active:scale-95 transition-all text-left"
  >
    {icon}
    <div>
      <p className="font-bold text-lg">{title}</p>
      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{subtitle}</p>
    </div>
  </button>
);