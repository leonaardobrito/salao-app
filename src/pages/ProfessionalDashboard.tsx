import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalon } from '../context/SalonContext';

// Layout
import { MainLayout } from '../components/layout/MainLayout';

// Domain Components
import { HomeView } from '../components/views/HomeView';
import { SearchView } from '../components/views/SearchView';
import { ProfileView } from '../components/views/ProfileView';
import { SettingsView } from '../components/views/SettingsView';
import { InventoryView } from '../components/views/InventoryView';
import DailyAgenda from '../components/appointments/DailyAgenda'; // Certifique-se de criar este arquivo

export type ProfessionalView = 'home' | 'search' | 'profile' | 'inventory' | 'settings';

export default function ProfessionalDashboard() {
  const { salon } = useSalon();
  const { role } = useAuth();
  const [currentView, setCurrentView] = useState<ProfessionalView>('home');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  // Forçar atualização da agenda
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshAgenda = () => setRefreshKey(prev => prev + 1);

  const handleStartService = (customerId: string, appointmentId: string | null = null) => {
    setSelectedCustomerId(customerId);
    setSelectedAppointmentId(appointmentId);
    setCurrentView('profile');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <div className="space-y-10">
            <HomeView onNavigate={setCurrentView} role={role} />
            <DailyAgenda 
               key={refreshKey} // Força re-render ao atualizar
               onSelectAppointment={handleStartService} 
            />
          </div>
        );
      
      case 'search':
        return <SearchView onSelect={(customer) => handleStartService(customer.id)} />;
      
      case 'profile':
        return selectedCustomerId ? (
          <ProfileView 
            customerId={selectedCustomerId} 
            appointmentId={selectedAppointmentId} 
          />
        ) : <HomeView onNavigate={setCurrentView} role={role} />;

      case 'inventory': return <InventoryView />;
      case 'settings': return <SettingsView role={role} />;
      default: return <HomeView onNavigate={setCurrentView} role={role} />;
    }
  };
// export default function ProfessionalDashboard() {
//   const { salon } = useSalon();
//   const { role } = useAuth();
  
//   const [currentView, setCurrentView] = useState<ProfessionalView>('home');
//   const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
//   const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

//   /**
//    * Sênior Pattern: Centralizador de início de atendimento.
//    * Usado tanto pela busca quanto pela agenda.
//    */
//   const handleStartService = (customerId: string, appointmentId: string | null = null) => {
//     setSelectedCustomerId(customerId);
//     setSelectedAppointmentId(appointmentId);
//     setCurrentView('profile');
//   };

//   const renderContent = () => {
//     switch (currentView) {
//       case 'home':
//         return (
//           <div className="space-y-10">
//             <HomeView onNavigate={setCurrentView} role={role} />
//             {/* Agenda do dia integrada na Home */}
//             <DailyAgenda onSelectAppointment={handleStartService} />
//           </div>
//         );
      
//       case 'search':
//         return (
//           <SearchView 
//             onSelect={(customer) => handleStartService(customer.id)} 
//           />
//         );
      
//       case 'profile':
//         return selectedCustomerId ? (
//           <ProfileView 
//             customerId={selectedCustomerId} 
//             appointmentId={selectedAppointmentId} 
//           />
//         ) : (
//           <HomeView onNavigate={setCurrentView} role={role} />
//         );

//       case 'inventory':
//         return <InventoryView />;

//       case 'settings':
//         return <SettingsView role={role} />;

//       default:
//         return <HomeView onNavigate={setCurrentView} role={role} />;
//     }
//   };

  const getViewTitle = () => {
    switch(currentView) {
      case 'inventory': return "Estoque";
      case 'search': return "Busca";
      case 'profile': return "Atendimento";
      case 'settings': return "Ajustes";
      default: return salon?.name || "Dashboard";
    }
  }

  return (
    <MainLayout 
      view={currentView} 
      setView={setCurrentView} 
      salonName={getViewTitle()}
    >
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
    </MainLayout>
  );
}

// import { useState } from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { useSalon } from '../context/SalonContext';

// // Layout
// import { MainLayout } from '../components/layout/MainLayout';

