# Vampire: A Máscara - Fichas Digitais

Sistema completo de criação e gerenciamento de fichas para Vampiro: A Máscara (Edição do 20º Aniversário).

## Status: Funcionando

**Projeto corrigido e funcionando!** Todos os erros TypeScript foram resolvidos e o sistema está pronto para desenvolvimento.

### Correções Aplicadas:
- Erros TypeScript resolvidos ("Cannot find module")
- Configuração TypeScript atualizada para ES2017
- Arquivo `global.d.ts` criado para tipos globais
- Componentes UI configurados corretamente
- Tipagem corrigida no cálculo de atributos
- Dependência `autoprefixer` adicionada
- Compilação executando sem erros

## Características Principais

- **Wizard de Criação**: Sistema guiado em 5 etapas para criação de personagens
- **Validação Automática**: Controle de pontos gastos e limites configuráveis  
- **Sistema de Crônicas**: Narradores podem criar crônicas e gerenciar jogadores
- **Aprovação de Fichas**: Fluxo de aprovação controlado pelo narrador
- **Auto-save**: Salvamento automático durante a criação
- **Exportação PDF**: Fichas prontas para impressão (em desenvolvimento)
- **Mobile-First**: Interface responsiva e otimizada para dispositivos móveis

## Tecnologias Utilizadas

- **Frontend**: Next.js 14+ com App Router
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **Validação**: Zod + React Hook Form
- **Deploy**: Vercel

## Instalação

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o script SQL em `database/schema.sql`
   - Configure as variáveis de ambiente no `.env.local`

3. **Executar em desenvolvimento:**
```bash
npm run dev
```

## Como Usar

### Para Narradores:
1. Criar conta e fazer login
2. Criar uma nova crônica no dashboard
3. Configurar regras da crônica (clãs permitidos, limites, etc.)
4. Compartilhar código da crônica com jogadores
5. Aprovar fichas criadas pelos jogadores

### Para Jogadores:
1. Criar conta e fazer login
2. Entrar em uma crônica (via convite do narrador)
3. Criar personagem usando o wizard de 5 etapas:
   - **Passo 1**: Conceito, Clã, Natureza, Comportamento
   - **Passo 2**: Distribuir pontos de Atributos
   - **Passo 3**: Distribuir pontos de Habilidades
   - **Passo 4**: Escolher Vantagens (Disciplinas, Antecedentes, Virtudes)
   - **Passo 5**: Configurar Moralidade e revisar ficha
4. Submeter para aprovação do narrador

## Configuração do Ambiente

### Variáveis de Ambiente (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Scripts Disponíveis
- `npm run dev` - Executar em modo de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Executar versão de produção
- `npm run lint` - Verificar código com ESLint

## Estrutura de Dados

### Chronicle (Crônica)
- Configurações flexíveis via JSON
- Controle de clãs permitidos
- Limites de pontos personalizáveis
- House rules configuráveis

### Character (Personagem)
- Dados de identidade
- Atributos, Habilidades e Vantagens em JSON
- Sistema de status e aprovação
- Histórico de mudanças (changelog)

## Interface

- **Design Temático**: Paleta de cores vermelha/preta inspirada no Vampiro
- **Componentes Reutilizáveis**: Sistema baseado em shadcn/ui
- **Responsivo**: Mobile-first com Progressive Web App features
- **Acessível**: Componentes seguem padrões ARIA

## Funcionalidades Mobile

- Interface otimizada para toque
- Botões grandes e navegação intuitiva
- Auto-save para evitar perda de dados
- Scroll por seções para facilitar navegação

## Deploy

O projeto está configurado para deploy automático no Vercel:

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

## Licença

Este projeto é para uso pessoal e educacional. Vampiro: A Máscara é propriedade da Modiphius Entertainment.

## Contribuições

Contribuições são bem-vindas! Por favor:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

---

**Nota**: Este sistema foca na estrutura e fluxo de criação de fichas, não incluindo o conteúdo completo do livro para evitar questões de direitos autorais.