import InviteManager from '../InviteManager';
import { ShieldCheck, LogOut } from 'lucide-react';
import { AuthService } from '../../services/AuthService';
import type { UserRole } from '../../types';

export const SettingsView = ({ role }: { role: UserRole | null }) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-left duration-500">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-3 text-indigo-600 mb-4">
          <ShieldCheck size={24} />
          <h3 className="font-black uppercase text-xs tracking-widest">Segurança & Acesso</h3>
        </div>
        
        <p className="text-sm text-slate-500">
          Você está conectado como um usuário de nível <span className="font-bold text-pink-600 uppercase">{role}</span>.
        </p>

        <button 
          onClick={() => AuthService.signOut()}
          className="w-full py-4 bg-slate-50 text-red-500 rounded-2xl font-bold flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
        >
          <LogOut size={20} /> Sair do Sistema
        </button>
      </div>

      {role === 'owner' && <InviteManager />}
    </div>
  );
};