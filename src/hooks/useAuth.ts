import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type UserRole = 'owner' | 'admin' | 'professional' | 'customer';

export function useAuth() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Tentar buscar no perfil da equipe
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setRole(profile.role as UserRole);
        } else {
          // 2. Se não é equipe, deve ser cliente
          setRole('customer');
        }
      }
      setLoading(false);
    }

    getUserData();
  }, []);

  return { role, loading };
}