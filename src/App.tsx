import { useState } from 'react';
// 1. Importamos o tipo para garantir que os dados de teste estejam corretos
import { type ProductConsumption } from './services/AppointmentService';
import AppointmentCheckout from './components/AppointmentCheckout';

function App() {
  // 2. Simulamos o estado que viria dos seus outros componentes (como o seletor de gramas)
  // Em um cenário real, esses dados seriam alterados pelos inputs de mistura
  const [formula, setFormula] = useState("6.0 (30g) + OX 20vol (45ml)");
  const [consumos, setConsumos] = useState<ProductConsumption[]>([
    { product_id: "ID-DO-PRODUTO-NO-SUPABASE", quantity: 30.5 }
  ]);

  // 3. ID de teste (Pegue um ID real na sua tabela 'appointments' do Supabase para testar o clique)
  const TEST_APPOINTMENT_ID = "00000000-0000-0000-0000-000000000000";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header Mobile First */}
      <header className="bg-white p-6 shadow-sm border-b border-slate-100">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">
          FINALIZAR <span className="text-pink-600">ATENDIMENTO</span>
        </h1>
        <p className="text-xs text-slate-400 font-bold uppercase mt-1">
          Confirmação de Mistura e Estoque
        </p>
      </header>
      
      <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
        {/* Card de Resumo (Simulação) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Resumo da Fórmula</h3>
          <p className="text-slate-600 italic">"{formula}"</p>
          <div className="mt-4 pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400">Produtos selecionados: {consumos.length}</p>
          </div>
        </div>

        {/* 4. Chamada do Componente com as PROPS obrigatórias */}
        <AppointmentCheckout 
          appointmentId={TEST_APPOINTMENT_ID}
          consumptions={consumos}
          formula={formula}
          onSuccess={() => {
            console.log("Limpar campos ou redirecionar aqui...");
            setFormula("");
            setConsumos([]);
          }}
        />
      </main>

      {/* Footer / Navbar Mobile (Opcional) */}
      <footer className="p-4 text-center">
        <p className="text-[10px] text-slate-300 font-medium">SALAO APP v1.0.0 • POWERED BY SUPABASE</p>
      </footer>
    </div>
  );
}

export default App;