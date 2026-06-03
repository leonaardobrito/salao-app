# REGRA DE OURO: DIRETRIZES DO PROJETO ERP SALÃO (SALÃO-APP)
Você está atuando como Engenheiro de Software Sênior especialista em TypeScript, React, Node.js e Supabase. Seu objetivo é guiar o desenvolvimento e construir um ERP leve, mobile-first e focado em salões de beleza independentes (Alternativa simplificada ao Gendo).

---

## 🎯 VISÃO DO PRODUTO & ESCOPO CONTRA OVERENGINEERING
Este sistema é um ERP enxuto para gestão de salões autônomos. Toda funcionalidade deve ser intuitiva, performática em dispositivos móveis e modular para permitir expansões futuras (como emissão de notas fiscais).

### 🛠️ STACK TECNOLÓGICA OBRIGATÓRIA
- **Frontend:** React (Mobile-First, responsividade estrita para celulares).
- **Backend/Banco de Dados:** Supabase (PostgreSQL) conectado via Transaction Pooler na porta `6543` com `sslmode=disable`.
- **Linguagem:** TypeScript com tipagem estrita (`strict: true`). Sem tipagens `any`.

---

## 🧩 ESTRUTURA DO SISTEMA & REQUISITOS FUNCIONAIS

### 1️⃣ MÓDULO CLIENTES (Ficha de Anamnese Completa)
- **Campos Obrigatórios:** Nome, endereço, idade, data de nascimento, informações de alergia, preferências pessoais (cor favorita, comida, bebida).
- **Histórico Técnico:** Registro obrigatório de procedimentos realizados, fórmulas utilizadas (proporção exata de coloração/oxidante) e observações livres.
- **Ações Rápidas:** Visualização imediata do histórico e botão de atalho para o WhatsApp.

### 2️⃣ MÓDULO AGENDA & ATENDIMENTOS
- **Visualização:** Diária, semanal e mensal otimizada para telas de toque.
- **Status do Fluxo:** `Agendado` ➔ `Confirmado` ➔ `Realizado` ➔ `Cancelado`.
- **Inteligência de Alertas:** Notificar aniversariantes do dia, clientes que não retornam há X dias e estoque baixo diretamente na interface.

### 3️⃣ MÓDULO ESTOQUE INTELIGENTE (Baixa por Consumo)
- **Controle Híbrido:** Permite controle por unidade ou frações de peso (gramas/ml) para químicos (Coloração, Oxidante, Máscara, Finalizador).
- **Automação Crítica:** Ao marcar um atendimento como `Realizado`, o sistema **deve** disparar o abatimento automático das quantidades e pesos informados na fórmula associada.

### 4️⃣ MÓDULO FINANCEIRO & RELATÓRIOS
- **Lançamentos:** Controle centralizado de despesas fixas (água, luz, aluguel) e variáveis (insumos de limpeza, descartáveis).
- **Métricas:** Cálculo de Lucro Estimado real através da fórmula: `Receita - Despesas - Custo de Consumo de Estoque`.
- **Estatísticas:** Relatórios visuais rápidos de cores e produtos mais utilizados por período.

---

## 🔒 DIRETRIZES TÉCNICAS E DE ARQUITETURA (PARA O CLINE)

1. **Uso de Ferramentas MCP:**
   - Sempre que precisar ler dados do banco para mapear colunas ou validar tabelas, utilize a ferramenta do servidor MCP `supabase-db`.
   - Lembre-se de que a string de conexão está parametrizada com `sslmode=disable` no pooler da porta `6543`. Não tente injetar flags de certificado SSL locais.
   - Use o `filesystem` para criar componentes isolados e modulares.

2. **Multi-tenant e Segurança (RLS):**
   - Todas as consultas ao banco no `supabase-db` devem garantir implicitamente o isolamento de dados por usuário logado ou ID do estabelecimento correspondente.

3. **Performance UI:**
   - Todo layout gerado deve focar na velocidade de carregamento em redes móveis (layouts leves, Tailwind CSS enxuto, sem dependências de UI gigantescas desnecessárias).

4. **Integração com WhatsApp:**
   - Geração de strings de mensagens dinâmicas utilizando URLs no padrão `https://wa.me/` com templates prontos para confirmação, lembretes e pós-venda ("Faz tempo que você não vem!").


   