import { useEffect, useState, useMemo } from 'react';
import { 
  Clock, 
  ChevronRight, 
  CalendarCheck, 
  Trash2, 
  MessageSquare, 
  CheckCircle2, 
  Calendar as CalendarIcon,
  ChevronLeft,
  Play
} from 'lucide-react';
import { AppointmentService } from '../../services/AppointmentService';
import { useSalon } from '../../context/SalonContext';
import type { AppointmentWithRelations, AppointmentStatus } from '../../types';
import { format, addDays, subDays, isSameDay, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  onSelectAppointment: (customerId: string, appointmentId: string) => void;
  onStartCheckout: (appointmentId: string) => void;
}

const statusConfig: Record<AppointmentStatus, { label: string, color: string, bg: string }> = {
  scheduled: { label: 'Agendado', color: 'text-blue-600', bg: 'bg-blue-50' },
  confirmed: { label: 'Confirmado', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  completed: { label: 'Finalizado', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  cancelled: { label: 'Cancelado', color: 'text-slate-400', bg: 'bg-slate-50' }
};

export default function DailyAgenda({ onSelectAppointment, onStartCheckout }: Props) {
  const { salon } = useSalon();
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Gerar dias para o scroll lateral (3 dias antes e 7 depois)
  const days = useMemo(() => {
    return Array.from({ length: 11 }, (_, i) => addDays(subDays(new Date(), 3), i));
  }, []);

  const fetchAgenda = async () => {
    if (!salon?.id) return;
    setLoading(true);
    try {
      const start = startOfDay(selectedDate);
      const end = addDays(start, 1);
      
      const data = await AppointmentService.getAppointments(salon.id, start, end);
      setAppointments(data);
    } catch (err) {
      console.error('Erro ao carregar agenda:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchAgenda(); 
  }, [salon?.id, selectedDate]);

  const handleWhatsApp = (apt: AppointmentWithRelations) => {
    const time = format(new Date(apt.start_time), "HH:mm");
    const message = `Olá ${apt.customer.name}! Confirmamos seu horário no ${salon?.name} hoje às ${time}. Podemos contar com você?`;
    const phone = apt.customer.phone?.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja cancelar este agendamento?")) {
      await AppointmentService.deleteAppointment(id);
      fetchAgenda();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header com Seletor de Data Lateral */}
      <div className="bg-white pt-4 pb-6 px-4 shadow-sm rounded-b-[2.5rem] sticky top-0 z-10">
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tighter">Minha Agenda</h2>
          <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
            <CalendarIcon size={18} />
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-20 rounded-2xl transition-all ${
                  isSelected 
                    ? 'bg-slate-950 text-white shadow-lg shadow-slate-200 scale-105' 
                    : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                  {format(day, 'EEE', { locale: ptBR })}
                </span>
                <span className="text-lg font-black leading-none">
                  {format(day, 'dd')}
                </span>
                {isToday && !isSelected && <div className="w-1 h-1 bg-pink-500 rounded-full mt-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline List */}
      <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-pink-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sincronizando Horários</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white p-12 rounded-[3rem] border border-dashed border-slate-200 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <CalendarCheck className="text-slate-300" size={32} />
            </div>
            <h3 className="font-bold text-slate-900">Nenhum agendamento</h3>
            <p className="text-xs text-slate-500 mt-1">Sua agenda está livre para esta data.</p>
          </div>
        ) : (
          appointments.map((apt) => {
            const config = statusConfig[apt.status] || statusConfig.scheduled;
            return (
              <div 
                key={apt.id} 
                className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group active:scale-[0.99] transition-all"
              >
                <div className="p-5 flex items-start gap-4">
                  {/* Hora e Status Lateral */}
                  <div className="flex flex-col items-center py-1 min-w-[50px]">
                    <span className="text-sm font-black text-slate-950">
                      {format(new Date(apt.start_time), 'HH:mm')}
                    </span>
                    <div className={`mt-2 px-2 py-0.5 rounded-full ${config.bg}`}>
                      <span className={`text-[8px] font-black uppercase tracking-tighter ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>

                  {/* Detalhes do Cliente e Serviço */}
                  <div className="flex-1 min-w-0" onClick={() => onSelectAppointment(apt.customer_id, apt.id)}>
                    <h4 className="font-black text-slate-950 uppercase tracking-tight truncate group-hover:text-pink-600 transition-colors">
                      {apt.customer.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 flex items-center gap-1">
                      <Clock size={10} />
                      {apt.appointment_items?.[0]?.services?.name || 'Serviço Geral'}
                    </p>
                    
                    {apt.notes && (
                      <p className="text-[10px] text-slate-400 italic mt-2 line-clamp-1 bg-slate-50 p-1.5 rounded-lg border-l-2 border-slate-200">
                        "{apt.notes}"
                      </p>
                    )}
                  </div>

                  {/* Ações Rápidas */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleWhatsApp(apt)}
                      className="p-2.5 bg-green-50 text-green-600 rounded-xl active:scale-90 transition-transform"
                    >
                      <MessageSquare size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(apt.id)}
                      className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl active:scale-90 transition-transform"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Footer do Card - Botão de Check-out */}
                {apt.status !== 'completed' && (
                  <button 
                    onClick={() => onStartCheckout(apt.id)}
                    className="w-full py-4 bg-slate-950 hover:bg-pink-600 text-white flex items-center justify-center gap-2 transition-all active:bg-pink-700"
                  >
                    <Play size={14} className="fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Iniciar Atendimento</span>
                  </button>
                )}
                {apt.status === 'completed' && (
                  <div className="w-full py-3 bg-emerald-50 flex items-center justify-center gap-2 border-t border-emerald-100">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Finalizado com Sucesso</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
