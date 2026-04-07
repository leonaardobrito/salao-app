import { useState, useEffect } from 'react';
import { InventoryService } from '../../services/InventoryService';
import { ProductCard } from '../ui/ProductCard';
import { ProductForm } from './ProductForm';
import { Plus, Search, Loader2, PackageX } from 'lucide-react';
import { useSalon } from '../../context/SalonContext';
import type { Product, ProductFormData } from '../../types';

export const InventoryView = () => {
  const { salon } = useSalon();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Estados para o Modal de CRUD
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await InventoryService.listProducts();
      setProducts(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (formData: ProductFormData) => {
    if (!salon?.id) return;
    try {
      await InventoryService.saveProduct({
        ...formData,
        id: editingProduct?.id, // Se for edição, mantém o ID
        salon_id: salon.id
      });
      setIsFormOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Busca */}
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        <input 
          type="text"
          placeholder="Buscar no estoque..."
          className="w-full pl-14 pr-6 py-5 bg-white rounded-[2rem] border-none shadow-sm focus:ring-2 focus:ring-pink-500/20 outline-none text-slate-700 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-pink-500" /></div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={(p) => { setEditingProduct(p); setIsFormOpen(true); }}
              onDelete={async (id) => {
                if(confirm('Remover este item do estoque?')) {
                  await InventoryService.deleteProduct(id);
                  loadData();
                }
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <PackageX size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-medium">Nenhum produto em estoque.</p>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
        className="fixed bottom-28 right-6 w-16 h-16 bg-slate-950 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40"
      >
        <Plus size={32} />
      </button>

      {/* Modal de CRUD */}
      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onSave={handleSave} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};