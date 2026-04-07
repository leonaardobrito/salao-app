import { supabase } from "../lib/supabase";
import type { ProductConsumption } from "../types";

export class AppointmentService {
  static async checkout(
    appointmentId: string,
    consumptions: ProductConsumption[],
    formula: string,
    paymentMethod: "cash" | "credit_card" | "debit_card" | "pix"
  ) {
    try {
      const { data, error } = await supabase.rpc("process_appointment_checkout", {
        p_appointment_id: appointmentId,
        p_consumptions: consumptions,
        p_formula_text: formula,
        p_payment_method: paymentMethod,
      });

      if (error) {
        console.error("Erro na RPC de Checkout:", error.message);
        throw new Error(error.message);
      }

      return { success: true, data };
    } catch (err) {
      console.error("Falha crítica no checkout:", err);
      throw err;
    }
  }

  static async getTechnicalHistory(customerId: string) {
    const { data, error } = await supabase
      .from("technical_histories")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getCustomerHistory(customerId: string) {
    const { data, error } = await supabase
      .from("technical_histories")
      .select(
        `
      id,
      formula,
      created_at,
      appointments (
        start_time,
        appointment_items (
          services (name)
        )
      )
    `
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getSalonAppointments(salonId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        id,
        start_time,
        end_time,
        status,
        customer:customers(id, name, phone),
        professional:profiles(id, full_name, avatar_url),
        appointment_items(service:services(id, name, price))
      `
      )
      .eq("salon_id", salonId)
      .order("start_time", { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAppointmentDetails(appointmentId: string) {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        customer:customers(id, name, phone),
        professional:profiles(id, full_name, avatar_url),
        appointment_items(service:services(id, name, price)),
        technical_history(id, formula)
      `
      )
      .eq("id", appointmentId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }
}
