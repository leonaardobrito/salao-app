import { supabase } from '../lib/supabase';
import type { Product, ProductFormData } from '../types';

export class InventoryService {
  /**
   * Lista produtos ativos do salão atual (RLS cuida do salon_id)
   */
  static async listProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .is('deleted_at', null)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Product[];
  }

  /**
   * Cria ou Atualiza um produto.
   * O objeto 'product' deve conter o salon_id do contexto.
   */
  static async saveProduct(product: Partial<Product> & { salon_id: string }): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .upsert({
        ...product,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  }

  /**
   * Soft Delete: Mantém o registro para integridade de históricos técnicos
   */
  static async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
  }
}

// import { supabase } from '../lib/supabase';
// import type { Product, UnitOfMeasure } from '../types';

// export interface ProductInput {
//   name: string;
//   brand?: string;
//   unit: UnitOfMeasure;
//   current_stock: number;
//   min_threshold: number;
//   cost_price?: number;
//   category?: string;
//   sku?: string;
// }

// export class InventoryService {
//   static async listProducts() {
//     const { data, error } = await supabase
//       .from('products')
//       .select('*')
//       .is('deleted_at', null)
//       .order('name');

//     if (error) throw error;
//     return data;
//   }

//   static async saveProduct(product: Partial<Product> & { salon_id: string }) {
//     const { data, error } = await supabase
//       .from('products')
//       .upsert(product)
//       .select()
//       .single();

//     if (error) throw error;
//     return data;
//   }

//   static async deleteProduct(id: string) {
//     const { error } = await supabase
//       .from('products')
//       .update({ deleted_at: new Date().toISOString() })
//       .eq('id', id);

//     if (error) throw error;
//   }
// }