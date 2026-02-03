
# Plano de Alinhamento Frontend com APIs Backend

## Resumo Executivo

Este plano detalha as alterações necessárias para alinhar completamente o frontend com o documento de integração do backend. A maioria das funcionalidades básicas já está implementada corretamente, mas faltam algumas funcionalidades avançadas, principalmente relacionadas com AI Feedback e campos adicionais nos comentários.

---

## 1. Criar Serviço de AI Feedback

Criar um novo serviço para integrar com os endpoints de AI.

### Ficheiro: `src/services/ai.ts`

```typescript
import { apiClient } from './api';
import type { AiJobDTO, AiFeedbackDTO } from '@/types';

export const aiService = {
  // Get latest AI job for a version
  async getLatestJob(resumeId: string, versionId: string): Promise<AiJobDTO> {
    return apiClient.get<AiJobDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-jobs/latest`);
  },

  // Regenerate AI feedback
  async regenerate(resumeId: string, versionId: string): Promise<AiJobDTO> {
    return apiClient.post<AiJobDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-jobs/regenerate`);
  },

  // Get AI feedback for a version
  async getFeedback(resumeId: string, versionId: string): Promise<AiFeedbackDTO> {
    return apiClient.get<AiFeedbackDTO>(`/resumes/${resumeId}/versions/${versionId}/ai-feedback`);
  },
};
```

---

## 2. Adicionar Tipos de AI

### Ficheiro: `src/types/index.ts`

Adicionar as seguintes interfaces:

```typescript
// AI Job Status
export type AiJobStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

// AI Job DTO
export interface AiJobDTO {
  id: string;
  resumeVersionId: string;
  status: AiJobStatus;
  attemptCount: number;
  createdAt: string;
  updatedAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  errorCode: string | null;
  errorDetail: string | null;
  nextRetryAt: string | null;
}

// AI Feedback DTO
export interface AiFeedbackDTO {
  resumeId: string;
  resumeVersionId: string;
  jobId: string;
  feedbackVersion: number;
  mongoDocId: string;
  model: string;
  promptVersion: string;
  createdAt: string;
  summary: string;
  strengths: string[];
  improvements: string[];
}
```

---

## 3. Atualizar Serviço de Comentários

### Ficheiro: `src/services/comments.ts`

Atualizar para suportar todos os campos do backend:

```typescript
export interface CreateCommentRequest {
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
  guestLabel?: string | null;
}

export const commentService = {
  // Get comments for a version (owner)
  async getComments(resumeId: string, versionId: string): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/resumes/${resumeId}/versions/${versionId}/comments`);
  },

  // Add comment (owner)
  async addComment(resumeId: string, versionId: string, request: CreateCommentRequest): Promise<Comment> {
    return apiClient.post<Comment>(`/resumes/${resumeId}/versions/${versionId}/comments`, request);
  },
};
```

---

## 4. Atualizar Serviço de Sharing

### Ficheiro: `src/services/sharing.ts`

Atualizar o request de criação de share link e comentários públicos:

```typescript
export interface CreateShareLinkRequest {
  permission: SharePermission;
  expiresAt?: string | null;  // Adicionar
  maxUses?: number | null;
}

export interface CreatePublicCommentRequest {
  body: string;
  anchorRef?: string | null;
  parentCommentId?: string | null;
  guestLabel?: string | null;  // Adicionar
}

// Atualizar método postSharedComment
async postSharedComment(token: string, request: CreatePublicCommentRequest): Promise<Comment> {
  return apiClient.post<Comment>(`/share/${token}/comments`, request);
}
```

---

## 5. Melhorar Tratamento de Erros

### Ficheiro: `src/services/api.ts`

Adicionar tratamento específico para códigos de erro do backend:

```typescript
export interface ApiErrorResponse {
  code: string;
  message: string;
  status: number;
  path: string;
  timestamp: string;
  traceId: string;
  details?: {
    fieldErrors?: Record<string, string>;
  };
}

