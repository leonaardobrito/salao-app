import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormData, type Product } from '../../types';
import { X, Save, Loader2 } from 'lucide-react';

interface Props {
  product?: Product | null;
  onSave: (data: ProductFormData) => Promise<void>;
  onClose: () => void;
}

export const ProductForm = ({ product, onSave, onClose }: Props) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      brand: product?.brand ?? '',
      category: product?.category ?? '',
      sku: product?.sku ?? '',
      unit: product?.unit ?? 'g',
      current_stock: product?.current_stock ?? 0,
      min_threshold: product?.min_threshold ?? 0,
      cost_price: product?.cost_price ?? 0,
    }
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <form 
        onSubmit={handleSubmit(onSave)} 
        className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl p-8 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {product ? 'Editar Produto' : 'Novo Ativo'}
            </h2>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
              Inventário Técnico
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-slate-50 rounded-full text-slate-400 active:scale-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Nome */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Nome do Produto</label>
            <input 
              {...register('name')} 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" 
            />
            {errors.name && <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Marca */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Marca</label>
              <input {...register('brand')} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" />
            </div>
            {/* SKU */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">SKU / Ref</label>
              <input {...register('sku')} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" />
            </div>
          </div>

          {/* Categoria (adicione se necessário) */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Categoria</label>
            <input {...register('category')} className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" />
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] grid grid-cols-3 gap-4">
            {/* Unidade */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Unidade</label>
              <select 
                {...register('unit')} 
                className="w-full p-4 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none appearance-none font-bold text-slate-700 mt-1"
              >
                <option value="g">g</option>
                <option value="ml">ml</option>
                <option value="un">un</option>
              </select>
            </div>

            {/* Estoque Atual */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Atual</label>
              <input 
                type="number" 
                step="0.01" 
                {...register('current_stock', { valueAsNumber: true })} 
                className="w-full p-4 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none font-black text-slate-900 mt-1" 
              />
            </div>

            {/* Mínimo */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Mínimo</label>
              <input 
                type="number" 
                step="0.01" 
                {...register('min_threshold', { valueAsNumber: true })} 
                className="w-full p-4 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none font-black text-amber-600 mt-1" 
              />
            </div>
          </div>

          {/* Preço de custo */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Preço de Custo</label>
            <input 
              type="number" 
              step="0.01" 
              {...register('cost_price', { valueAsNumber: true })} 
              className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-lg mt-8 flex items-center justify-center gap-3 shadow-xl shadow-slate-200 active:scale-95 transition-all disabled:bg-slate-400"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {product ? 'ATUALIZAR' : 'CADASTRAR'}
        </button>
      </form>
    </div>
  );
};