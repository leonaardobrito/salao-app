import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Salon } from '../types';

interface SalonContextType {
  salon: Salon | null;
  loading: boolean;
  setSalon: (salon: Salon | null) => void;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export function SalonProvider({ children }: { children: ReactNode }) {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No useEffect do SalonContext.tsx
const resolveSalon = async () => {
  const hostname = window.location.hostname;
  const searchParams = new URLSearchParams(window.location.search);
  
  // Captura o slug da URL (?salon=slug) ou do .env
  const slugFromUrl = searchParams.get('salon');
  const currentSlug = slugFromUrl || import.meta.env.VITE_DEV_SALON_SLUG;

  // Engenharia Sênior: Regex para detectar se é um IP local (192.168.x.x, 10.x.x.x, etc)
  const isLocalNetwork = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname); // Detecta qualquer IP

  console.log("🔍 Resolvendo salão...", { hostname, isLocalNetwork, currentSlug });

  let query = supabase.from("salons").select("*");

  if (isLocalNetwork) {
    // Se for local (PC ou Celular na mesma rede), força o uso do slug de teste
    if (currentSlug) {
      query = query.eq('slug', currentSlug);
    } else {
      console.error("❌ Erro: VITE_DEV_SALON_SLUG não definido no .env");
      setLoading(false);
      return;
    }
  } else {
    // Produção: Domínio customizado ou subdomínio (slug)
    query = query.or(`custom_domain.eq.${hostname},slug.eq.${hostname.split('.')[0]}`);
  }

  const { data, error } = await query.maybeSingle();

  if (error) console.error("❌ Supabase Error:", error.message);
  
  setSalon(data || null);
  setLoading(false);
};

    resolveSalon();
  }, []);

  return (
    <SalonContext.Provider value={{ salon, loading, setSalon }}>
      {children}
    </SalonContext.Provider>
  );
}

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) throw new Error('useSalon must be used within a SalonProvider');
  return context;
};


// import { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import { supabase } from '../lib/supabase';
// import type { Salon } from '../types';

// interface SalonContextType {
//   salon: Salon | null;
//   loading: boolean;
//   error: string | null;
//   setSalon: (salon: Salon | null) => void;
// }

// const SalonContext = createContext<SalonContextType | undefined>(undefined);

// export function SalonProvider({ children }: { children: ReactNode }) {
//   const [salon, setSalon] = useState<Salon | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSalon = async () => {
//       try {
//         setLoading(true);
//         const { data: { user } } = await supabase.auth.getUser();

//         if (user) {
//           // Tenta buscar o salão do perfil do usuário
//           const { data: profile, error: profileError } = await supabase
//             .from("profiles")
//             .select("salon_id")
//             .eq("id", user.id)
//             .maybeSingle();

//           if (profileError) throw profileError;

//           if (profile?.salon_id) {
//             const { data: salonData, error: salonError } = await supabase
//               .from("salons")
//               .select("*")
//               .eq("id", profile.salon_id)
//               .maybeSingle<Salon>();

//             if (salonError) throw salonError;
//             setSalon(salonData);
//           } else {
//             // Se não encontrou no perfil, tenta buscar o salão do cliente
//             const { data: customer, error: customerError } = await supabase
//               .from("customers")
//               .select("salon_id")
//               .eq("user_id", user.id)
//               .maybeSingle();
            
//             if (customerError) throw customerError;

//             if (customer?.salon_id) {
//               const { data: salonData, error: salonError } = await supabase
//                 .from("salons")
//                 .select("*")
//                 .eq("id", customer.salon_id)
//                 .maybeSingle<Salon>();
  
//               if (salonError) throw salonError;
//               setSalon(salonData);
//             }
//           }
//         }
//       } catch (err) {
//         console.error("Erro ao carregar dados do salão:", err);
//         setError("Falha ao carregar informações do salão.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSalon();

//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session) {
//         fetchSalon();
//       } else {
//         setSalon(null);
//         setLoading(false);
//       }
//     });

//     return () => {
//       authListener.subscription.unsubscribe();
//     };
//   }, []);

//   return (
//     <SalonContext.Provider value={{ salon, loading, error, setSalon }}>
//       {children}
//     </SalonContext.Provider>
//   );
// }

// export function useSalon() {
//   const context = useContext(SalonContext);
//   if (context === undefined) {
//     throw new Error('useSalon must be used within a SalonProvider');
//   }
//   return context;
// }
