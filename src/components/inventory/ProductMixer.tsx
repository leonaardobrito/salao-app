import { useState, useEffect } from 'react';
import { Search, Beaker, Plus, Minus, Trash2 } from 'lucide-react';
import { InventoryService } from '../../services/InventoryService';
import type { Product, ProductConsumption } from '../../types';

interface Props {
  onFormulaChange: (consumptions: ProductConsumption[], formulaText: string) => void;
}

export const ProductMixer = ({ onFormulaChange }: Props) => {
  const [available, setAvailable] = useState<Product[]>([]);
  const [selected, setSelected] = useState<(Product & { qty: number })[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    InventoryService.listProducts().then(setAvailable);
  }, []);

  // Sincroniza com o componente pai (ProfileView)
  useEffect(() => {
    const consumptions = selected.map(s => ({ product_id: s.id, qty: s.qty }));
    const text = selected
      .filter(s => s.qty > 0)
      .map(s => `${s.qty}${s.unit} ${s.name}`)
      .join(' + ');
    onFormulaChange(consumptions, text);
  }, [selected]);

  const addProduct = (p: Product) => {
    if (selected.find(s => s.id === p.id)) return;
    setSelected([...selected, { ...p, qty: 0 }]);
    setSearch('');
  };

  const updateQty = (id: string, delta: number) => {
    setSelected(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ));
  };

  const remove = (id: string) => setSelected(prev => prev.filter(i => i.id !== id));

  const filtered = available.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) && 
    !selected.find(s => s.id === p.id)
  );

  return (
    <div className="space-y-6">
      {/* Search Input - Mobile Optimized */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={18} />
        <input 
          type="text"
          placeholder="Adicionar cor ou oxidante..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-4 focus:ring-pink-500/5 outline-none transition-all text-sm"
        />
        
        {search && (
          <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-50 z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
            {filtered.map(p => (
              <button key={p.id} onClick={() => addProduct(p)} className="w-full p-4 text-left hover:bg-slate-50 flex justify-between items-center border-b border-slate-50 last:border-none">
                <span className="font-bold text-slate-700 text-sm">{p.name}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-full text-slate-400 font-black">{p.unit}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mixer "Bucket" */}
      <div className="space-y-3">
        {selected.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
            <Beaker className="text-slate-200 mb-3" size={40} />
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Mistura Vazia</p>
          </div>
        ) : (
          selected.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between animate-in slide-in-from-right-4">
              <div className="flex-1 min-w-0 pr-4">
                <h4 className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">{item.name}</h4>
                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest">Saldo: {item.current_stock}{item.unit}</p>
              </div>

              <div className="flex items-center gap-3">
                <button onClick={() => updateQty(item.id, -5)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
                  <Minus size={16} className="text-slate-400" />
                </button>
                
                <div className="w-12 text-center">
                  <span className="text-lg font-black text-slate-900">{item.qty}</span>
                  <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{item.unit}</p>
                </div>

                <button onClick={() => updateQty(item.id, 5)} className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
                  <Plus size={16} className="text-slate-400" />
                </button>

                <button onClick={() => remove(item.id)} className="ml-2 p-2 text-slate-200 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};