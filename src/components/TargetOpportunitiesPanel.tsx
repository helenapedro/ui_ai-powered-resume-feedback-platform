import { useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { format } from 'date-fns';
import { BriefcaseBusiness, Loader2, Pencil, Plus, Target, Trash2, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  useCreateTargetOpportunityMutation,
  useCreateTargetedComparisonJobMutation,
  useCreateTargetedReviewJobMutation,
  useDeleteTargetOpportunityMutation,
  useLatestTargetedReviewJobQuery,
  useLatestTargetedReviewQuery,
  useLatestTargetedComparisonJobQuery,
  useLatestTargetedComparisonQuery,
  useTargetedVersionLinksQuery,
  useTargetOpportunitiesQuery,
  useUpdateTargetOpportunityMutation,
} from '@/features/target-opportunities/queries';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type {
  ResumeVersion,
  TargetOpportunity,
  TargetOpportunityType,
  TargetedComparisonDTO,
  TargetedVersionLink,
  TargetedReviewDTO,
  TargetedReviewJobStatus,
} from '@/types';

interface TargetOpportunitiesPanelProps {
  currentVersionId: string | null;
  resumeId: string;
  versions: ResumeVersion[];
}

const OPPORTUNITY_TYPES: TargetOpportunityType[] = [
  'JOB',
  'PUBLIC_EXAM',
  'SCHOLARSHIP',
  'INTERNSHIP',
  'PROMOTION',
  'CAREER_CHANGE',
  'OTHER',
];

const TYPE_LABELS: Record<TargetOpportunityType, string> = {
  JOB: 'Job',
  PUBLIC_EXAM: 'Public exam',
  SCHOLARSHIP: 'Scholarship',
  INTERNSHIP: 'Internship',
  PROMOTION: 'Promotion',
  CAREER_CHANGE: 'Career change',
  OTHER: 'Other',
};

const STATUS_LABELS: Record<TargetedReviewJobStatus, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  DONE: 'Done',
  FAILED: 'Failed',
};

const TARGET_LIMITS = {
  organization: 160,
  roleTitle: 160,
  descriptionMin: 80,
  descriptionMax: 8000,
  requirementsMaxItems: 30,
  requirementMax: 500,
  notes: 3000,
};

interface TargetFormValues {
  description: string;
  requirementsText: string;
}

