import { useState } from 'react';
import { AuthService } from '../services/AuthService';
import { Mail, Lock, User, Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useSalon } from '../context/SalonContext';

export default function Auth() {
  const { salon, loading: salonLoading } = useSalon();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Validação preventiva de Tenant
        if (!salon?.id) {
          throw new Error("Não foi possível identificar o salão através da URL.");
        }
        
        await AuthService.signIn(formData.email, formData.password, salon.id);
        // O redirecionamento acontecerá via listener no App.tsx ou Root.tsx
      } else {
        await AuthService.signUp(
          formData.email, 
          formData.password, 
          formData.name,
          salon?.id // Opcional: Se cadastrar via URL do salão, vira cliente automaticamente
        );
        
        alert("Conta criada! Verifique sua caixa de entrada para confirmar o e-mail.");
        setIsLogin(true);
      }
    } catch (err: any) {
      // Mapeamento de erros amigáveis para o usuário
      const msg = err.message;
      if (msg.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // State de carregamento inicial do salão (Resolução de DNS/Slug)
  if (salonLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-pink-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-sm mx-auto w-full space-y-8">
        
        {/* Branding Dinâmico */}
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-pink-600 rounded-[2rem] mx-auto flex items-center justify-center shadow-2xl shadow-pink-200 rotate-3 transition-all hover:rotate-0 duration-500">
            <span className="text-white text-4xl font-black italic">
              {salon?.name?.charAt(0) || 'S'}
            </span>
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mt-4">
            {salon?.name || 'SALAO APP'}
          </h1>
          
          <p className="text-slate-400 text-sm font-medium">
            {isLogin ? 'Bem-vindo ao portal de agendamentos' : 'Crie sua conta e comece agora'}
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm animate-in slide-in-from-top-2">
              <AlertCircle size={18} className="shrink-0" />
              <p className="leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-4 text-slate-300" size={20} />
                  <input 
                    type="text" 
                    required
                    placeholder="Como quer ser chamado?"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700 transition-all"
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-300" size={20} />
                <input 
                  type="email" 
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700 transition-all"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-300" size={20} />
                <input 
                  type="password" 
                  required
                  placeholder="Sua senha secreta"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 outline-none text-slate-700 transition-all"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black active:scale-95 transition-all shadow-xl shadow-slate-200 mt-4 disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? <Loader2 className="animate-spin" /> : isLogin ? "Acessar Salão" : "Confirmar Cadastro"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>

        {/* Footer: Alternância entre Login/Cadastro */}
        <div className="text-center space-y-4">
          <p className="text-sm text-slate-500 font-medium">
            {isLogin ? "Ainda não tem acesso?" : "Já possui uma conta?"} <br />
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }} 
              className="text-pink-600 font-black mt-2 underline underline-offset-4 active:opacity-50"
            >
              {isLogin 
                ? (salon ? `Quero me cadastrar no ${salon.name}` : "Abrir meu próprio Salão") 
                : "Voltar para o Login"
              }
            </button>
          </p>
          
          <div className="pt-4 opacity-30">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
              Powered by Salao App • v1.2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
