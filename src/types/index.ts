import { z } from 'zod';

// --- DOMAIN ENUMS ---

export type UserRole = 'owner' | 'admin' | 'professional' | 'customer';
export type UnitOfMeasure = 'g' | 'ml' | 'un';
export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'pix';

// --- CORE INTERFACES (Database Entities) ---

export interface Salon {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  custom_domain?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Profile {
  id: string; // FK para auth.users
  salon_id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Customer {
  id: string;
  salon_id: string;
  user_id?: string | null; // Preenchido se o cliente criar conta no PWA
  name: string;
  phone: string | null;
  birth_date?: string | null;
  metadata: {
    alergias?: string[];
    bebida_favorita?: string;
    notas_gerais?: string;
    [key: string]: any; // Flexibilidade para o futuro
  };
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface Product {
  id: string;
  salon_id: string;
  name: string;
  brand: string | null;
  sku: string | null; // Código de barras/Referência
  category: string | null;
  unit: UnitOfMeasure;
  current_stock: number;
  min_threshold: number;
  cost_price: number | null;
  last_restock_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// --- APP LOGIC TYPES ---

export interface ProductConsumption {
  product_id: string;
  qty: number; // Precisão decimal em gramas ou mililitros
}

export interface CreateAppointmentInput {
  salon_id: string;
  customer_id: string;
  professional_id: string;
  service_id: string;
  start_time: string;
  notes?: string;
}

export interface TechnicalHistory {
  id: string;
  customer_id: string;
  appointment_id: string;
  formula: string;
  created_at: string;
}

// --- JOINED TYPES (For UI/Agenda) ---

export interface AppointmentItemWithService {
  id: string;
  appointment_id: string;
  service_id: string;
  professional_id: string;
  price_applied: number;
  services: {
    id: string;
    name: string;
    price: number;
  };
  profiles?: Profile;
}

export interface AppointmentWithRelations {
  id: string;
  salon_id: string;
  customer_id: string;
  start_time: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
  customer: {
    id: string;
    name: string;
    phone: string | null;
  };
  appointment_items: AppointmentItemWithService[];
}

// --- VALIDATION SCHEMAS (Zod - Design Pattern: DTO) ---

/**
 * Schema para Criação/Edição de Produtos.
 * Garante que a UI envie dados sanitizados para o InventoryService.
 */
export const productSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  brand: z.string().optional(),
  category: z.string().optional(),
  sku: z.string().optional(),
  unit: z.enum(['g', 'ml', 'un'] as const),
  current_stock: z.number().min(0, "Mínimo 0"),
  min_threshold: z.number().min(0, "Mínimo 0"),
  cost_price: z.number().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Schema para o Checkout de Atendimento.
 */
export const checkoutSchema = z.object({
  appointment_id: z.string().uuid(),
  consumptions: z.array(z.object({
    product_id: z.string().uuid(),
    qty: z.number().positive()
  })),
  formula_text: z.string().min(1, "Descreva a fórmula utilizada"),
  payment_method: z.enum(['cash', 'credit_card', 'debit_card', 'pix'] as const),
});

// import { z } from 'zod';

// export type UserRole = 'owner' | 'admin' | 'professional' | 'customer';

// export interface Salon {
//   id: string;
//   name: string;
//   slug: string;
//   owner_id: string;
//   custom_domain?: string;
//   settings?: any;
//   created_at: string;
// }

// export interface Profile {
//   id: string;
//   full_name: string;
//   role: UserRole;
//   salon_id: string;
//   avatar_url?: string;
// }

// export interface Customer {
//   id: string;
//   name: string;
//   phone: string;
//   user_id?: string;
//   salon_id: string;
//   metadata?: any;
// }

// export interface ProductConsumption {
//   product_id: string;
//   qty: number;
// }

// // export type UserRole = 'owner' | 'admin' | 'professional' | 'customer';

// // export interface Customer {
// //   id: string;
// //   name: string;
// //   phone: string;
// //   last_appointment?: string;
// // }

// // export interface ProductConsumption {
// //   product_id: string;
// //   qty: number;
// // }

// // export interface Salon {
// //   id: string;
// //   name: string;
// //   owner_id: string;
// //   created_at: string;
// // }

// // export interface Profile {
// //   id: string;
// //   full_name: string;
// //   email: string;
// //   avatar_url?: string;
// //   role: UserRole;
// //   salon_id: string;
// // }