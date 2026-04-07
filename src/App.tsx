import { useState, useMemo } from 'react';
import { useAuth } from './hooks/useAuth'; // Abstraímos a lógica de sessão
import { useSalon } from './context/SalonContext';

// Views
import Auth from './components/Auth';
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { ProfileView } from './components/views/ProfileView';
import { SettingsView } from './components/views/SettingsView';

// Layout & UI
import { MainLayout } from './components/layout/MainLayout';
import { LoadingScreen } from './components/ui/LoadingScreen';

export type AppView = 'home' | 'search' | 'profile' | 'inventory' | 'settings';

export default function App() {
  const { salon, loading: salonLoading } = useSalon();
  const { session, role, loading: authLoading } = useAuth();
  
  // Estado de Navegação
  const [view, setView] = useState<AppView>('home');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Strategy Pattern: Mapeamento de telas
  // O React Compiler otimiza este objeto automaticamente
  const renderView = () => {
    switch (view) {
      case 'home':     return <HomeView onNavigate={setView} role={role} />;
      case 'search':   return <SearchView onSelect={(c) => { 
                                  setSelectedCustomerId(c.id); 
                                  setView('profile'); 
                               }} />;
      case 'profile':  return <ProfileView customerId={selectedCustomerId!} />;
      case 'settings': return <SettingsView role={role} />;
      default:         return <HomeView onNavigate={setView} role={role} />;
    }
  };

  if (salonLoading || authLoading) return <LoadingScreen />;
  if (!session) return <Auth />;

  // Se for cliente, mostramos o portal específico (Portal Pattern)
  if (role === 'customer') return <CustomerPortal session={session} salon={salon} />;

  return (
    <MainLayout 
      view={view} 
      setView={setView} 
      salonName={salon?.name}
      customerName={selectedCustomerId ? "Ficha da Cliente" : undefined}
    >
      {renderView()}
    </MainLayout>
  );
}


// import { useState } from 'react';
// import CustomerSearch from './components/CustomerSearch';
// import TechnicalHistory from './components/TechnicalHistory';
// import AppointmentCheckout from './components/AppointmentCheckout';
// import { type Customer } from './services/CustomerService';
// import { type ProductConsumption } from './services/AppointmentService';
// import { 
//   User, History, Beaker, ArrowLeft, 
//   Search as SearchIcon, Package, LayoutDashboard, Settings 
// } from 'lucide-react';

// type AppView = 'home' | 'search' | 'profile' | 'inventory';

// export default function App() {
//   const [view, setView] = useState<AppView>('home');
//   const [activeTab, setActiveTab] = useState<'history' | 'checkout'>('history');
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

//   // Dados de teste para o Checkout (Serão substituídos pelo seletor de produtos futuramente)
//   const [formula, setFormula] = useState("Coloração 6.0 (30g) + OX 20vol (45ml)");
//   const [consumos, setConsumos] = useState<ProductConsumption[]>([
//     { product_id: "COLE_UM_ID_DE_PRODUTO_AQUI", qty: 30.5 }
//   ]);

//   const handleCustomerSelect = (customer: Customer) => {
//     setSelectedCustomer(customer);
//     setView('profile');
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      
//       {/* Header Adaptativo */}
//       <header className="bg-white p-6 shadow-sm border-b border-slate-100 sticky top-0 z-50">
//         <div className="flex items-center gap-4">
//           {view !== 'home' && (
//             <button 
//               onClick={() => setView(view === 'profile' ? 'search' : 'home')} 
//               className="p-2 bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-transform"
//             >
//               <ArrowLeft size={20} />
//             </button>
//           )}
//           <div>
//             <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
//               {view === 'home' ? 'SALAO APP' : view === 'search' ? 'BUSCAR CLIENTE' : selectedCustomer?.name}
//             </h1>
//             <p className="text-[10px] text-pink-500 font-bold uppercase mt-1 tracking-widest">
//               {view === 'profile' ? (selectedCustomer?.phone || 'CLIENTE') : 'GERENCIAMENTO PRO'}
//             </p>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 p-4 max-w-md mx-auto w-full pb-28">
        