// Na função request, melhorar o tratamento de erros:
if (!response.ok) {
  const error: ApiErrorResponse = await response.json().catch(() => ({ 
    code: 'UNKNOWN_ERROR',
    message: 'An error occurred',
    status: response.status,
    path: endpoint,
    timestamp: new Date().toISOString(),
    traceId: '',
  }));
  
  // Tratamento específico por código de status
  if (response.status === 410) {
    throw new ShareLinkGoneError(error.message);
  }
  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After');
    throw new RateLimitError(error.message, retryAfter);
  }
  
  throw new ApiError(error.code, error.message, error.status);
}
```

---

## 6. Atualizar ShareLinkModal

### Ficheiro: `src/components/ShareLinkModal.tsx`

Adicionar campo opcional de data de expiração:

```typescript
export interface ShareLinkFormData {
  permission: SharePermission;
  expiresAt?: string | null;
  maxUses?: number | null;
}

// Adicionar campo de data no formulário (opcional)
<Input
  type="datetime-local"
  value={expiresAt}
  onChange={(e) => setExpiresAt(e.target.value)}
  placeholder="Data de expiração (opcional)"
/>
```

---

## 7. Atualizar CommentList para Suportar guestLabel

### Ficheiro: `src/components/CommentList.tsx`

Adicionar campo para visitantes identificarem-se:

```typescript
// Adicionar estado para guestLabel
const [guestLabel, setGuestLabel] = useState('');

// No formulário de novo comentário (para visitantes):
{!user && (
  <Input
    placeholder="O seu nome (ex: Recruiter, HR)"
    value={guestLabel}
    onChange={(e) => setGuestLabel(e.target.value)}
    className="mb-2"
  />
)}

// Atualizar chamada para incluir guestLabel
await onAddComment(newComment, guestLabel || undefined);
```

---

## 8. Criar Página/Componente de AI Feedback (Futuro)

### Ficheiro: `src/components/AiFeedback.tsx`

Componente para mostrar o feedback de AI na página de detalhes do currículo:

- Polling do status do job até estar DONE
- Mostrar feedback com strengths e improvements
- Botão para regenerar feedback

---

## Ordem de Implementação

1. **Tipos** (`src/types/index.ts`) - Adicionar AiJobDTO, AiFeedbackDTO
2. **Serviço AI** (`src/services/ai.ts`) - Criar novo serviço
3. **Serviço Comentários** (`src/services/comments.ts`) - Atualizar com campos completos
4. **Serviço Sharing** (`src/services/sharing.ts`) - Adicionar expiresAt e guestLabel
5. **API Client** (`src/services/api.ts`) - Melhorar tratamento de erros
6. **ShareLinkModal** - Adicionar campo expiresAt
7. **CommentList** - Adicionar suporte para guestLabel
8. **AiFeedback** (opcional) - Criar componente para mostrar feedback de AI

---

## Detalhes Tecnicosicos

### Endpoints Faltantes

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/resumes/{id}/versions/{vId}/ai-jobs/latest` | GET | Obter job AI mais recente |
| `/resumes/{id}/versions/{vId}/ai-jobs/regenerate` | POST | Reprocessar feedback AI |
| `/resumes/{id}/versions/{vId}/ai-feedback` | GET | Obter feedback AI |

### Campos Faltantes nos Requests

| Request | Campo | Tipo |
|---------|-------|------|
| Create Share Link | `expiresAt` | `string \| null` |
| Create Comment (owner) | `anchorRef`, `parentCommentId` | `string \| null` |
| Create Comment (public) | `guestLabel`, `anchorRef`, `parentCommentId` | `string \| null` |

### Códigos de Erro a Tratar

| Código HTTP | Código API | Descrição |
|-------------|------------|-----------|
| 401 | UNAUTHENTICATED | JWT ausente/inválido |
| 403 | FORBIDDEN | Sem permissão |
| 404 | SHARE_LINK_NOT_FOUND | Token inválido |
| 410 | SHARE_LINK_GONE | Link expirado/revogado/exaurido |
| 429 | - | Rate limit (header Retry-After) |
