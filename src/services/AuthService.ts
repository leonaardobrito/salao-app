import { supabase } from '../lib/supabase';
import type { UserRole, Profile } from '../types';

export class AuthService {
  static async signUp(email: string, pass: string, name: string, salonId?: string, inviteToken?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: name,
          salon_id: salonId,
          invite_token: inviteToken
        }
      }
    });
    if (error) throw error;
    return data;
  }

  static async signIn(email: string, pass: string, salonId: string) {
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pass
    });

    if (authError) throw authError;
    if (!user) throw new Error("Usuário não encontrado.");

    // Validação de Tenant (Segurança Sênior)
    const roleData = await this.getUserRoleAndSalon(user.id);
    
    if (!roleData || roleData.salon_id !== salonId) {
      await this.signOut();
      throw new Error("Você não possui permissão para acessar este salão.");
    }

    return roleData;
  }

  static async signOut() {
    await supabase.auth.signOut();
  }

  static async getUserRoleAndSalon(userId: string): Promise<{ role: UserRole, salon_id: string } | null> {
    // 1. Tenta buscar no Profile (Staff)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, salon_id")
      .eq("id", userId)
      .maybeSingle();

    if (profile) return { role: profile.role as UserRole, salon_id: profile.salon_id };

    // 2. Tenta buscar no Customer
    const { data: customer } = await supabase
      .from("customers")
      .select("salon_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (customer) return { role: 'customer', salon_id: customer.salon_id };

    return null;
  }

  static async getProfile(userId: string): Promise<Profile | null> {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    return data;
  }
}



// import { supabase } from '../lib/supabase';
// import type { UserRole, Profile } from '../types';

// export class AuthService {
//   static async signUp(email: string, pass: string, name: string, salonId?: string) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password: pass,
//       options: {
//         data: {
//           full_name: name,
//           salon_id: salonId
//         }
//       }
//     });
//     if (error) throw error;
//     return data;
//   }

//   static async signIn(email: string, pass: string, salonId: string): Promise<{ role: UserRole }> {
//     const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
//       email,
//       password: pass
//     });

//     if (authError) throw authError;
//     if (!user) throw new Error("Usuário não encontrado.");

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role, salon_id")
//       .eq("id", user.id)
//       .maybeSingle<Profile>();

//     if (profile) {
//       if (profile.salon_id === salonId) {
//         return { role: profile.role };
//       }
//       await this.signOut();
//       throw new Error("Sua conta profissional não pertence a este salão.");
//     }

//     const { data: customer } = await supabase
//       .from("customers")
//       .select("salon_id")
//       .eq("user_id", user.id)
//       .maybeSingle();

//     if (customer) {
//       if (customer.salon_id === salonId) {
//         return { role: 'customer' };
//       }
//       await this.signOut();
//       throw new Error("Sua conta de cliente está vinculada a outro salão.");
//     }

//     await this.signOut();
//     throw new Error("Você não possui um perfil ativo neste salão.");
//   }

//   static async signOut() {
//     const { error } = await supabase.auth.signOut();
//     if (error) console.error("Erro ao deslogar:", error.message);
//   }

//   static async getSession() {
//     const { data } = await supabase.auth.getSession();
//     return data.session;
//   }

//   static async getCurrentUserRole(salonId: string): Promise<UserRole | null> {
//     const session = await this.getSession();
//     if (!session) return null;

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("role, salon_id")
//       .eq("id", session.user.id)
//       .maybeSingle<Profile>();

//     if (profile && profile.salon_id === salonId) {
//       return profile.role;
//     }

//     const { data: customer } = await supabase
//       .from("customers")
//       .select("salon_id")
//       .eq("user_id", session.user.id)
//       .maybeSingle();

//     if (customer && customer.salon_id === salonId) {
//       return 'customer';
//     }

//     return null;
//   }

//   static async getProfile(): Promise<Profile | null> {
//     const session = await this.getSession();
//     if (!session) return null;

//     const { data: profile } = await supabase
//       .from("profiles")
//       .select("*", { count: 'exact' })
//       .eq("id", session.user.id)
//       .maybeSingle<Profile>();

//     return profile;
//   }
// }
