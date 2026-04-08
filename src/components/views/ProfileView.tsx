import { useState } from 'react';
import { History, FlaskConical, AlertCircle } from 'lucide-react';

import TechnicalHistory from '../appointments/TechnicalHistory';
import AppointmentCheckout from '../appointments/AppointmentCheckout';
import { ProductMixer } from '../inventory/ProductMixer';

import type { ProductConsumption } from '../../types';

interface ProfileViewProps {
  customerId: string;
  appointmentId: string | null; // Agora o ID pode vir nulo da busca
}

export const ProfileView = ({ customerId, appointmentId }: ProfileViewProps) => {
  const [activeTab, setActiveTab] = useState<'history' | 'checkout'>('history');
  const [consumptions, setConsumos] = useState<ProductConsumption[]>([]);
  const [formulaText, setFormulaText] = useState('');

  const handleMixerChange = (newConsumptions: ProductConsumption[], newFormula: string) => {
    setConsumos(newConsumptions);
    setFormulaText(newFormula);
  };

  const handleCheckoutSuccess = () => {
    setActiveTab('history');
    setConsumos([]);
    setFormulaText('');
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      
      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === 'history' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'
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
          <FlaskConical size={18} /> Nova Mistura
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'history' ? (
          <TechnicalHistory customerId={customerId} />
        ) : (
          <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            
            <section className="space-y-4">
              <div className="px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Preparação Técnica
                </h3>
                <p className="text-xs text-slate-500 italic">Pesagem de coloração e oxidantes</p>
              </div>
              
              <ProductMixer onFormulaChange={handleMixerChange} />
            </section>

            <section className="pt-4 border-t border-slate-100">
              {appointmentId ? (
                <AppointmentCheckout 
                  appointmentId={appointmentId} 
                  consumptions={consumptions} 
                  formula={formulaText} 
                  onSuccess={handleCheckoutSuccess}
                />
              ) : (
                /* UX Sênior: Caso o profissional busque um cliente que não está na agenda */
                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 flex flex-col items-center text-center gap-3">
                  <AlertCircle className="text-amber-500" />
                  <p className="text-xs text-amber-700 font-medium">
                    Esta cliente não possui um agendamento ativo para hoje. 
                    Crie um agendamento na agenda para poder baixar o estoque.
                  </p>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
// import { useState } from 'react';
// import { History, FlaskConical } from 'lucide-react';

// // Appointment Domain Components (UI related to the service flow)
// import TechnicalHistory from '../appointments/TechnicalHistory';
// import AppointmentCheckout from '../appointments/AppointmentCheckout';

// // Inventory Domain Components
// import { ProductMixer } from '../inventory/ProductMixer';

// // Types
// import type { ProductConsumption } from '../../types';

// interface ProfileViewProps {
//   customerId: string;
// }

// export const ProfileView = ({ customerId }: ProfileViewProps) => {
//   const [activeTab, setActiveTab] = useState<'history' | 'checkout'>('history');

//   // Business Logic State
//   const [consumptions, setConsumos] = useState<ProductConsumption[]>([]);
//   const [formulaText, setFormulaText] = useState('');

//   const handleMixerChange = (newConsumptions: ProductConsumption[], newFormula: string) => {
//     setConsumos(newConsumptions);
//     setFormulaText(newFormula);
//   };

//   const handleCheckoutSuccess = () => {
//     setActiveTab('history');
//     setConsumos([]);
//     setFormulaText('');
//   };

//   return (
//     <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      
//       {/* Tab Navigation - Apple Style Segmented Control */}
//       <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
//         <button 
//           onClick={() => setActiveTab('history')}
//           className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
//             activeTab === 'history' 
//               ? 'bg-slate-900 text-white shadow-lg' 
//               : 'text-slate-400 active:bg-slate-50'
//           }`}
//         >
//           <History size={18} /> Histórico
//         </button>
//         <button 
//           onClick={() => setActiveTab('checkout')}
//           className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
//             activeTab === 'checkout' 
//               ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' 
//               : 'text-slate-400 active:bg-slate-50'
//           }`}
//         >
//           <FlaskConical size={18} /> Nova Mistura
//         </button>
//       </div>

//       <div className="mt-4">
//         {activeTab === 'history' ? (
//           <TechnicalHistory customerId={customerId} />
//         ) : (
//           <div className="space-y-8 pb-24 animate-in fade-in duration-500">
            
//             <section className="space-y-4">
//               <div className="px-2">
//                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
//                   Preparação Técnica
//                 </h3>
//                 <p className="text-xs text-slate-500 italic">Pesagem de coloração e oxidantes</p>
//               </div>
              
//               <ProductMixer onFormulaChange={handleMixerChange} />
//             </section>

//             <section className="pt-4 border-t border-slate-100">
//               <AppointmentCheckout 
//                 appointmentId="CURRENT_APPOINTMENT_ID" 
//                 consumptions={consumptions} 
//                 formula={formulaText} 
//                 onSuccess={handleCheckoutSuccess}
//               />
//             </section>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };