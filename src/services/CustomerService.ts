import { supabase } from '../lib/supabase';
import type { Customer } from '../types';

export type { Customer };

/**
 * Service responsável pela gestão do domínio de Clientes.
 * Aplica princípios de Clean Code e Defesa em Profundidade.
 */
export class CustomerService {
  
  /**
   * Busca clientes utilizando busca textual parcial (ILIKE) no nome ou telefone.
   * RLS no banco garante que apenas clientes do salon_id do usuário sejam retornados.
   */
  static async searchCustomers(query: string): Promise<Customer[]> {
    // 1. Sanitização e Validação Early Return
    const sanitizedQuery = query.trim();
    if (sanitizedQuery.length < 2) return [];

    try {
      // 2. Construção do Filtro PostgREST
      // Usamos % no início e fim para busca parcial "contém"
      const match = `%${sanitizedQuery}%`;
      const filter = `name.ilike.${match},phone.ilike.${match}`;

      const { data, error } = await supabase
        .from('customers')
        .select('id, name, phone, salon_id') // Evite select('*') em buscas de lista para performance
        .or(filter)
        .is('deleted_at', null) // Respeita o padrão de Soft Delete
        .order('name', { ascending: true })
        .limit(10); // Paginação agressiva para performance mobile

      if (error) {
        // Logging estruturado para monitoramento (Sentry/CloudWatch no futuro)
        console.error(`[CustomerService.searchCustomers] Error:`, {
          message: error.message,
          query: sanitizedQuery
        });
        throw new Error("Falha ao buscar clientes. Tente novamente.");
      }

      return (data as Customer[]) || [];

    } catch (err) {
      // Re-throw para ser tratado pela camada de UI (Toast/Alert)
      throw err;
    }
  }

  /**
   * Recupera o perfil completo de um cliente por ID.
   */
  static async getCustomerById(customerId: string): Promise<Customer | null> {
    // Validação de tipo básica para evitar chamadas desnecessárias ao banco
    if (!customerId || customerId === 'undefined') return null;

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .is('deleted_at', null)
        .maybeSingle(); // Sênior: evita erro 406 se não encontrar (diferente de .single())

      if (error) {
        console.error(`[CustomerService.getCustomerById] Error:`, error.message);
        throw error;
      }

      return data as Customer;

    } catch (err) {
      console.error(`[CustomerService.getCustomerById] Unexpected error:`, err);
      return null;
    }
  }
}