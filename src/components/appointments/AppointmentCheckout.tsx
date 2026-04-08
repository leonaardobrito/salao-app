import { useState } from 'react';
import { CheckCircle, Loader2, AlertCircle, Wallet } from 'lucide-react';
import { AppointmentService } from '../../services/AppointmentService';
import type { ProductConsumption, PaymentMethod } from '../../types';

interface AppointmentCheckoutProps {
  appointmentId: string | null; // Alterado para aceitar null com segurança
  consumptions: ProductConsumption[];
  formula: string;
  onSuccess?: () => void;
}

export default function AppointmentCheckout({ 
  appointmentId, 
  consumptions, 
  formula,
  onSuccess 
}: AppointmentCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');

  const handleFinishAtendimento = async () => {
    // 1. Validação Defensiva (Engenharia Sênior)
    if (!appointmentId || appointmentId.length < 30) {
      return alert("Erro: ID de agendamento inválido ou ausente.");
    }

    if (consumptions.length === 0) {
      return alert("A mistura está vazia. Adicione produtos antes de finalizar.");
    }

    setLoading(true);

    try {
      // 2. Chamada ao Service (Camada de Domínio)
      await AppointmentService.checkout(
        appointmentId,
        consumptions,
        formula,
        paymentMethod
      );
      
      alert("✅ Atendimento finalizado! Estoque atualizado e histórico salvo.");
      if (onSuccess) onSuccess();
      
    } catch (err: any) {
      console.error('[AppointmentCheckout] Fallback:', err);
      alert("❌ Erro no fechamento: " + (err.message || "Verifique a conexão"));
    } finally {
      setLoading(false);
    }
  };

  // Se não houver ID, o componente avisa o usuário (UX Sênior)
  if (!appointmentId) {
    return (
      <div className="mx-4 p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-center gap-4 animate-pulse">
        <AlertCircle className="text-amber-500 shrink-0" size={24} />
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          Selecione uma cliente na <strong>Agenda</strong> para habilitar o fechamento técnico e baixa de estoque.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-6">
      {/* Seletor de Pagamento Minimalista */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="text-slate-400" size={18} />
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Forma de Recebimento</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {(['pix', 'credit_card', 'debit_card', 'cash'] as PaymentMethod[]).map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                paymentMethod === method 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-slate-50 text-slate-400 border-transparent hover:border-slate-200'
              }`}
            >
              {method.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Botão de Ação Principal */}
      <div className="pb-8">
        <button 
          disabled={loading}
          onClick={handleFinishAtendimento}
          className={`
            w-full py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 transition-all
            active:scale-95 shadow-2xl
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
          {loading ? "Processando..." : "Finalizar & Abater"}
        </button>
        
        <p className="text-[9px] text-slate-400 text-center mt-4 uppercase tracking-[0.3em] font-bold opacity-60">
          Sync Atômico • PostgreSQL ACID
        </p>
      </div>
    </div>
  );
}