import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthService } from '../services/AuthService';
import { useSalon } from '../context/SalonContext';
import type { UserRole, Profile } from '../types';

export function useAuth() {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { salon } = useSalon();

  useEffect(() => {
    // Escuta mudanças na sessão
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        const data = await AuthService.getUserRoleAndSalon(session.user.id);
        if (data) {
          setRole(data.role);
          const prof = await AuthService.getProfile(session.user.id);
          setProfile(prof);
        }
      } else {
        setRole(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [salon]);

  return {
    session,
    profile,
    role,
    loading,
    isAuthenticated: !!session,
  };
}

// import { useState, useEffect } from 'react';
// import { AuthService } from '../services/AuthService';
// import { useSalon } from '../context/SalonContext';
// import type { UserRole } from '../types';

// interface AuthHook {
//   user: any; // User do Supabase
//   role: UserRole | null;
//   loading: boolean;
//   isAuthenticated: boolean;
//   signIn: (email: string, pass: string) => Promise<void>;
//   signUp: (email: string, pass: string, name: string) => Promise<void>;
//   signOut: () => Promise<void>;
//   profile: any; // Perfil completo do usuário (incluindo salon_id, etc.)
// }

// export function useAuth(): AuthHook {
//   const [user, setUser] = useState<any>(null);
//   const [profile, setProfile] = useState<any>(null);
//   const [role, setRole] = useState<UserRole | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const { salon, loading: loadingSalon } = useSalon();

//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         setLoading(true);
//         const session = await AuthService.getSession();
//         if (session) {
//           setUser(session.user);
//           setIsAuthenticated(true);

//           const userProfile = await AuthService.getProfile();
//           setProfile(userProfile);

//           if (salon?.id && userProfile) {
//             setRole(userProfile.role);
//           } else if (salon?.id) {
//             // Tentar determinar o role se for cliente e não tiver profile
//             const customerRole = await AuthService.getCurrentUserRole(salon.id);
//             setRole(customerRole);
//           }
//         } else {
//           setUser(null);
//           setProfile(null);
//           setRole(null);
//           setIsAuthenticated(false);
//         }
//       } catch (err) {
//         console.error("Erro na inicialização da autenticação:", err);
//         setUser(null);
//         setProfile(null);
//         setRole(null);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (!loadingSalon) {
//       initializeAuth();
//     }
//   }, [salon, loadingSalon]);

//   const signIn = async (email: string, pass: string) => {
//     if (!salon?.id) throw new Error("Salão não carregado. Tente novamente mais tarde.");
//     setLoading(true);
//     try {
//       const { role } = await AuthService.signIn(email, pass, salon.id);
//       const session = await AuthService.getSession();
//       setUser(session?.user || null);
//       setProfile(await AuthService.getProfile());
//       setRole(role);
//       setIsAuthenticated(true);
//     } catch (err) {
//       console.error("Erro ao fazer login:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async (email: string, pass: string, name: string) => {
//     setLoading(true);
//     try {
//       const { data: { user } } = await AuthService.signUp(email, pass, name, salon?.id);
//       if (user) {
//         setUser(user);
//         setIsAuthenticated(true);
//         setProfile(await AuthService.getProfile());
//         // O role será definido após o perfil ser criado via trigger no banco
//       }
//     } catch (err) {
//       console.error("Erro ao cadastrar:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = async () => {
//     setLoading(true);
//     try {
//       await AuthService.signOut();
//       setUser(null);
//       setProfile(null);
//       setRole(null);
//       setIsAuthenticated(false);
//     } catch (err) {
//       console.error("Erro ao fazer logout:", err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     user,
//     profile,
//     role,
//     loading,
//     isAuthenticated,
//     signIn,
//     signUp,
//     signOut,
//   };
// }