function validateTargetText(value: string, minLength: number, minWords: number, minUniqueWords: number, minDistinctChars: number) {
  const normalized = value.trim().toLowerCase();
  const compact = normalized.replace(/[^\p{L}\p{N}]/gu, '');
  const words = normalized.match(/[\p{L}\p{N}][\p{L}\p{N}+#./-]*/gu) ?? [];
  const uniqueWords = new Set(words.filter((word) => word.length > 1)).size;
  const distinctChars = new Set(compact.split('')).size;
  const placeholders = ['test', 'teste', 'testing', 'asdf', 'qwerty', 'lorem ipsum', 'n/a', 'none', 'null', 'bbb', 'bbbb'];

  return (
    normalized.length >= minLength &&
    compact.length > 0 &&
    !/^([\p{L}\p{N}])\1{2,}$/u.test(compact) &&
    !placeholders.some((placeholder) => normalized === placeholder || normalized.includes(` ${placeholder} `)) &&
    words.length >= minWords &&
    uniqueWords >= minUniqueWords &&
    distinctChars >= minDistinctChars &&
    uniqueWords > Math.max(1, words.length / 4)
  );
}

function splitRequirements(requirementsText: string) {
  return requirementsText
    .split(/\r?\n/)
    .map((requirement) => requirement.trim())
    .filter(Boolean);
}

function validateTargetForm(values: TargetFormValues) {
  const errors: string[] = [];
  const requirements = splitRequirements(values.requirementsText);

  if (!validateTargetText(values.description, TARGET_LIMITS.descriptionMin, 12, 8, 10)) {
    errors.push('Description needs at least 80 characters with specific, varied opportunity context.');
  }

  if (requirements.length > TARGET_LIMITS.requirementsMaxItems) {
    errors.push('Requirements can include at most 30 items.');
  }

  const weakRequirement = requirements.find((requirement) =>
    !validateTargetText(requirement, 10, 3, 3, 5)
  );
  if (weakRequirement) {
    errors.push('Each requirement should be specific enough to compare against the resume.');
  }

  if (requirements.some((requirement) => requirement.length > TARGET_LIMITS.requirementMax)) {
    errors.push('Each requirement must be 500 characters or fewer.');
  }

  return { errors, requirements, isValid: errors.length === 0 };
}

export function TargetOpportunitiesPanel({ currentVersionId, resumeId, versions }: TargetOpportunitiesPanelProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<TargetOpportunity | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [sourceResumeVersionId, setSourceResumeVersionId] = useState(currentVersionId ?? '');
  const [opportunityType, setOpportunityType] = useState<TargetOpportunityType>('JOB');
  const [organization, setOrganization] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirementsText, setRequirementsText] = useState('');
  const [notes, setNotes] = useState('');
  const opportunitiesQuery = useTargetOpportunitiesQuery(resumeId);
  const targetedVersionLinksQuery = useTargetedVersionLinksQuery(resumeId);
  const createMutation = useCreateTargetOpportunityMutation(resumeId);
  const updateMutation = useUpdateTargetOpportunityMutation(resumeId);
  const deleteMutation = useDeleteTargetOpportunityMutation(resumeId);

  const copy = language === 'pt'
    ? {
        title: 'Oportunidades',
        newTarget: 'Novo alvo',
        empty: 'Nenhuma oportunidade-alvo cadastrada.',
        createTitle: 'Adaptar para oportunidade',
        editTitle: 'Editar alvo',
        createDescription: 'Capture a vaga, edital ou contexto para orientar uma versao direcionada.',
        editDescription: 'Ajuste este alvo antes de iniciar a analise direcionada.',
        sourceVersion: 'Versao base',
        opportunityType: 'Tipo',
        organization: 'Organizacao',
        roleTitle: 'Cargo/titulo',
        description: 'Descricao',
        requirements: 'Requisitos',
        notes: 'Notas',
        cancel: 'Cancelar',
        save: 'Salvar',
        created: 'Oportunidade criada',
        updated: 'Oportunidade atualizada',
        deleted: 'Oportunidade apagada',
        createError: 'Nao foi possivel criar a oportunidade.',
        updateError: 'Nao foi possivel atualizar a oportunidade.',
        deleteError: 'Nao foi possivel apagar a oportunidade.',
        loading: 'Carregando oportunidades...',
        invalidTarget: 'Revise os detalhes do alvo antes de continuar.',
      }
    : {
        title: 'Targets',
        newTarget: 'New target',
        empty: 'No target opportunities yet.',
        createTitle: 'Adapt for opportunity',
        editTitle: 'Edit target',
        createDescription: 'Capture the vacancy, notice, or context that should guide a targeted version.',
        editDescription: 'Adjust this target before starting the targeted review.',
        sourceVersion: 'Source version',
        opportunityType: 'Type',
        organization: 'Organization',
        roleTitle: 'Role/title',
        description: 'Description',
        requirements: 'Requirements',
        notes: 'Notes',
        cancel: 'Cancel',
        save: 'Save',
        created: 'Target opportunity created',
        updated: 'Target opportunity updated',
        deleted: 'Target opportunity deleted',
        createError: 'Unable to create target opportunity.',
        updateError: 'Unable to update target opportunity.',
        deleteError: 'Unable to delete target opportunity.',
        loading: 'Loading target opportunities...',
        invalidTarget: 'Review the target details before continuing.',
      };

  const versionOptions = useMemo(
    () => [...versions].sort((a, b) => b.versionNumber - a.versionNumber),
    [versions]
  );

  function resetForm() {
    setSourceResumeVersionId(currentVersionId ?? '');
    setOpportunityType('JOB');
    setOrganization('');
    setRoleTitle('');
    setDescription('');
    setRequirementsText('');
    setNotes('');
    setEditingOpportunity(null);
    setFormErrors([]);
  }

  function openCreateDialog() {
    resetForm();
    setOpen(true);
  }

  function openEditDialog(opportunity: TargetOpportunity) {
    setEditingOpportunity(opportunity);
    setSourceResumeVersionId(opportunity.sourceResumeVersionId ?? currentVersionId ?? '');
    setOpportunityType(opportunity.opportunityType);
    setOrganization(opportunity.organization ?? '');
    setRoleTitle(opportunity.roleTitle ?? '');
    setDescription(opportunity.description);
    setRequirementsText(opportunity.requirements.join('\n'));
    setNotes(opportunity.notes ?? '');
    setFormErrors([]);
    setOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateTargetForm({ description, requirementsText });
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    const request = {
      sourceResumeVersionId: sourceResumeVersionId || null,
      opportunityType,
      organization: organization || null,
      roleTitle: roleTitle || null,
      description,
      requirements: validation.requirements,
      notes: notes || null,
    };

    try {
      if (editingOpportunity) {
        await updateMutation.mutateAsync({ opportunityId: editingOpportunity.id, request });
        toast({ title: copy.updated });
      } else {
        await createMutation.mutateAsync(request);
        toast({ title: copy.created });
      }
      resetForm();
      setOpen(false);
    } catch {
      toast({
        variant: 'destructive',
        title: editingOpportunity ? copy.updateError : copy.createError,
      });
    }
  }

  async function handleDelete(opportunityId: string) {
    try {
      await deleteMutation.mutateAsync(opportunityId);
      toast({ title: copy.deleted });
    } catch {
      toast({
        variant: 'destructive',
        title: copy.deleteError,
      });
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              {copy.title}
            </CardTitle>
            <Button size="sm" onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              {copy.newTarget}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {opportunitiesQuery.isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {copy.loading}
            </div>
          )}

          {!opportunitiesQuery.isLoading && !opportunitiesQuery.data?.length && (
            <p className="text-sm text-muted-foreground">{copy.empty}</p>
          )}

          {opportunitiesQuery.data?.map((opportunity) => (
            <TargetOpportunityItem
              key={opportunity.id}
              opportunity={opportunity}
              resumeId={resumeId}
              versions={versions}
              links={(targetedVersionLinksQuery.data ?? []).filter(
                (link) => link.targetOpportunityId === opportunity.id
              )}
              onEdit={openEditDialog}
              onDelete={handleDelete}
              onUploadTargetedVersion={(opportunityId) =>
                navigate(`/upload?resumeId=${resumeId}&targetOpportunityId=${opportunityId}`)
              }
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          resetForm();
        }
      }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>{editingOpportunity ? copy.editTitle : copy.createTitle}</DialogTitle>
              <DialogDescription>{editingOpportunity ? copy.editDescription : copy.createDescription}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target-source-version">{copy.sourceVersion}</Label>
                <Select value={sourceResumeVersionId} onValueChange={setSourceResumeVersionId}>
                  <SelectTrigger id="target-source-version">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {versionOptions.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        v{version.versionNumber} - {version.originalFilename}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-type">{copy.opportunityType}</Label>
                <Select value={opportunityType} onValueChange={(value) => setOpportunityType(value as TargetOpportunityType)}>
                  <SelectTrigger id="target-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {OPPORTUNITY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target-organization">{copy.organization}</Label>
                <Input
                  id="target-organization"
                  value={organization}
                  onChange={(event) => setOrganization(event.target.value)}
                  maxLength={TARGET_LIMITS.organization}
                />
                <p className="text-xs text-muted-foreground">{organization.length}/{TARGET_LIMITS.organization}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target-role">{copy.roleTitle}</Label>
                <Input
                  id="target-role"
                  value={roleTitle}
                  onChange={(event) => setRoleTitle(event.target.value)}
                  maxLength={TARGET_LIMITS.roleTitle}
                />
                <p className="text-xs text-muted-foreground">{roleTitle.length}/{TARGET_LIMITS.roleTitle}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-description">{copy.description}</Label>
              <Textarea
                id="target-description"
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-[140px]"
                maxLength={TARGET_LIMITS.descriptionMax}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/{TARGET_LIMITS.descriptionMax} · min {TARGET_LIMITS.descriptionMin}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-requirements">{copy.requirements}</Label>
              <Textarea
                id="target-requirements"
                value={requirementsText}
                onChange={(event) => setRequirementsText(event.target.value)}
                className="min-h-[110px]"
                maxLength={TARGET_LIMITS.requirementsMaxItems * TARGET_LIMITS.requirementMax}
              />
              <p className="text-xs text-muted-foreground">
                {splitRequirements(requirementsText).length}/{TARGET_LIMITS.requirementsMaxItems} items · {TARGET_LIMITS.requirementMax} chars per item
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-notes">{copy.notes}</Label>
              <Textarea
                id="target-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                maxLength={TARGET_LIMITS.notes}
              />
              <p className="text-xs text-muted-foreground">{notes.length}/{TARGET_LIMITS.notes}</p>
            </div>

            {formErrors.length > 0 && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                <p className="font-medium">{copy.invalidTarget}</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {formErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {copy.cancel}
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {copy.save}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TargetOpportunityItem({
  opportunity,
  resumeId,
  versions,
  links,
  onEdit,
  onDelete,
  onUploadTargetedVersion,
  isDeleting,
}: {
  opportunity: TargetOpportunity;
  resumeId: string;
  versions: ResumeVersion[];
  links: TargetedVersionLink[];
  onEdit: (opportunity: TargetOpportunity) => void;
  onDelete: (opportunityId: string) => Promise<void>;
  onUploadTargetedVersion: (opportunityId: string) => void;
  isDeleting: boolean;
}) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const jobQuery = useLatestTargetedReviewJobQuery(resumeId, opportunity.id);
  const latestReviewQuery = useLatestTargetedReviewQuery(
    resumeId,
    opportunity.id,
    jobQuery.data?.status === 'DONE'
  );
  const createJobMutation = useCreateTargetedReviewJobMutation(resumeId, opportunity.id);
  const sourceVersion = versions.find((version) => version.id === opportunity.sourceResumeVersionId);
  const linkedVersions = links
    .map((link) => versions.find((version) => version.id === link.targetedResumeVersionId))
    .filter((version): version is ResumeVersion => Boolean(version));
  const job = jobQuery.data ?? null;
  const review = latestReviewQuery.data ?? null;
  const targetValidation = validateTargetForm({
    description: opportunity.description,
    requirementsText: opportunity.requirements.join('\n'),
  });
  const canEdit = !job || job.status === 'FAILED';
  const canDelete = true;
  const hasTerminalJob = Boolean(job && job.status !== 'FAILED');

  const copy = language === 'pt'
    ? {
        fitScore: 'Aderencia',
        matched: 'Requisitos cobertos',
        weak: 'Requisitos fracos',
        missing: 'Requisitos ausentes',
        changes: 'Mudancas recomendadas',
        positioning: 'Posicionamento',
        integrity: 'Alertas de integridade',
        started: 'Analise direcionada iniciada',
        startError: 'Nao foi possivel iniciar a analise direcionada',
        failed: 'Analise direcionada falhou.',
        queued: 'Analise direcionada na fila',
        start: 'Iniciar analise direcionada',
        retry: 'Tentar novamente',
        uploadTargetedVersion: 'Enviar versao direcionada',
        linkedVersions: 'Versoes direcionadas',
        compareVersion: 'Comparar com alvo',
        comparisonQueued: 'Comparacao na fila',
        comparisonStarted: 'Comparacao iniciada',
        comparisonError: 'Nao foi possivel iniciar a comparacao',
        alignmentScore: 'Aderencia da versao',
        addressed: 'Requisitos melhorados',
        remaining: 'Edicoes restantes',
        completeTarget: 'Completar detalhes do alvo',
        needsBetterTarget: 'Adicione uma descricao real e requisitos especificos antes de iniciar a IA.',
        edit: 'Editar alvo',
        delete: 'Apagar alvo',
        deleteTitle: 'Apagar alvo?',
        deleteDescription: 'Isto remove o alvo e qualquer historico de analise direcionada associado a ele.',
        cancel: 'Cancelar',
        noEvidence: 'Sem evidencia especifica.',
      }
    : {
        fitScore: 'Fit score',
        matched: 'Covered requirements',
        weak: 'Weak requirements',
        missing: 'Missing requirements',
        changes: 'Recommended changes',
        positioning: 'Positioning',
        integrity: 'Integrity warnings',
        started: 'Targeted review started',
        startError: 'Unable to start targeted review',
        failed: 'Targeted review failed.',
        queued: 'Targeted review queued',
        start: 'Start targeted review',
        retry: 'Retry targeted review',
        uploadTargetedVersion: 'Upload targeted version',
        linkedVersions: 'Targeted versions',
        compareVersion: 'Compare with target',
        comparisonQueued: 'Comparison queued',
        comparisonStarted: 'Comparison started',
        comparisonError: 'Unable to start comparison',
        alignmentScore: 'Version alignment',
        addressed: 'Improved requirements',
        remaining: 'Remaining edits',
        completeTarget: 'Complete target details',
        needsBetterTarget: 'Add a real description and specific requirements before starting AI.',
        edit: 'Edit target',
        delete: 'Delete target',
        deleteTitle: 'Delete target?',
        deleteDescription: 'This removes the target and any targeted review history attached to it.',
        cancel: 'Cancel',
        noEvidence: 'No specific evidence.',
      };

  async function handleStartReview() {
    try {
      await createJobMutation.mutateAsync();
      toast({ title: copy.started });
    } catch {
      toast({
        variant: 'destructive',
        title: copy.startError,
      });
    }
  }

  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {opportunity.roleTitle || opportunity.organization || TYPE_LABELS[opportunity.opportunityType]}
          </p>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {opportunity.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {canEdit || canDelete ? (
            <>
              {canEdit && (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  aria-label={copy.edit}
                  title={copy.edit}
                  onClick={() => onEdit(opportunity)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
              {canDelete && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      aria-label={copy.delete}
                      title={copy.delete}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{copy.deleteTitle}</AlertDialogTitle>
                      <AlertDialogDescription>{copy.deleteDescription}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{copy.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={() => void onDelete(opportunity.id)} disabled={isDeleting}>
                        {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {copy.delete}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </>
          ) : (
            <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {review && <TargetedReviewSummary review={review} labels={copy} />}

      {linkedVersions.length > 0 && (
        <div className="mt-3 rounded-md border bg-muted/30 p-2">
          <p className="text-xs font-semibold uppercase text-muted-foreground">{copy.linkedVersions}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {linkedVersions.map((version) => (
              <LinkedTargetedVersion
                key={version.id}
                labels={copy}
                opportunityId={opportunity.id}
                resumeId={resumeId}
                version={version}
              />
            ))}
          </div>
        </div>
      )}

      {!targetValidation.isValid && (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
          {copy.needsBetterTarget}
        </p>
      )}

      {job?.status === 'FAILED' && (
        <p className="mt-3 text-sm text-destructive">
          {job.errorDetail || copy.failed}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{TYPE_LABELS[opportunity.opportunityType]}</Badge>
        {sourceVersion && <Badge variant="outline">v{sourceVersion.versionNumber}</Badge>}
        {job && <Badge variant={job.status === 'FAILED' ? 'destructive' : 'outline'}>{STATUS_LABELS[job.status]}</Badge>}
        <span className="text-xs text-muted-foreground">
          {format(new Date(opportunity.createdAt), 'MMM dd, yyyy')}
        </span>
      </div>

      <Button
        className="mt-3 w-full"
        size="sm"
        variant={hasTerminalJob ? 'outline' : 'default'}
        onClick={handleStartReview}
        disabled={createJobMutation.isPending || hasTerminalJob || !targetValidation.isValid}
      >
        {createJobMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {hasTerminalJob ? copy.queued : targetValidation.isValid ? (job?.status === 'FAILED' ? copy.retry : copy.start) : copy.completeTarget}
      </Button>
      <Button
        className="mt-2 w-full"
        size="sm"
        variant="outline"
        onClick={() => onUploadTargetedVersion(opportunity.id)}
      >
        <Upload className="mr-2 h-4 w-4" />
        {copy.uploadTargetedVersion}
      </Button>
    </div>
  );
}

function LinkedTargetedVersion({
  labels,
  opportunityId,
  resumeId,
  version,
}: {
  labels: {
    compareVersion: string;
    comparisonQueued: string;
    comparisonStarted: string;
    comparisonError: string;
    alignmentScore: string;
    addressed: string;
    remaining: string;
  };
  opportunityId: string;
  resumeId: string;
  version: ResumeVersion;
}) {
  const { toast } = useToast();
  const jobQuery = useLatestTargetedComparisonJobQuery(resumeId, opportunityId, version.id);
  const comparisonQuery = useLatestTargetedComparisonQuery(
    resumeId,
    opportunityId,
    version.id,
    jobQuery.data?.status === 'DONE'
  );
  const createMutation = useCreateTargetedComparisonJobMutation(resumeId, opportunityId, version.id);
  const job = jobQuery.data ?? null;
  const comparison = comparisonQuery.data ?? null;
  const hasTerminalJob = Boolean(job && job.status !== 'FAILED');

  async function handleCompare() {
    try {
      await createMutation.mutateAsync();
      toast({ title: labels.comparisonStarted });
    } catch {
      toast({ variant: 'destructive', title: labels.comparisonError });
    }
  }

  return (
    <div className="w-full rounded-md border bg-background p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge variant="outline">v{version.versionNumber}</Badge>
        {job && <Badge variant={job.status === 'FAILED' ? 'destructive' : 'secondary'}>{STATUS_LABELS[job.status]}</Badge>}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={handleCompare}
          disabled={createMutation.isPending || hasTerminalJob}
        >
          {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {hasTerminalJob ? labels.comparisonQueued : labels.compareVersion}
        </Button>
      </div>
      {job?.status === 'FAILED' && (
        <p className="mt-2 text-xs text-destructive">{job.errorDetail}</p>
      )}
      {comparison && <TargetedComparisonSummary comparison={comparison} labels={labels} />}
    </div>
  );
}

function TargetedComparisonSummary({
  comparison,
  labels,
}: {
  comparison: TargetedComparisonDTO;
  labels: {
    alignmentScore: string;
    addressed: string;
    remaining: string;
  };
}) {
  return (
    <div className="mt-2 space-y-2 border-t pt-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium">{labels.alignmentScore}</p>
        <Badge>{comparison.alignmentScore ?? 'N/A'}</Badge>
      </div>
      <p className="text-xs text-muted-foreground">{comparison.summary}</p>
      <TargetedReviewSection title={labels.addressed} items={comparison.addressedRequirements.map((item) => (
        <span>
          <span className="font-medium">{item.requirement}</span>
          <span className="text-muted-foreground"> - {item.evidence.join('; ')}</span>
        </span>
      ))} />
      <TargetedReviewSection title={labels.remaining} items={comparison.remainingChanges.map((item) => (
        <span>
          <span className="font-medium">{item.section}</span>
          <span className="text-muted-foreground"> - {item.change}</span>
        </span>
      ))} />
    </div>
  );
}

function TargetedReviewSummary({
  review,
  labels,
}: {
  review: TargetedReviewDTO;
  labels: {
    fitScore: string;
    matched: string;
    weak: string;
    missing: string;
    changes: string;
    positioning: string;
    integrity: string;
    noEvidence: string;
  };
}) {
  return (
    <div className="mt-3 space-y-3 rounded-md border bg-muted/40 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">{labels.fitScore}</p>
        <Badge>{review.fitScore ?? 'N/A'}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{review.summary}</p>

      <TargetedReviewSection title={labels.matched} items={review.matchedRequirements.map((item) => (
        <span>
          <span className="font-medium">{item.requirement}</span>
          <span className="text-muted-foreground"> - {item.evidence.length ? item.evidence.join('; ') : labels.noEvidence}</span>
        </span>
      ))} />

      <TargetedReviewSection title={labels.weak} items={review.weakRequirements.map((item) => (
        <span>
          <span className="font-medium">{item.requirement}</span>
          <span className="text-muted-foreground"> - {item.recommendedFix || item.currentEvidence || labels.noEvidence}</span>
        </span>
      ))} />

      <TargetedReviewSection title={labels.missing} items={review.missingRequirements.map((item) => (
        <span>
          <span className="font-medium">{item.requirement}</span>
          <span className="text-muted-foreground"> - {item.candidateAction}</span>
        </span>
      ))} />

      <TargetedReviewSection title={labels.changes} items={review.recommendedChanges.map((item) => (
        <span>
          <span className="font-medium">{item.section}</span>
          <span className="text-muted-foreground"> - {item.change}</span>
        </span>
      ))} />

      <TargetedReviewSection title={labels.positioning} items={review.positioningAdvice} />
      <TargetedReviewSection title={labels.integrity} items={review.integrityWarnings} />
    </div>
  );
}

function TargetedReviewSection({ title, items }: { title: string; items: ReactNode[] }) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <ul className="space-y-1 text-sm">
        {items.slice(0, 3).map((item, index) => (
          <li key={index} className="leading-snug">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
