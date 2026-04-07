import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSalon } from '../context/SalonContext';

// Layout
import { MainLayout } from '../components/layout/MainLayout';

// Views
import { HomeView } from '../components/views/HomeView';
import { SearchView } from '../components/views/SearchView';
import { ProfileView } from '../components/views/ProfileView';
import { SettingsView } from '../components/views/SettingsView';

// Tipos
export type ProfessionalView = 'home' | 'search' | 'profile' | 'inventory' | 'settings';

export default function ProfessionalDashboard() {
  const { salon } = useSalon();
  const { role } = useAuth();
  
  // Estado de navegação interna (apenas para a equipe)
  const [currentView, setCurrentView] = useState<ProfessionalView>('home');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // Strategy Pattern: Mapeamento de renderização das Views
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} role={role} />;
      
      case 'search':
        return (
          <SearchView 
            onSelect={(customer) => {
              setSelectedCustomerId(customer.id);
              setCurrentView('profile');
            }} 
          />
        );
      
      case 'profile':
        return selectedCustomerId ? (
          <ProfileView customerId={selectedCustomerId} />
        ) : (
          <HomeView onNavigate={setCurrentView} role={role} />
        );

      case 'settings':
        return <SettingsView role={role} />;

      default:
        return <HomeView onNavigate={setCurrentView} role={role} />;
    }
  };

  return (
    <MainLayout 
      view={currentView} 
      setView={setCurrentView} 
      salonName={salon?.name}
      customerName={currentView === 'profile' ? "Ficha Técnica" : undefined}
    >
      <div className="animate-in fade-in duration-500">
        {renderContent()}
      </div>
    </MainLayout>
  );
}