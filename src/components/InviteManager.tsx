import { useState } from 'react';
import { UserPlus, Copy, Check, Sparkles } from 'lucide-react';
import { InviteService } from '../services/InviteService';
import { useSalon } from '../context/SalonContext';

export default function InviteManager() {
  const { salon } = useSalon();
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = async () => {
    if (!salon?.id) return;
    const token = await InviteService.createInvite(salon.id, null, 'professional');
    const url = `${window.location.origin}/invite/${token}`;
    setInviteUrl(url);
  };

  const copy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <UserPlus size={24} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 leading-tight">Equipe</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Adicionar Profissional</p>
          </div>
        </div>
        {!inviteUrl && (
          <button onClick={generate} className="p-3 bg-slate-50 rounded-xl text-slate-900 hover:bg-slate-100 transition-colors">
            <Sparkles size={20} />
          </button>
        )}
      </div>

      {inviteUrl && (
        <div className="animate-in zoom-in-95 duration-500">
          <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2">
            <input 
              readOnly 
              value={inviteUrl} 
              className="flex-1 bg-transparent border-none text-[10px] font-mono p-2 text-slate-500 truncate outline-none" 
            />
            <button 
              onClick={copy}
              className={`p-3 rounded-xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white shadow-sm text-slate-400'}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-[9px] text-center text-slate-400 mt-3 font-medium uppercase tracking-tighter italic">
            O link expira em 48 horas por segurança.
          </p>
        </div>
      )}
    </div>
  );
}