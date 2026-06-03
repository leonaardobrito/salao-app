import { supabase } from '../lib/supabase';
import type { Product } from '../types';

export class InventoryService {
  /** Lista produtos ativos do salão atual (RLS cuida do salon_id) */
  static async listProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Product[];
  }

  /** Cria ou Atualiza um produto. O objeto 'product' deve conter o salon_id do contexto. */
  static async saveProduct(product: Partial<Product> & { salon_id: string }): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .upsert({ ...product, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  /** Soft Delete: Mantém o registro para integridade de históricos técnicos */
  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }

  /** Atualiza o estoque após a finalização de um agendamento */
  static async updateStockAfterAppointment(appointmentId: string): Promise<void> {
    const { data: histories } = await supabase
      .from('technical_histories')
      .select('*')
      .eq('appointment_id', appointmentId);

    for (const history of histories || []) {
      const formula = history.formula;
      const items = formula.split('+').map((item: string) => item.trim());

      for (const item of items) {
        const [quantityStr, productName] = item.split(' ');
        const match = quantityStr.match(/(\d+(\.\d+)?)(g|ml|kg|L)?/);
        if (!match || !productName) continue;

        const [, num, unit] = match;
        const quantity = parseFloat(num);
        const product = await InventoryService.findProductByName(productName);
        if (product) {
          const newStock = product.current_stock - quantity;
          await InventoryService.saveProduct({ ...product, current_stock: newStock });
        }
      }
    }
  }

  /** Busca produto por nome */
  static async findProductByName(name: string): Promise<Product | null> {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('name', name);
    return data?.[0] || null;
  }
}