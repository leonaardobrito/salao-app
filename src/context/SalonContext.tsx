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
      const hostname = window.location.hostname;
      const searchParams = new URLSearchParams(window.location.search);
      
      // 1. Prioridade: Parâmetro na URL (?salon=gabi)
      // 2. Segunda opção: Slug no .env (para seu dev diário)
      // 3. Produção: Domínio customizado ou subdomínio
      const currentSlug = searchParams.get('salon') || import.meta.env.VITE_DEV_SALON_SLUG;

      let query = supabase.from('salons').select('*');

      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        if (currentSlug) {
          query = query.eq('slug', currentSlug);
        }
      } else {
        // Em produção: busca pelo domínio (salaodagabi.com) ou pelo slug (gabi.salaoapp.com)
        query = query.or(`custom_domain.eq.${hostname},slug.eq.${hostname.split('.')[0]}`);
      }

      const { data, error } = await query.maybeSingle();

      if (data) setSalon(data);
      if (error) console.error("Erro ao resolver salão:", error);
      
      setLoading(false);
    }
    
    resolveSalon();
  }, []);

  return (
    <SalonContext.Provider value={{ salon, loading }}>
      {children}
    </SalonContext.Provider>
  );
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