import { useEffect, useState } from 'react';
import { Clock, ChevronRight, CalendarCheck, Trash2 } from 'lucide-react';
import { AppointmentService } from '../../services/AppointmentService';
import { useSalon } from '../../context/SalonContext';

interface Props {
  onSelectAppointment: (customerId: string, appointmentId: string) => void;
}

export default function DailyAgenda({ onSelectAppointment }: Props) {
  const { salon } = useSalon();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgenda = async () => {
    if (!salon?.id) return;
    try {
      const data = await AppointmentService.getTodayAppointments(salon.id);
      setAppointments(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAgenda(); }, [salon?.id]);

  const handleDelete = async (id: string) => {
    if (confirm("Deseja cancelar este agendamento?")) {
      await AppointmentService.deleteAppointment(id);
      fetchAgenda();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-600 text-xs font-bold uppercase">Agenda...</div>;

  return (
    <div className="px-4 space-y-4">
      <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] ml-2">Agenda de Hoje</h3>
      {appointments.length === 0 ? (
        <div className="bg-white p-10 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
          <CalendarCheck className="mx-auto text-slate-300 mb-2" size={40} />
          <p className="text-slate-600 text-sm">Sem compromissos.</p>
        </div>
      ) : (
        appointments.map((apt) => (
          <div key={apt.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all">
            <div className="flex items-center gap-4 flex-1" onClick={() => onSelectAppointment(apt.customer.id, apt.id)}>
              <div className="text-center border-r pr-4 border-slate-100">
                <p className="text-sm font-black text-slate-950 leading-none">
                  {new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-[8px] font-bold text-slate-600 uppercase mt-1">Check-in</p>
              </div>
              <div className="text-left">
                <p className="font-black text-slate-950 text-sm group-hover:text-pink-600 transition-colors uppercase tracking-tight">
                  {apt.customer.name}
                </p>
                <p className="text-[10px] text-slate-600 font-medium italic">
                  {/* Ajuste no caminho do JOIN vindo do Service */}
                  {apt.appointment_items?.[0]?.services?.name || 'Serviço Geral'}
                </p>
              </div>
            </div>
            
            <button onClick={() => handleDelete(apt.id)} className="p-3 text-slate-400 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
