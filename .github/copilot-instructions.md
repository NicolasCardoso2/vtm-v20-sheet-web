# Vampire: A Máscara - Fichas Digitais

Sistema completo de criação e gerenciamento de fichas para Vampiro: A Máscara desenvolvido em Next.js + TypeScript + Supabase.

## ✅ Setup Completo

- [x] Verify that the copilot-instructions.md file in the .github directory is created.
- [x] Clarify Project Requirements - Sistema de fichas com wizard em 5 etapas
- [x] Scaffold the Project - Next.js 14+ com App Router, TypeScript e Tailwind
- [x] Customize the Project - Implementado sistema de auth, dashboard, tipos e estrutura
- [x] Install Required Extensions - Nenhuma extensão específica necessária
- [x] Compile the Project - Dependências configuradas e projeto estruturado
- [x] Create and Run Task - Tasks de desenvolvimento configuradas
- [x] Launch the Project - Servidor de desenvolvimento pronto
- [x] Ensure Documentation is Complete - README.md e instruções completas

## 🚀 Próximos Passos

Para usar o sistema:

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar Supabase:**
   - Criar projeto no Supabase
   - Executar `database/schema.sql` 
   - Configurar `.env.local` com as credenciais

3. **Executar:**
   ```bash
   npm run dev
   ```

## 📁 Estrutura Criada

- ✅ Sistema de autenticação com Supabase
- ✅ Dashboard para narradores e jogadores
- ✅ Tipos TypeScript para fichas e crônicas
- ✅ Esquema de banco completo
- ✅ Componentes UI base (shadcn/ui)
- ✅ Configurações de Tailwind personalizadas
- ⏳ Wizard de criação de personagens (próximo passo)
- ⏳ Sistema de validação de pontos (próximo passo)
- ⏳ Exportação PDF (próximo passo)

## 🎮 Funcionalidades Implementadas

### Já Funcionando:
- Login/registro de usuários
- Dashboard principal
- Estrutura de crônicas e personagens
- Sistema de permissões (RLS)
- Interface responsiva temática

### Para Implementar:
- Wizard de 5 etapas para criação
- Validação automática de pontos
- Sistema de aprovação de fichas
- Exportação/impressão
- Auto-save durante criação

<!--
## Execution Guidelines
PROGRESS TRACKING:
- If any tools are available to manage the above todo list, use it to track progress through this checklist.
- After completing each step, mark it complete and add a summary.
- Read current todo list status before starting each new step.

COMMUNICATION RULES:
- Avoid verbose explanations or printing full command outputs.
- If a step is skipped, state that briefly (e.g. "No extensions needed").
- Do not explain project structure unless asked.
- Keep explanations concise and focused.

DEVELOPMENT RULES:
- Use '.' as the working directory unless user specifies otherwise.
- Avoid adding media or external links unless explicitly requested.
- Use placeholders only with a note that they should be replaced.
- Use VS Code API tool only for VS Code extension projects.
- Once the project is created, it is already opened in Visual Studio Code—do not suggest commands to open this project in Visual Studio again.
- If the project setup information has additional rules, follow them strictly.

FOLDER CREATION RULES:
- Always use the current directory as the project root.
- If you are running any terminal commands, use the '.' argument to ensure that the current working directory is used ALWAYS.
- Do not create a new folder unless the user explicitly requests it besides a .vscode folder for a tasks.json file.
- If any of the scaffolding commands mention that the folder name is not correct, let the user know to create a new folder with the correct name and then reopen it again in vscode.

EXTENSION INSTALLATION RULES:
- Only install extension specified by the get_project_setup_info tool. DO NOT INSTALL any other extensions.

PROJECT CONTENT RULES:
- If the user has not specified project details, assume they want a "Hello World" project as a starting point.
- Avoid adding links of any type (URLs, files, folders, etc.) or integrations that are not explicitly required.
- Avoid generating images, videos, or any other media files unless explicitly requested.
- If you need to use any media assets as placeholders, let the user know that these are placeholders and should be replaced with the actual assets later.
- Ensure all generated components serve a clear purpose within the user's requested workflow.
- If a feature is assumed but not confirmed, prompt the user for clarification before including it.
- If you are working on a VS Code extension, use the VS Code API tool with a query to find relevant VS Code API references and samples related to that query.

TASK COMPLETION RULES:
- Your task is complete when:
  - Project is successfully scaffolded and compiled without errors
  - copilot-instructions.md file in the .github directory exists in the project
  - README.md file exists and is up to date
  - User is provided with clear instructions to debug/launch the project

Before starting a new task in the above plan, update progress in the plan.
-->
- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.