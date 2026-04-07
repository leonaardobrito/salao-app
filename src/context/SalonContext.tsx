import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Salon {
  id: string;
  name: string;
  slug: string;
  settings: any;
}

const SalonContext = createContext<{ salon: Salon | null; loading: boolean }>({ 
  salon: null, 
  loading: true 
});

export function SalonProvider({ children }: { children: React.ReactNode }) {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolveSalon() {
      const searchParams = new URLSearchParams(window.location.search);
      const inviteToken = searchParams.get('invite');
      const hostname = window.location.hostname;
      const devSlug = searchParams.get('salon') || import.meta.env.VITE_DEV_SALON_SLUG;

      try {
        // PRIORIDADE 1: Se houver convite, buscamos o salão dono do convite
        if (inviteToken) {
          const { data } = await supabase
            .from('invites')
            .select('salons (*)')
            .eq('token', inviteToken)
            .single();
          if (data?.salons) return setSalon(data.salons[0] as Salon);
        }

        // PRIORIDADE 2: Resolução por Hostname ou Slug (Local/Prod)
        let query = supabase.from('salons').select('*');
        if (hostname === 'localhost') {
           query = query.eq('slug', devSlug);
        } else {
           query = query.or(`custom_domain.eq.${hostname},slug.eq.${hostname.split('.')[0]}`);
        }
        
        const { data } = await query.single();
        if (data) setSalon(data);

      } catch (err) {
        console.error("Erro na resolução de Tenant");
      } finally {
        setLoading(false);
      }
    }
    resolveSalon();
  }, []);

  return <SalonContext.Provider value={{ salon, loading }}>{children}</SalonContext.Provider>;
}
export const useSalon = () => useContext(SalonContext);

// import { createContext, useContext, useEffect, useState } from 'react';
// import { supabase } from '../lib/supabase';

// interface Salon {
//   id: string;
//   name: string;
//   slug: string;
//   settings: any;
// }

// const SalonContext = createContext<{ salon: Salon | null; loading: boolean }>({ 
//   salon: null, 
//   loading: true 
// });

// export function SalonProvider({ children }: { children: React.ReactNode }) {
//   const [salon, setSalon] = useState<Salon | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function resolveSalon() {
//       const hostname = window.location.hostname;
//       const searchParams = new URLSearchParams(window.location.search);
//       const devSlug = searchParams.get('salon') || import.meta.env.VITE_DEV_SALON_SLUG;

//       let query = supabase.from('salons').select('*');

//       // Lógica de Resolução Prioritária
//       if (hostname === 'localhost' || hostname === '127.0.0.1') {
//         // No localhost, priorizamos o slug da URL (?salon=gabi) ou do .env
//         if (devSlug) {
//           query = query.eq('slug', devSlug);
//         } else {
//           console.warn("⚠️ Ambiente local detectado sem slug de salão definido.");
//           setLoading(false);
//           return;
//         }
//       } else {
//         // Em produção, busca por domínio customizado ou slug
//         query = query.or(`custom_domain.eq.${hostname},slug.eq.${hostname.split('.')[0]}`);
//       }

//       const { data, error } = await query.single();

//       if (data) setSalon(data);
//       if (error) console.error("❌ Erro ao resolver salão:", error.message);
      
//       setLoading(false);
//     }
//     resolveSalon();
//   }, []);

//   return (
//     <SalonContext.Provider value={{ salon, loading }}>
//       {children}
//     </SalonContext.Provider>
//   );
// }

// export const useSalon = () => useContext(SalonContext);