// // Views
// import { HomeView } from '../components/views/HomeView';
// import { SearchView } from '../components/views/SearchView';
// import { ProfileView } from '../components/views/ProfileView';
// import { SettingsView } from '../components/views/SettingsView';
// import { InventoryView } from '../components/views/InventoryView'; // <-- 1. Importe a View de Estoque

// export type ProfessionalView = 'home' | 'search' | 'profile' | 'inventory' | 'settings';

// export default function ProfessionalDashboard() {
//   const { salon } = useSalon();
//   const { role } = useAuth();
  
//   const [currentView, setCurrentView] = useState<ProfessionalView>('home');
//   const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

//   // 2. Atualize o Strategy Pattern de renderização
//   const renderContent = () => {
//     switch (currentView) {
//       case 'home':
//         return <HomeView onNavigate={setCurrentView} role={role} />;
      
//       case 'search':
//         return (
//           <SearchView 
//             onSelect={(customer) => {
//               setSelectedCustomerId(customer.id);
//               setCurrentView('profile');
//             }} 
//           />
//         );
      
//       case 'profile':
//         return selectedCustomerId ? (
//           <ProfileView customerId={selectedCustomerId} />
//         ) : (
//           <HomeView onNavigate={setCurrentView} role={role} />
//         );

//       case 'inventory': // <-- 3. Adicione este caso
//         return <InventoryView />;

//       case 'settings':
//         return <SettingsView role={role} />;

//       default:
//         return <HomeView onNavigate={setCurrentView} role={role} />;
//     }
//   };

//   // 4. Mapeamento de títulos para o Header
//   const getViewTitle = () => {
//     switch(currentView) {
//       case 'inventory': return "Gestão de Estoque";
//       case 'search': return "Buscar Cliente";
//       case 'profile': return "Ficha Técnica";
//       case 'settings': return "Configurações";
//       default: return salon?.name || "Salao App";
//     }
//   }

//   return (
//     <MainLayout 
//       view={currentView} 
//       setView={setCurrentView} 
//       salonName={getViewTitle()} // Passa o título dinâmico
//     >
//       <div className="animate-in fade-in duration-500">
//         {renderContent()}
//       </div>
//     </MainLayout>
//   );
// }


// // import { useState } from 'react';
// // import { useAuth } from '../hooks/useAuth';
// // import { useSalon } from '../context/SalonContext';

// // // Layout
// // import { MainLayout } from '../components/layout/MainLayout';

// // // Views
// // import { HomeView } from '../components/views/HomeView';
// // import { SearchView } from '../components/views/SearchView';
// // import { ProfileView } from '../components/views/ProfileView';
// // import { SettingsView } from '../components/views/SettingsView';

// // // Tipos
// // export type ProfessionalView = 'home' | 'search' | 'profile' | 'inventory' | 'settings';

// // export default function ProfessionalDashboard() {
// //   const { salon } = useSalon();
// //   const { role } = useAuth();
  
// //   // Estado de navegação interna (apenas para a equipe)
// //   const [currentView, setCurrentView] = useState<ProfessionalView>('home');
// //   const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

// //   // Strategy Pattern: Mapeamento de renderização das Views
// //   const renderContent = () => {
// //     switch (currentView) {
// //       case 'home':
// //         return <HomeView onNavigate={setCurrentView} role={role} />;
      
// //       case 'search':
// //         return (
// //           <SearchView 
// //             onSelect={(customer) => {
// //               setSelectedCustomerId(customer.id);
// //               setCurrentView('profile');
// //             }} 
// //           />
// //         );
      
// //       case 'profile':
// //         return selectedCustomerId ? (
// //           <ProfileView customerId={selectedCustomerId} />
// //         ) : (
// //           <HomeView onNavigate={setCurrentView} role={role} />
// //         );

// //       case 'settings':
// //         return <SettingsView role={role} />;

// //       default:
// //         return <HomeView onNavigate={setCurrentView} role={role} />;
// //     }
// //   };

// //   return (
// //     <MainLayout 
// //       view={currentView} 
// //       setView={setCurrentView} 
// //       salonName={salon?.name}
// //       customerName={currentView === 'profile' ? "Ficha Técnica" : undefined}
// //     >
// //       <div className="animate-in fade-in duration-500">
// //         {renderContent()}
// //       </div>
// //     </MainLayout>
// //   );
// // }