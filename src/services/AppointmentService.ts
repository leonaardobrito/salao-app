import { supabase } from '../lib/supabase';

// Tipagem para garantir precisão no consumo
export interface ProductConsumption {
  product_id: string;
  qty: number;
}

export class AppointmentService {
  /**
   * Finaliza um atendimento realizando checkout financeiro e de estoque.
   * Chama a função RPC process_appointment_checkout no PostgreSQL.
   */
  static async checkout(
    appointmentId: string,
    consumptions: ProductConsumption[],
    formula: string,
    paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'pix'
  ) {
    try {
      // O Supabase entende automaticamente os parâmetros da RPC
      const { data, error } = await supabase.rpc('process_appointment_checkout', {
        p_appointment_id: appointmentId,
        p_consumptions: consumptions, // O PostgreSQL converterá o array JS para JSONB
        p_formula_text: formula,
        p_payment_method: paymentMethod
      });

      if (error) {
        // Tratamento de erros específicos do banco (ex: estoque insuficiente)
        console.error('Erro na RPC de Checkout:', error.message);
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (err) {
      console.error('Falha crítica no checkout:', err);
      throw err;
    }
  }

  /**
   * Busca histórico técnico do cliente (Anamnese Estruturada)
   */
  static async getTechnicalHistory(customerId: string) {
    const { data, error } = await supabase
      .from('technical_histories')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}