//         {/* VIEW: HOME (Dashboard de Navegação) */}
//         {view === 'home' && (
//           <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-300">
//             <button 
//               onClick={() => setView('search')}
//               className="col-span-2 h-40 bg-pink-600 rounded-[2.5rem] p-6 text-white flex flex-col justify-between shadow-xl shadow-pink-100 active:scale-95 transition-all"
//             >
//               <SearchIcon size={32} />
//               <div className="text-left">
//                 <p className="text-2xl font-black">Atendimento</p>
//                 <p className="text-pink-100 text-xs">Busca, Histórico e Mistura</p>
//               </div>
//             </button>

//             <button 
//               onClick={() => alert("Módulo de Estoque em breve...")}
//               className="h-40 bg-white rounded-[2.5rem] p-6 text-slate-700 flex flex-col justify-between shadow-sm border border-slate-100 active:scale-95 transition-all"
//             >
//               <Package size={32} className="text-indigo-500" />
//               <div className="text-left">
//                 <p className="font-bold">Estoque</p>
//                 <p className="text-slate-400 text-[10px]">Produtos e Níveis</p>
//               </div>
//             </button>

//             <button 
//               onClick={() => alert("Configurações em breve...")}
//               className="h-40 bg-white rounded-[2.5rem] p-6 text-slate-700 flex flex-col justify-between shadow-sm border border-slate-100 active:scale-95 transition-all"
//             >
//               <Settings size={32} className="text-slate-400" />
//               <div className="text-left">
//                 <p className="font-bold">Ajustes</p>
//                 <p className="text-slate-400 text-[10px]">Salão e Perfil</p>
//               </div>
//             </button>
//           </div>
//         )}

//         {/* VIEW: BUSCA */}
//         {view === 'search' && (
//           <div className="space-y-6 animate-in slide-in-from-right duration-300">
//             <CustomerSearch onSelect={handleCustomerSelect} />
//             <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
//               <User className="mx-auto text-slate-200 mb-2" size={40} />
//               <p className="text-slate-400 text-sm">Busque pelo nome da cliente para acessar a ficha técnica.</p>
//             </div>
//           </div>
//         )}

//         {/* VIEW: PERFIL (HISTÓRICO + CHECKOUT) */}
//         {view === 'profile' && (
//           <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
//             <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
//               <button 
//                 onClick={() => setActiveTab('history')}
//                 className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'history' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400'}`}
//               >
//                 <History size={18} /> Histórico
//               </button>
//               <button 
//                 onClick={() => setActiveTab('checkout')}
//                 className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'checkout' ? 'bg-pink-600 text-white shadow-md' : 'text-slate-400'}`}
//               >
//                 <Beaker size={18} /> Nova Mistura
//               </button>
//             </div>

//             {activeTab === 'history' ? (
//               <TechnicalHistory customerId={selectedCustomer!.id} />
//             ) : (
//               <div className="space-y-6">
//                 {/* Aqui entrará o componente seletor de gramas real na próxima etapa */}
//                 <div className="bg-white p-6 rounded-3xl border border-slate-100 text-slate-400 text-sm text-center">
//                   Prepare a mistura de produtos para <strong>{selectedCustomer?.name}</strong>.
//                 </div>
                
//                 <AppointmentCheckout 
//                   appointmentId="PEGUE_UM_ID_REAL_NO_BANCO_PARA_TESTE" 
//                   consumptions={consumos} 
//                   formula={formula} 
//                   onSuccess={() => setView('home')}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </main>

//       {/* Nav de Status PWA */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 p-4 flex justify-center items-center">
//          <div className="flex items-center gap-2">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Sistema Online • DB Conectado</span>
//          </div>
//       </nav>
//     </div>
//   );
// }



// import { useEffect, useState } from 'react';
// import { supabase } from './lib/supabase';
// import { AuthService, type UserRole } from './services/AuthService';
// import Auth from './components/Auth';
// import ProfessionalDashboard from './pages/ProfessionalDashboard'; // Sua Home atual
// import CustomerPortal from './pages/CustomerPortal'; // Nova tela para clientes
// import { Loader2 } from 'lucide-react';

// export default function Root() {
//   const [session, setSession] = useState<any>(null);
//   const [role, setRole] = useState<UserRole | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 1. Monitorar estado da sessão
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
//       setSession(session);
      
