import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  last_appointment?: string;
}

export class CustomerService {
  /**
   * Busca clientes por nome ou telefone com ILIKE (case-insensitive)
   * Limitado a 10 resultados para performance mobile
   */
  static async searchCustomers(query: string): Promise<Customer[]> {
    if (query.length < 2) return [];

    const { data, error } = await supabase
      .from('customers')
      .select('id, name, phone')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(10)
      .order('name');

    if (error) throw error;
    return data || [];
  }
}