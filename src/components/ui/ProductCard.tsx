import { Package, AlertTriangle, Edit3, Trash2 } from 'lucide-react';
import type { Product } from '../../types';

interface Props {
  product: Product;
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: Props) => {
  // Cálculo de saúde do estoque
  const stockLevel = (product.current_stock / (product.min_threshold * 2)) * 100;
  const isLow = product.current_stock <= product.min_threshold;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group relative overflow-hidden">
      {isLow && (
        <div className="absolute top-0 right-0 bg-amber-500 text-white p-2 rounded-bl-2xl">
          <AlertTriangle size={14} />
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-pink-500 transition-colors">
          <Package size={24} />
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(product)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600">
            <Edit3 size={18} />
          </button>
          <button onClick={() => onDelete(product.id)} className="p-2 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-500">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div>
        <h4 className="font-black text-slate-800 leading-tight uppercase tracking-tight text-sm mb-1 truncate">
          {product.name}
        </h4>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
          {product.brand || 'Marca Própria'} • {product.unit}
        </p>

        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">
              {product.current_stock}
              <small className="text-[10px] ml-1 text-slate-400">{product.unit}</small>
            </span>
            <span className="text-[9px] font-black text-slate-400 uppercase pb-1">
              Mín: {product.min_threshold}
            </span>
          </div>
          
          {/* Progress Bar Visual */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${isLow ? 'bg-amber-500' : 'bg-pink-500'}`}
              style={{ width: `${Math.min(stockLevel, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};