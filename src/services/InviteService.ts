import { supabase } from '../lib/supabase';

export class InviteService {
  /**
   * Gera um novo convite para a equipe
   */
  static async createInvite(salonId: string, email: string | null, role: 'professional' | 'admin') {
    const { data, error } = await supabase
      .from('invites')
      .insert({
        salon_id: salonId,
        email: email || null,
        role: role
      })
      .select('token')
      .single();

    if (error) throw error;
    return data.token;
  }

  /**
   * Lista convites ativos (para o dono gerenciar)
   */
  static async getActiveInvites(salonId: string) {
    const { data, error } = await supabase
      .from('invites')
      .select('*')
      .eq('salon_id', salonId)
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString());

    if (error) throw error;
    return data;
  }
}