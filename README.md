# Resume Feedback Frontend

Frontend SPA para upload, versionamento, partilha e revisão colaborativa de currículos, com feedback gerado por IA e autenticação JWT/Google.

O projeto consome uma API externa para autenticação, gestão de utilizadores, ficheiros, comentários, links públicos e análise assíncrona por IA.

## Visão Geral

O produto cobre estes fluxos principais:

- autenticação com email/password
- login e registo com Google Identity Services
- upload de currículo e envio de novas versões
- preview e download de ficheiros
- criação e revogação de links de partilha
- comentários por versão
- feedback de IA com polling de jobs assíncronos
- gestão básica de perfil

## Stack

- React 18
- TypeScript
- Vite 5
- React Router 6
- Redux Toolkit
- React Redux
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- React Hook Form
- Zod
- react-pdf

## Arquitetura

A aplicação está organizada em camadas simples:

- `src/pages`: screens ligadas às rotas
- `src/components`: componentes reutilizáveis e blocos de UI
- `src/features`: hooks e lógica por feature
- `src/store`: store Redux, typed hooks e slices
- `src/services`: client HTTP e serviços por domínio
- `src/contexts`: compatibilidade e providers globais
- `src/types`: contratos TypeScript partilhados

Hoje o state management segue este modelo:

- estado global e fluxos assíncronos críticos em Redux
- estado efémero e estritamente visual continua local ao componente
- acesso à API centralizado em `src/services`

Slices atuais:

- `authSlice`
- `uploadSlice`
- `resumeDetailsSlice`
- `aiFeedbackSlice`

Feature hooks atuais:

- `src/features/upload/useUploadPage.ts`
- `src/features/resume-details/useResumeDetailsPage.ts`
- `src/features/ai/useAiFeedback.ts`

## Rotas

Públicas:

- `/`
- `/about`
- `/auth`
- `/share/:token`

Protegidas:

- `/my-resumes`
- `/upload`
- `/resume/:id`
- `/profile`

## Variáveis de Ambiente

Criar `.env` na raiz:

```bash
VITE_API_URL=https://your-api-host.com
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

Notas:

- `VITE_API_URL` pode ser informado com ou sem `/api`; o cliente normaliza a base internamente
- `VITE_GOOGLE_CLIENT_ID` é necessário para renderizar e usar o login com Google

## Setup

Pré-requisitos:

- Node.js 18+
- npm 9+ ou Bun

Instalação:

```bash
npm install
```

Desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
```

Preview local:

```bash
npm run preview
```

Lint:

```bash
npm run lint
```

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## Integração com API

O frontend usa uma camada pequena e explícita em `src/services`.

Pontos importantes:

- `api-config.ts` normaliza a base URL
- `api-client.ts` injeta o token JWT a partir de `localStorage`
- requests sem `FormData` são enviados como JSON
- erros da API são convertidos para um formato consistente no frontend
- endpoints de preview/download usam URLs diretas porque podem responder com `302`

Base padrão atualmente configurada:

```text
https://resumefeedback-api.hmpedro.com
```

## Autenticação

O modelo atual é simples e pragmático:

- o access token JWT é persistido em `localStorage`
- o utilizador é reconstruído a partir do payload do token
- o bootstrap de auth passa pelo store Redux
- `useAuth()` continua disponível como interface de compatibilidade para o resto da app
- páginas protegidas usam `ProtectedRoute`

Fluxos suportados:

- registo com email/password
- login com email/password
- login/registo com Google
- reativação de conta via endpoint backend

## Features Principais

### Resume Management

- upload de currículo inicial
- envio de novas versões para um currículo existente
- histórico de versões
- preview autenticado do ficheiro atual ou da versão selecionada

### Sharing and Collaboration

- criação de links com permissão, expiração e limite de uso
- revogação de links existentes
- comentários associados à versão em preview

### AI Feedback

- leitura do último job de IA por versão
- polling automático enquanto o job está `PENDING` ou `PROCESSING`
- carregamento do feedback quando o job termina com sucesso
- regeneração manual de feedback

## Estrutura Atual Relevante

- store principal em `src/store/index.ts`
- typed hooks Redux em `src/store/hooks.ts`
- auth em `src/store/slices/authSlice.ts`
- upload em `src/store/slices/uploadSlice.ts`
- resume details em `src/store/slices/resumeDetailsSlice.ts`
- ai feedback em `src/store/slices/aiFeedbackSlice.ts`
- orquestração de upload em `src/features/upload/useUploadPage.ts`
- orquestração de detalhes do currículo em `src/features/resume-details/useResumeDetailsPage.ts`
- orquestração de polling de IA em `src/features/ai/useAiFeedback.ts`

## Estado do Projeto

Estado atual validado:

- dependências Redux instaladas
- build de produção a passar com `npm run build`
- arquitetura parcialmente migrada para Redux nas features mais state-heavy

Observações técnicas:

- ainda não existe suite de testes automatizada no `package.json`
- o token continua em `localStorage`, o que é funcional mas não é o modelo mais robusto para cenários com requisitos de segurança mais fortes
- ainda há ficheiros grandes no projeto, especialmente `Profile.tsx`, `SharedResume.tsx` e alguns componentes reutilizáveis
- o bundle de produção ainda emite warning de chunk grande; isso sugere code-splitting/manual chunks como próximo passo
- o repositório mantém `package-lock.json` e `bun.lockb`; convém padronizar o package manager da equipa

## Próximos Passos Recomendados

- continuar a refatoração dos ficheiros mais extensos para hooks/feature modules menores
- introduzir testes unitários para services, slices e hooks críticos
- adicionar testes de integração para auth, upload e resume details
- criar `.env.example`
- adicionar CI para lint e build
- avaliar code-splitting para reduzir o tamanho do bundle inicial

## Nota

Existe documentação de handoff backend em `docs/frontend-handoff.local.md`, útil para integração local e troubleshooting dos endpoints.
