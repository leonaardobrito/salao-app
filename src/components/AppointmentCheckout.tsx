import { useState } from 'react';
import { AppointmentService, type ProductConsumption } from '../services/AppointmentService';
import { CheckCircle, Loader2 } from 'lucide-react'; // Ícones para feedback visual

interface AppointmentCheckoutProps {
  appointmentId: string;
  consumptions: ProductConsumption[];
  formula: string;
  onSuccess?: () => void; // Callback para limpar a tela após o sucesso
}

export default function AppointmentCheckout({ 
  appointmentId, 
  consumptions, 
  formula,
  onSuccess 
}: AppointmentCheckoutProps) {
  const [loading, setLoading] = useState(false);

  const handleFinishAtendimento = async () => {
    // Validação básica antes de enviar
    if (consumptions.length === 0) {
      return alert("Adicione ao menos um produto à mistura!");
    }

    setLoading(true);

    try {
      await AppointmentService.checkout(
        appointmentId,
        consumptions,
        formula,
        'pix' // Valor fixo para teste, depois pode vir de um Select
      );
      
      alert("✅ Atendimento finalizado com sucesso!");
      if (onSuccess) onSuccess();
      
    } catch (err: any) {
      console.error(err);
      alert("❌ Falha no banco: " + (err.message || "Erro desconhecido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-2">
      <button 
        disabled={loading || !appointmentId}
        onClick={handleFinishAtendimento}
        className={`
          w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all
          active:scale-95 shadow-lg
          ${loading 
            ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
            : "bg-pink-600 text-white shadow-pink-200 active:bg-pink-700"}
        `}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <CheckCircle size={24} />
        )}
        {loading ? "Processando..." : "Finalizar e Abater Estoque"}
      </button>
      
      <p className="text-[10px] text-slate-400 text-center mt-3 uppercase tracking-widest font-semibold">
        Operação Atômica via Supabase RPC
      </p>
    </div>
  );
}

// import { useState } from 'react';
// import { AppointmentService, type ProductConsumption } from '../services/AppointmentService';

// export default function AppointmentCheckout() {
//   const [loading, setLoading] = useState(false);

//   const handleFinishAtendimento = async () => {
//     setLoading(true);

//     // Dados fictícios vindos do seu formulário
//     const appointmentId = "ID_DO_AGENDAMENTO_ATUAL"; 
//     const consumptions: ProductConsumption[] = [
//       { product_id: "ID_TUBO_COR", quantity: 30.5 },
//       { product_id: "ID_OXIDANTE", quantity: 45.0 }
//     ];
//     const formula = "6.0 (30g) + 20vol (45ml). Tempo de pausa: 35min.";

//     try {
//       await AppointmentService.checkout(
//         appointmentId,
//         consumptions,
//         formula,
//         'pix'
//       );
//       alert("✅ Atendimento finalizado! Estoque baixado e fórmula salva.");
//     } catch (err: any) {
//       alert("❌ Erro: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <button 
//       disabled={loading}
//       onClick={handleFinishAtendimento}
//       className="w-full py-4 bg-pink-600 text-white font-bold rounded-2xl"
//     >
//       {loading ? "Processando..." : "Finalizar Atendimento"}
//     </button>
//   );
// }