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

// import { useEffect, useState } from 'react';
// import { AppointmentService } from '../../services/AppointmentService';
// import { Clock, Calendar, Beaker } from 'lucide-react';

// export default function TechnicalHistory({ customerId }: { customerId: string }) {
//   const [history, setHistory] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (customerId) {
//       AppointmentService.getCustomerHistory(customerId)
//         .then(setHistory)
//         .finally(() => setLoading(false));
//     }
//   }, [customerId]);

//   if (loading) return <p className="p-4 text-center text-slate-400">Carregando histórico...</p>;

//   return (
//     <div className="space-y-4 p-4">
//       <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-2">Histórico Técnico</h3>
      
//       {history.length === 0 && (
//         <div className="bg-white p-8 rounded-3xl text-center border-2 border-dashed border-slate-100">
//           <p className="text-slate-400 text-sm">Nenhum registro anterior.</p>
//         </div>
//       )}

//       {history.map((item) => (
//         <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 space-y-3">
//           <div className="flex justify-between items-start">
//             <div className="flex items-center gap-2 text-pink-600">
//               <Calendar size={14} />
//               <span className="text-xs font-bold">
//                 {new Date(item.created_at).toLocaleDateString('pt-BR')}
//               </span>
//             </div>
//             <div className="flex items-center gap-1 text-slate-400">
//               <Clock size={12} />
//               <span className="text-[10px] font-medium">
//                 {new Date(item.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
//               </span>
//             </div>
//           </div>

//           <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
//             <div className="flex items-start gap-2">
//               <Beaker size={16} className="text-slate-400 mt-1" />
//               <p className="text-slate-700 text-sm leading-relaxed italic">
//                 "{item.formula || 'Sem observações técnicas.'}"
//               </p>
//             </div>
//           </div>
          
//           <div className="flex flex-wrap gap-2">
//              {/* Exemplo de tag de serviço vinda do JOIN */}
//              <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-1 rounded-full font-bold uppercase">
//                {item.appointments?.appointment_items?.[0]?.services?.name || 'Serviço'}
//              </span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }