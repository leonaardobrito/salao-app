import { useEffect, useState, useCallback } from 'react';
import { Beaker, Calendar, Clock, AlertCircle, Inbox } from 'lucide-react';
import { AppointmentService } from '../../services/AppointmentService';

export default function TechnicalHistory({ customerId }: { customerId: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      // NOME ATUALIZADO: getCustomerTechnicalHistory
      const data = await AppointmentService.getCustomerTechnicalHistory(customerId);
      setHistory(data || []);
    } catch (err) {
      setError("Falha ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  if (loading) return <div className="p-12 text-center animate-pulse text-slate-400 font-bold text-xs uppercase tracking-widest">Buscando Fórmulas...</div>;

  if (history.length === 0) return (
    <div className="p-10 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200 mx-4">
      <Inbox className="mx-auto text-slate-200 mb-2" size={32} />
      <p className="text-slate-400 text-sm">Nenhum registro técnico encontrado.</p>
    </div>
  );

  return (
    <div className="px-4 space-y-4 pb-10">
      {history.map((item) => (
        <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-pink-600 font-bold text-xs">
              <Calendar size={14} />
              {new Date(item.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 italic text-sm leading-relaxed">
            "{item.formula}"
          </div>
          {/* Acesso correto ao JOIN: appointments -> appointment_items -> services */}
          <div className="mt-3 flex flex-wrap gap-2">
            {item.appointments?.appointment_items?.map((ai: any, index: number) => (
              <span key={index} className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-2 py-1 rounded-full uppercase">
                {ai.services?.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
