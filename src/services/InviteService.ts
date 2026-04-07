import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export class InviteService {
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

  static async acceptInvite(token: string, userId: string): Promise<Profile> {
    // 1. Validar e buscar o convite
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('id, salon_id, email, role')
      .eq('token', token)
      .is('used_at', null) // Convite não usado
      .gt('expires_at', new Date().toISOString()) // Convite não expirado
      .maybeSingle();

    if (inviteError) throw inviteError;
    if (!invite) throw new Error('Convite inválido, expirado ou já utilizado.');

    // 2. Criar ou atualizar o perfil do usuário
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          salon_id: invite.salon_id,
          role: invite.role,
          email: invite.email, // Opcional: preencher se o convite tinha email
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (profileError) throw profileError;

    // 3. Marcar o convite como usado
    const { error: updateError } = await supabase
      .from('invites')
      .update({ used_at: new Date().toISOString(), used_by_id: userId })
      .eq('id', invite.id);

    if (updateError) throw updateError;

    return profileData;
  }
}
