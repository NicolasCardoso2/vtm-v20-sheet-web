# Vampire: A Máscara - Fichas Digitais

Sistema completo de criação e gerenciamento de fichas para Vampiro: A Máscara (Edição do 20º Aniversário).

## Status: Funcionando

**Projeto totalmente funcional!** Sistema completo de criação de personagens com auto-save offline e interface otimizada.

### Últimas Correções (Dezembro 2024):
- **Sistema Auto-Save Offline**: Implementado fallback para localStorage quando Supabase não está configurado
- **TraitsModal Corrigido**: Modal de qualidades/defeitos abrindo corretamente
- **Chaves React Únicas**: Resolvidos warnings de chaves duplicadas no console
- **Remoção Automática de Duplicatas**: Dataset limpo automaticamente durante carregamento
- **Indicadores de Status**: Componentes visuais para modo offline e status de salvamento
- **Acessibilidade**: Adicionadas descrições ARIA para conformidade
- **Validação Robusta**: Sistema híbrido online/offline para continuidade de desenvolvimento

### Correções Base:
- Erros TypeScript resolvidos ("Cannot find module")
- Configuração TypeScript atualizada para ES2017
- Arquivo `global.d.ts` criado para tipos globais
- Componentes UI configurados corretamente
- Tipagem corrigida no cálculo de atributos
- Dependência `autoprefixer` adicionada
- Compilação executando sem erros

## Características Principais

- **Wizard de Criação**: Sistema guiado em 5 etapas para criação de personagens
- **Sistema Offline**: Funciona completamente offline com localStorage quando Supabase não está configurado
- **Auto-save Híbrido**: Salvamento automático online/offline com indicadores visuais de status
- **Validação Automática**: Controle de pontos gastos e limites configuráveis  
- **TraitsModal Otimizado**: Seleção de qualidades e defeitos com remoção automática de duplicatas
- **Sistema de Crônicas**: Narradores podem criar crônicas e gerenciar jogadores
- **Aprovação de Fichas**: Fluxo de aprovação controlado pelo narrador
- **Exportação PDF**: Fichas prontas para impressão (em desenvolvimento)
- **Mobile-First**: Interface responsiva e otimizada para dispositivos móveis
- **Acessibilidade**: Componentes seguem padrões ARIA completos

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

2. **Executar em desenvolvimento (Modo Offline):**
```bash
npm run dev
```
   - O sistema funciona completamente offline usando localStorage
   - Ideal para desenvolvimento e testes sem necessidade de configurar Supabase

3. **Configurar Supabase (Opcional para Produção):**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o script SQL em `database/schema.sql`
   - Configure as variáveis de ambiente no `.env.local`
   - O sistema detecta automaticamente se Supabase está configurado

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
# Opcional - Sistema funciona offline sem estas configurações
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

> **Nota**: O sistema detecta automaticamente se Supabase está configurado e usa localStorage como fallback, permitindo desenvolvimento completo offline.

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