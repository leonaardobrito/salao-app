import { useState } from 'react';
import { History, Beaker } from 'lucide-react';
import TechnicalHistory from '../TechnicalHistory';
import AppointmentCheckout from '../AppointmentCheckout';

export const ProfileView = ({ customerId }: { customerId: string }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'checkout'>('history');

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {/* Segmented Control (Tabs) */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'history' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400'
          }`}
        >
          <History size={18} /> Histórico
        </button>
        <button 
          onClick={() => setActiveTab('checkout')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'checkout' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400'
          }`}
        >
          <Beaker size={18} /> Nova Mistura
        </button>
      </div>

      {activeTab === 'history' ? (
        <TechnicalHistory customerId={customerId} />
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-dashed border-slate-200 text-center italic text-slate-400 text-sm">
            <Beaker className="mx-auto mb-4 opacity-20" size={48} />
            Inicie a pesagem dos produtos para este atendimento.
          </div>
          
          <AppointmentCheckout 
            appointmentId="ID_DINAMICO_AQUI" 
            consumptions={[]} // Aqui entrará o estado do Mixer futuramente
            formula="" 
            onSuccess={() => setActiveTab('history')}
          />
        </div>
      )}
    </div>
  );
};