//       if (session?.user) {
//         // Buscar a role do usuário após o login
//         try {
//           // Podemos buscar no profile ou customer
//           const { data: profile } = await supabase.from('profiles').select('role').single();
//           if (profile) setRole(profile.role as UserRole);
//           else setRole('customer');
//         } catch {
//           setRole('customer');
//         }
//       }
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center bg-slate-50 text-pink-600">
//       <Loader2 className="animate-spin" size={40} />
//     </div>
//   );

//   // Se não está logado, mostra a tela de Auth (Login/Signup)
//   if (!session) return <Auth />;

//   // Se está logado, roteia pelo Role
//   switch (role) {
//     case 'owner':
//     case 'admin':
//     case 'professional':
//       return <ProfessionalDashboard />;
//     case 'customer':
//       return <CustomerPortal />;
//     default:
//       return <Auth />;
//   }
// }


// import { useState } from 'react';
// import CustomerSearch from './components/CustomerSearch';
// import TechnicalHistory from './components/TechnicalHistory';
// import AppointmentCheckout from './components/AppointmentCheckout';
// import { type Customer } from './services/CustomerService';
// import { type ProductConsumption } from './services/AppointmentService';
// import { User, History, Beaker, ArrowLeft, Search as SearchIcon } from 'lucide-react';

// type AppView = 'search' | 'profile';

// export default function App() {
//   // Estado de Navegação
//   const [view, setView] = useState<AppView>('search');
//   const [activeTab, setActiveTab] = useState<'history' | 'checkout'>('history');
  
//   // Estado de Dados
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
//   const [formula, setFormula] = useState("");
//   const [consumos, setConsumos] = useState<ProductConsumption[]>([]);

//   // Handlers
//   const handleCustomerSelect = (customer: Customer) => {
//     setSelectedCustomer(customer);
//     setView('profile');
//     setActiveTab('history'); // Sempre abre no histórico por padrão
//   };

//   const handleBack = () => {
//     setView('search');
//     setSelectedCustomer(null);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      
//       {/* Header Adaptativo */}
//       <header className="bg-white p-6 shadow-sm border-b border-slate-100 sticky top-0 z-40">
//         {view === 'search' ? (
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-black text-slate-800 tracking-tight">
//                 SALAO <span className="text-pink-600">APP</span>
//               </h1>
//               <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
//                 Gestão Técnica Pro
//               </p>
//             </div>
//             <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
//                <User size={20} />
//             </div>
//           </div>
//         ) : (
//           <div className="flex items-center gap-4">
//             <button 
//               onClick={handleBack} 
//               className="p-2 bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-transform"
//             >
//               <ArrowLeft size={20} />
//             </button>
//             <div className="overflow-hidden">
//               <h2 className="font-black text-slate-800 uppercase leading-none truncate">
//                 {selectedCustomer?.name}
//               </h2>
//               <p className="text-xs text-pink-500 font-bold mt-1">
//                 {selectedCustomer?.phone || 'Cliente sem telefone'}
//               </p>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* Área Principal */}
//       <main className="flex-1 p-4 max-w-md mx-auto w-full pb-28">
//         {view === 'search' ? (
//           <div className="mt-4 space-y-8 animate-in fade-in duration-500">
//             {/* Banner de Boas-vindas */}
//             <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
//               <div className="relative z-10">
//                 <h3 className="text-xl font-bold">Inicie um Atendimento</h3>
//                 <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
//                   Busque uma cliente para ver fórmulas passadas ou registrar uma nova mistura.
//                 </p>
//               </div>
//               <SearchIcon className="absolute -right-4 -bottom-4 text-indigo-500 opacity-30" size={140} />
//             </div>

//             {/* Input de Busca */}
//             <CustomerSearch onSelect={handleCustomerSelect} />
//           </div>
//         ) : (
//           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
//             {/* Tabs Mobile (Segmented Control) */}
//             <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
//               <button 
//                 onClick={() => setActiveTab('history')}
//                 className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
//                   activeTab === 'history' 
//                   ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' 
//                   : 'text-slate-400 hover:text-slate-600'
//                 }`}
//               >
//                 <History size={18} /> Histórico
//               </button>
//               <button 
//                 onClick={() => setActiveTab('checkout')}
//                 className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
//                   activeTab === 'checkout' 
//                   ? 'bg-pink-600 text-white shadow-lg shadow-pink-100' 
//                   : 'text-slate-400 hover:text-slate-600'
//                 }`}
//               >
//                 <Beaker size={18} /> Nova Mistura
//               </button>
//             </div>

