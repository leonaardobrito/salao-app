import { useState, useEffect } from 'react';
import { Search, User, Phone, X, Loader2 } from 'lucide-react';
import { CustomerService, type Customer } from '../services/CustomerService';

// Definição da Interface (Contrato do Componente)
interface CustomerSearchProps {
  onSelect: (customer: Customer) => void;
}

export default function CustomerSearch({ onSelect }: CustomerSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Lógica de Busca com Debounce (SOLID: Responsabilidade Única)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsSearching(true);
        try {
          const data = await CustomerService.searchCustomers(query);
          setResults(data);
        } catch (error) {
          console.error("Erro na busca:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 400); // 400ms é o "sweet spot" para mobile

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full">
      {/* Input de Busca Mobile-First */}
      <div className="relative flex items-center">
        <Search className="absolute left-4 text-slate-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar cliente ou telefone..."
          className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-lg transition-all placeholder:text-slate-300"
        />
        
        <div className="absolute right-4 flex items-center gap-2">
          {isSearching && <Loader2 className="animate-spin text-pink-500" size={18} />}
          {query && !isSearching && (
            <button 
              onClick={() => { setQuery(''); setResults([]); }}
              className="p-1 bg-slate-100 rounded-full text-slate-400 active:scale-90"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Lista de Resultados (Dropdown) */}
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-64 overflow-y-auto">
            {results.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  onSelect(c);
                  setQuery('');
                  setResults([]);
                }}
                className="w-full p-4 flex items-center justify-between border-b border-slate-50 last:border-none active:bg-pink-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-700">{c.name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Phone size={10} /> {c.phone || 'Sem telefone'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState, useEffect } from 'react';
// import { Search, User, Phone, X } from 'lucide-react';
// import { CustomerService, type Customer } from '../services/CustomerService';

// interface Props {
//   onSelect: (customer: Customer) => void;
// }

// export default function CustomerSearch({ onSelect }: Props) {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<Customer[]>([]);
//   const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(async () => {
//       if (query.length >= 2) {
//         setIsSearching(true);
//         const data = await CustomerService.searchCustomers(query);
//         setResults(data);
//         setIsSearching(false);
//       } else {
//         setResults([]);
//       }
//     }, 300); // Debounce de 300ms para poupar API

//     return () => clearTimeout(delayDebounceFn);
//   }, [query]);

//   return (
//     <div className="relative w-full">
//       <div className="relative flex items-center">
//         <Search className="absolute left-4 text-slate-400" size={20} />
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           placeholder="Buscar cliente ou telefone..."
//           className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-pink-500 outline-none text-lg transition-all"
//         />
//         {query && (
//           <button 
//             onClick={() => { setQuery(''); setResults([]); }}
//             className="absolute right-4 p-1 bg-slate-100 rounded-full text-slate-400"
//           >
//             <X size={16} />
//           </button>
//         )}
//       </div>

//       {results.length > 0 && (
//         <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
//           {results.map((c) => (
//             <button
//               key={c.id}
//               onClick={() => {
//                 onSelect(c);
//                 setQuery('');
//                 setResults([]);
//               }}
//               className="w-full p-4 flex items-center justify-between border-b border-slate-50 last:border-none active:bg-slate-50 transition-colors"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
//                   <User size={20} />
//                 </div>
//                 <div className="text-left">
//                   <p className="font-bold text-slate-700">{c.name}</p>
//                   <p className="text-xs text-slate-400 flex items-center gap-1">
//                     <Phone size={10} /> {c.phone}
//                   </p>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }