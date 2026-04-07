import { LogOut, Heart, Calendar, Beaker } from 'lucide-react';
import { AuthService } from '../services/AuthService';

export default function CustomerPortal({ session, salon }: any) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 leading-none">Olá, {session.user.user_metadata.full_name}!</h1>
          <p className="text-pink-600 font-bold text-xs mt-1 uppercase tracking-widest">Bem-vinda ao {salon?.name}</p>
        </div>
        <button onClick={() => AuthService.signOut()} className="text-slate-300 hover:text-red-500 transition-colors">
          <LogOut size={24} />
        </button>
      </header>

      <main className="space-y-6 max-w-md mx-auto">
        {/* Card de Boas-vindas */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-4">
             <Heart fill="currentColor" size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Sua beleza em dia</h2>
          <p className="text-slate-400 text-sm mt-2">Veja seus agendamentos e seu histórico de cores técnico.</p>
        </div>

        {/* Menu do Cliente */}
        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-3">
             <Calendar className="text-indigo-500" size={28} />
             <span className="font-bold text-sm">Agendamentos</span>
          </button>
          <button className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col items-center gap-3">
             <Beaker className="text-pink-500" size={28} />
             <span className="font-bold text-sm">Minhas Cores</span>
          </button>
        </div>
      </main>
    </div>
  );
}