import { supabase } from '../lib/supabase';

export type UserRole = 'owner' | 'admin' | 'professional' | 'customer';

export class AuthService {
  /**
   * Realiza o cadastro de um novo usuário.
   * Se houver salonId, os metadados são enviados para processamento no banco.
   */
  static async signUp(email: string, pass: string, name: string, salonId?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: { 
        data: { 
          full_name: name,
          salon_id: salonId // Passado para o Trigger do Postgres decidir o destino
        } 
      }
    });
    if (error) throw error;
    return data;
  }

  /**
   * Login com validação de Tenant (Salão)
   */
  static async signIn(email: string, pass: string, salonId: string): Promise<{ role: UserRole }> {
    // 1. Autenticação primária no Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ 
      email, 
      password: pass 
    });
    
    if (authError) throw authError;
    if (!user) throw new Error("Usuário não encontrado.");

    // 2. Verificação de Vínculo: Equipe (Profiles)
    // Buscamos se o usuário existe na tabela de profissionais deste salão
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, salon_id')
      .eq('id', user.id)
      .maybeSingle(); // maybeSingle evita erro caso não encontre

    if (profile) {
      if (profile.salon_id === salonId) {
        return { role: profile.role as UserRole };
      }
      // Se o usuário é equipe, mas de outro salão, barramos o acesso.
      await this.signOut();
      throw new Error("Sua conta profissional não pertence a este salão.");
    }

    // 3. Verificação de Vínculo: Cliente (Customers)
    // Se não é equipe, verificamos se ele é um cliente cadastrado neste salão
    const { data: customer } = await supabase
      .from('customers')
      .select('salon_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (customer) {
      if (customer.salon_id === salonId) {
        return { role: 'customer' };
      }
      await this.signOut();
      throw new Error("Sua conta de cliente está vinculada a outro salão.");
    }

    // 4. Caso o usuário exista no Auth mas não tenha perfil nem cliente vinculado
    await this.signOut();
    throw new Error("Você não possui um perfil ativo neste salão.");
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Erro ao deslogar:", error.message);
  }

  static async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  }
}

// import { supabase } from '../lib/supabase';

// export class AuthService {
//   static async signUp(email: string, pass: string, name: string) {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password: pass,
//       options: { data: { full_name: name } }
//     });
//     if (error) throw error;
//     return data;
//   }

//   static async signIn(email: string, pass: string, salonId: string) {
//   const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
  
//   if (authError) throw authError;

//   // 1. Busca em Profiles (Dono, Admin, Funcionário)
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('role, salon_id')
//     .eq('id', user?.id)
//     .single();

//   // 2. Se for equipe, o salon_id deve bater
//   if (profile) {
//     if (profile.salon_id !== salonId) {
//       await supabase.auth.signOut();
//       throw new Error("Você não tem permissão para acessar este salão.");
//     }
//     return { role: profile.role };
//   }

//   // 3. Se não for equipe, busca em Customers
//   const { data: customer } = await supabase
//     .from('customers')
//     .select('salon_id')
//     .eq('user_id', user?.id)
//     .single();

//   if (customer) {
//     if (customer.salon_id !== salonId) {
//       await supabase.auth.signOut();
//       throw new Error("Sua conta de cliente não pertence a este salão.");
//     }
//     return { role: 'customer' };
//   }

//   throw new Error("Usuário não vinculado a nenhum perfil.");
// }

  // static async signIn(email: string, pass: string, currentSalonId: string) {
  //   // 1. Faz o login no Auth
  //   const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({ email, password: pass });
  //   if (authError) throw authError;

  //   // 2. Verifica se o usuário pertence a este salão (Segurança Multi-tenant)
  //   const { data: profile } = await supabase
  //     .from('profiles')
  //     .select('salon_id, role')
  //     .eq('id', user?.id)
  //     .eq('salon_id', currentSalonId) // Trava de segurança
  //     .single();

  //   if (!profile) {
  //     // Se não encontrou no profile, busca no customers
  //     const { data: customer } = await supabase
  //       .from('customers')
  //       .select('salon_id')
  //       .eq('user_id', user?.id)
  //       .eq('salon_id', currentSalonId)
  //       .single();

  //     if (!customer) {
  //       await supabase.auth.signOut();
  //       throw new Error("Você não tem acesso a este salão.");
  //     }
  //     return { role: 'customer' as const };
  //   }

  //   return { role: profile.role };
  // }
  // static async signIn(email: string, pass: string) {
  //   const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
  //   if (error) throw error;
  //   return data;
  // }

//   static async signOut() {
//     await supabase.auth.signOut();
//   }

//   static async getSession() {
//     const { data } = await supabase.auth.getSession();
//     return data.session;
//   }
// }

