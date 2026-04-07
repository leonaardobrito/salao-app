import CustomerSearch from '../CustomerSearch';
import { User, Search as SearchIcon } from 'lucide-react';
import type { Customer } from '../../types';

export const SearchView = ({ onSelect }: { onSelect: (c: Customer) => void }) => {
  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xl font-bold">Quem vamos atender?</h3>
          <p className="text-indigo-100 text-sm mt-2">Digite o nome ou telefone para acessar a ficha técnica.</p>
        </div>
        <SearchIcon className="absolute -right-4 -bottom-4 text-indigo-500 opacity-30" size={140} />
      </div>

      <CustomerSearch onSelect={onSelect} />

      <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
        <User className="mx-auto text-slate-100 mb-4" size={60} />
        <p className="text-slate-400 text-sm font-medium leading-relaxed px-4">
          O histórico de cores aparecerá assim que você selecionar a cliente.
        </p>
      </div>
    </div>
  );
};