//             {/* Renderização Condicional do Conteúdo */}
//             {activeTab === 'history' ? (
//               <TechnicalHistory customerId={selectedCustomer!.id} />
//             ) : (
//               <div className="space-y-6">
//                 {/* Aqui futuramente você colocará o Seletor de Gramas */}
//                 <div className="bg-white p-8 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
//                    <Beaker className="mx-auto text-slate-200 mb-4" size={48} />
//                    <p className="text-slate-400 text-sm px-4">
//                      O seletor de produtos e pesagem será integrado neste espaço.
//                    </p>
//                 </div>

//                 <AppointmentCheckout 
//                   appointmentId="ID_DO_AGENDAMENTO_GERADO" // Integrar com sua lógica de agendamento
//                   consumptions={consumos} 
//                   formula={formula} 
//                   onSuccess={() => {
//                     setActiveTab('history');
//                     setFormula("");
//                     setConsumos([]);
//                   }}
//                 />
//               </div>
//             )}
//           </div>
//         )}
//       </main>

//       {/* Navbar Minimalista (Simulação de App Nativo) */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 p-4 flex justify-around items-center">
//          <div className="w-1.5 h-1.5 bg-pink-600 rounded-full"></div>
//       </nav>
//     </div>
//   );
// } 

//-----------------------------------------------------------------------------------------
// import { useState } from 'react';
// // 1. Importamos o tipo para garantir que os dados de teste estejam corretos
// import { type ProductConsumption } from './services/AppointmentService';
// import AppointmentCheckout from './components/AppointmentCheckout';

// function App() {
//   // 2. Simulamos o estado que viria dos seus outros componentes (como o seletor de gramas)
//   // Em um cenário real, esses dados seriam alterados pelos inputs de mistura
//   const [formula, setFormula] = useState("6.0 (30g) + OX 20vol (45ml)");
//   const [consumos, setConsumos] = useState<ProductConsumption[]>([
//     { product_id: "0f79634d-cde7-4649-a82b-6c84e5f7415c", qty: 10.5 }
//   ]);

//   // 3. ID de teste (Pegue um ID real na sua tabela 'appointments' do Supabase para testar o clique)
//   const TEST_APPOINTMENT_ID = "53104d7a-3d4f-4dcf-b312-ee69f6bbec21";

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col">
//       {/* Header Mobile First */}
//       <header className="bg-white p-6 shadow-sm border-b border-slate-100">
//         <h1 className="text-xl font-black text-slate-800 tracking-tight">
//           FINALIZAR <span className="text-pink-600">ATENDIMENTO</span>
//         </h1>
//         <p className="text-xs text-slate-400 font-bold uppercase mt-1">
//           Confirmação de Mistura e Estoque
//         </p>
//       </header>
      
//       <main className="flex-1 p-4 max-w-md mx-auto w-full space-y-6">
//         {/* Card de Resumo (Simulação) */}
//         <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
//           <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Resumo da Fórmula</h3>
//           <p className="text-slate-600 italic">"{formula}"</p>
//           <div className="mt-4 pt-4 border-t border-slate-50">
//             <p className="text-xs text-slate-400">Produtos selecionados: {consumos.length}</p>
//           </div>
//         </div>

//         {/* 4. Chamada do Componente com as PROPS obrigatórias */}
//         <AppointmentCheckout 
//           appointmentId={TEST_APPOINTMENT_ID}
//           consumptions={consumos}
//           formula={formula}
//           onSuccess={() => {
//             console.log("Limpar campos ou redirecionar aqui...");
//             setFormula("");
//             setConsumos([]);
//           }}
//         />
//       </main>

//       {/* Footer / Navbar Mobile (Opcional) */}
//       <footer className="p-4 text-center">
//         <p className="text-[10px] text-slate-300 font-medium">SALAO APP v1.0.0 • POWERED BY SUPABASE</p>
//       </footer>
//     </div>
//   );
// }

// export default App;