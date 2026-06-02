import { useState, useEffect, useCallback } from 'react';
import { X, Calendar, Clock, User, Scissors, Save, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Importação que faltava
import { AppointmentService } from '../../services/AppointmentService';
import CustomerSearch from '../CustomerSearch'; // Caminho corrigido (mesma pasta)
import { useSalon } from '../../context/SalonContext';
import { useAuth } from '../../hooks/useAuth';
import type { Customer, CreateAppointmentInput } from '../../types';

interface AppointmentFormProps {
  onClose: () => void;
  onRefresh: () => void;
}

export default function AppointmentForm({ onClose, onRefresh }: AppointmentFormProps) {
  const { salon } = useSalon();
  const { profile } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [formData, setFormData] = useState({
    service_id: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
  });

  // Carregar serviços vinculados ao salão logado
  const fetchServices = useCallback(async () => {
    if (!salon?.id) return;
    
    const { data, error } = await supabase
      .from('services')
      .select('id, name, price')
      .eq('salon_id', salon.id) // Segurança Multi-tenant
      .order('name');

    if (!error) setServices(data || []);
  }, [salon?.id]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCustomer || !formData.service_id || !salon?.id || !profile?.id) {
      return;
    }

    setLoading(true);
    try {
      // ISO String precisa considerar o timezone local ou ser UTC puro
      const startTime = new Date(`${formData.date}T${formData.time}:00`).toISOString();

      const appointmentData: CreateAppointmentInput = {
        salon_id: salon.id,
        customer_id: selectedCustomer.id,
        professional_id: profile.id,
        service_id: formData.service_id,
        start_time: startTime,
      };

      await AppointmentService.createAppointment(appointmentData);
      
      onRefresh();
      onClose();
    } catch (err: any) {
      console.error('[AppointmentForm] Error:', err.message);
      alert("Erro ao criar agendamento: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop com Blur Sênior */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" 
        onClick={onClose} 
      />
      
      <form 
        onSubmit={handleSubmit} 
        className="relative w-full max-w-lg bg-white rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl p-8 animate-in slide-in-from-bottom duration-500 max-h-[95vh] overflow-y-auto border-t border-white/20"
      >
        {/* Header do Formulário */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tighter uppercase">Novo Horário</h2>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Reserva de Procedimento</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 bg-slate-50 rounded-full text-slate-600 active:scale-90 transition-transform"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Seção Cliente */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Cliente Selecionada</label>
            {selectedCustomer ? (
              <div className="p-5 bg-pink-50 rounded-[1.5rem] border border-pink-100 flex justify-between items-center animate-in zoom-in-95">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 shadow-sm font-black">
                     {selectedCustomer.name[0]}
                   </div>
                   <div>
                     <span className="font-bold text-pink-900 block leading-none">{selectedCustomer.name}</span>
                     <span className="text-[10px] text-pink-400 font-medium">{selectedCustomer.phone}</span>
                   </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedCustomer(null)} 
                  className="px-3 py-1 bg-white text-pink-500 text-[10px] font-black rounded-lg border border-pink-100 uppercase"
                >
                  Trocar
                </button>
              </div>
            ) : (
              <CustomerSearch onSelect={setSelectedCustomer} />
            )}
          </div>

          {/* Seção Serviço */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Procedimento</label>
            <div className="relative group">
              <Scissors className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={20} />
              <select 
                required
                value={formData.service_id}
                onChange={e => setFormData({...formData, service_id: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none appearance-none outline-none focus:ring-2 focus:ring-pink-500/20 font-bold text-slate-800 transition-all"
              >
                <option value="">Escolha o serviço...</option>
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} — R$ {s.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Data</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                <input 
                  type="date" 
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-800 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-2">Hora</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                <input 
                  type="time" 
                  required
                  value={formData.time}
                  onChange={e => setFormData({...formData, time: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-800 focus:ring-2 focus:ring-pink-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          disabled={loading || !selectedCustomer || !formData.service_id}
          className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-lg mt-10 flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 active:scale-95 transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          CONCLUIR RESERVA
        </button>
      </form>
    </div>
  );
}