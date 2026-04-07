export type UserRole = 'owner' | 'admin' | 'professional' | 'customer';

export interface Salon {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  custom_domain?: string;
  settings?: any;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  salon_id: string;
  avatar_url?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  user_id?: string;
  salon_id: string;
  metadata?: any;
}

export interface ProductConsumption {
  product_id: string;
  qty: number;
}

// export type UserRole = 'owner' | 'admin' | 'professional' | 'customer';

// export interface Customer {
//   id: string;
//   name: string;
//   phone: string;
//   last_appointment?: string;
// }

// export interface ProductConsumption {
//   product_id: string;
//   qty: number;
// }

// export interface Salon {
//   id: string;
//   name: string;
//   owner_id: string;
//   created_at: string;
// }

// export interface Profile {
//   id: string;
//   full_name: string;
//   email: string;
//   avatar_url?: string;
//   role: UserRole;
//   salon_id: string;
// }