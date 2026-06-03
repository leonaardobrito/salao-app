import { supabase } from '../lib/supabase';
import type { ProductConsumption, AppointmentStatus, PaymentMethod, AppointmentWithRelations } from '../types';

/**
 * Interface para criação de novos agendamentos (DTO)
 */
export interface CreateAppointmentInput {
  salon_id: string;
  customer_id: string;
  professional_id: string;
  service_id: string;
  start_time: string;
  notes?: string;
}

export class AppointmentService {
  /**
   * Finaliza um atendimento (Checkout)
   * ACID: Executa baixa de estoque, registro financeiro e histórico técnico via RPC.
   */
  static async checkout(
    appointmentId: string,
    consumptions: ProductConsumption[],
    formula: string,
    paymentMethod: PaymentMethod
  ) {
    try {
      const { data, error } = await supabase.rpc('process_appointment_checkout', {
        p_appointment_id: appointmentId,
        p_consumptions: consumptions,
        p_formula_text: formula,
        p_payment_method: paymentMethod
      });

      if (error) throw new Error(error.message);
      return { success: true, data };
    } catch (err: any) {
      console.error('[AppointmentService.checkout] Error:', err.message);
      throw err;
    }
  }

  /**
   * Busca a agenda de um período para um salão específico.
   * PERFORMANCE: Utiliza Joins para trazer dados do cliente e serviço em uma única requisição.
   */
  static async getAppointments(salonId: string, startDate: Date, endDate: Date) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        id,
        salon_id,
        customer_id,
        start_time,
        status,
        notes,
        created_at,
        customer:customers (id, name, phone),
        appointment_items (
          id,
          appointment_id,
          service_id,
          professional_id,
          price_applied,
          services (id, name, price)
        )
      `)
      .eq('salon_id', salonId)
      .gte('start_time', startDate.toISOString())
      .lt('start_time', endDate.toISOString())
      .is('deleted_at', null)
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as any as AppointmentWithRelations[];
  }

  /** @deprecated Use getAppointments instead */
  static async getTodayAppointments(salonId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.getAppointments(salonId, today, tomorrow);
  }

  /**
   * Cria um agendamento e seu item de serviço associado.
   * DESIGN PATTERN: Sequential Transaction (Orchestration).
   */
  static async createAppointment(input: CreateAppointmentInput) {
    // 1. Inserir o agendamento base
    const { data: appointment, error: aptError } = await supabase
      .from('appointments')
      .insert({
        salon_id: input.salon_id,
        customer_id: input.customer_id,
        start_time: input.start_time,
        status: 'scheduled',
        notes: input.notes
      })
      .select()
      .single();

    if (aptError) throw aptError;

    // 2. Buscar o preço atual do serviço para persistência histórica (Imutabilidade de preço)
    const { data: service } = await supabase
      .from('services')
      .select('price')
      .eq('id', input.service_id)
      .single();

    // 3. Criar o item do agendamento
    const { error: itemError } = await supabase
      .from('appointment_items')
      .insert({
        appointment_id: appointment.id,
        service_id: input.service_id,
        professional_id: input.professional_id,
        price_applied: service?.price || 0
      });

    if (itemError) throw itemError;

    return appointment;
  }

  /**
   * Atualiza dados básicos de um agendamento (Ex: Reagendamento)
   */
  static async updateAppointment(id: string, updates: { start_time?: string; status?: AppointmentStatus }) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ 
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Soft Delete de agendamento (Cancelamento lógico)
   */
  static async deleteAppointment(id: string) {
    const { error } = await supabase
      .from('appointments')
      .update({ 
        deleted_at: new Date().toISOString(),
        status: 'cancelled'
      })
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  /**
   * Busca o histórico técnico detalhado de uma cliente.
   * Inclui a fórmula química e o serviço realizado na data.
   */
  static async getCustomerTechnicalHistory(customerId: string) {
    const { data, error } = await supabase
      .from('technical_histories')
      .select(`
        id,
        formula,
        created_at,
        appointments (
          id,
          start_time,
          appointment_items (
            services (name)
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}

// import { supabase } from '../lib/supabase';

// // Tipagem para garantir precisão no consumo
// export interface ProductConsumption {
//   product_id: string;
//   qty: number;
// }

// export class AppointmentService {
//   /**
//    * Finaliza um atendimento realizando checkout financeiro e de estoque.
//    * Chama a função RPC process_appointment_checkout no PostgreSQL.
//    */
//   static async checkout(
//     appointmentId: string,
//     consumptions: ProductConsumption[],
//     formula: string,
//     paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'pix'
//   ) {
//     try {
//       // O Supabase entende automaticamente os parâmetros da RPC
//       const { data, error } = await supabase.rpc('process_appointment_checkout', {
//         p_appointment_id: appointmentId,
//         p_consumptions: consumptions, // O PostgreSQL converterá o array JS para JSONB
//         p_formula_text: formula,
//         p_payment_method: paymentMethod
//       });

//       if (error) {
//         // Tratamento de erros específicos do banco (ex: estoque insuficiente)
//         console.error('Erro na RPC de Checkout:', error.message);
//         throw new Error(error.message);
//       }

//       return { success: true, data };
//     } catch (err) {
//       console.error('Falha crítica no checkout:', err);
//       throw err;
//     }
//   }

//   /**
//    * Busca histórico técnico do cliente (Anamnese Estruturada)
//    */
//   static async getTechnicalHistory(customerId: string) {
//     const { data, error } = await supabase
//       .from('technical_histories')
//       .select('*')
//       .eq('customer_id', customerId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return data;
//   }

//   static async getCustomerHistory(customerId: string) {
//   const { data, error } = await supabase
//     .from('technical_histories')
//     .select(`
//       id,
//       formula,
//       created_at,
//       appointments (
//         start_time,
//         appointment_items (
//           services (name)
//         )
//       )
//     `)
//     .eq('customer_id', customerId)
//     .order('created_at', { ascending: false });

//   if (error) throw error;
//   return data;
// }

// // src/services/AppointmentService.ts

// static async getTodayAppointments(salonId: string) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const tomorrow = new Date(today);
//   tomorrow.setDate(tomorrow.getDate() + 1);

//   const { data, error } = await supabase
//     .from('appointments')
//     .select(`
//       id,
//       start_time,
//       status,
//       customer:customers (id, name, phone),
//       appointment_items (
//         services (name)
//       )
//     `)
//     .eq('salon_id', salonId)
//     .gte('start_time', today.toISOString())
//     .lt('start_time', tomorrow.toISOString())
//     .is('deleted_at', null)
//     .order('start_time', { ascending: true });

//   if (error) throw error;
//   return data;
// }
// }