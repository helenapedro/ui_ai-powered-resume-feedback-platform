import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAddResumeVersionMutation, useCreateResumeMutation } from '@/features/resumes/queries';
import { targetOpportunityService } from '@/services/target-opportunities';

const ACCEPTED_TYPES = ['application/pdf', 'application/x-pdf'];
const PDF_EXTENSION = '.pdf';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useUploadPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const resumeId = searchParams.get('resumeId');
  const targetOpportunityId = searchParams.get('targetOpportunityId');
  const isAddingVersion = !!resumeId;
  const isTargetedVersionUpload = Boolean(resumeId && targetOpportunityId);
  const createResumeMutation = useCreateResumeMutation();
  const addVersionMutation = useAddResumeVersionMutation(resumeId);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearProgressInterval();
      setFile(null);
      setTitle('');
      setIsUploading(false);
      setProgress(0);
      setIsDragging(false);
    };
  }, [clearProgressInterval]);

  const validateAndSetFile = useCallback(
    (nextFile: File) => {
      const hasPdfExtension = nextFile.name.toLowerCase().endsWith(PDF_EXTENSION);
      const hasAcceptedType = ACCEPTED_TYPES.includes(nextFile.type);

      if (!hasPdfExtension || (nextFile.type && !hasAcceptedType)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Only PDF files are supported.',
        });
        return;
      }

      if (nextFile.size > MAX_FILE_SIZE) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'The maximum file size is 10MB.',
        });
        return;
      }

      setFile(nextFile);
    },
    [toast]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);

      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        validateAndSetFile(droppedFile);
      }
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
    },
    []
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
    },
    []
  );

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (selectedFile) {
        validateAndSetFile(selectedFile);
      }
    },
    [validateAndSetFile]
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!file) {
        return;
      }

      setIsUploading(true);
      setProgress(0);
      clearProgressInterval();

      let nextProgress = 0;
      progressIntervalRef.current = setInterval(() => {
        nextProgress = Math.min(nextProgress + 10, 90);
        setProgress(nextProgress);
      }, 200);

      try {
        if (isAddingVersion && resumeId) {
          const version = await addVersionMutation.mutateAsync(file);
          if (targetOpportunityId) {
            await targetOpportunityService.linkTargetedVersion(resumeId, targetOpportunityId, version.id);
          }
          toast({
            title: targetOpportunityId ? 'Targeted version added' : 'New version added',
            description: targetOpportunityId
              ? 'The new version was linked to the target opportunity.'
              : 'The new version was added successfully.',
          });
          navigate(`/resume/${resumeId}?versionId=${version.id}`);
        } else {
          const resume = await createResumeMutation.mutateAsync({ file, title: title || undefined });
          toast({
            title: 'Resume created',
            description: 'Your resume was uploaded successfully.',
          });
          navigate(`/resume/${resume.id}`);
        }

        clearProgressInterval();
        setProgress(100);
        setTitle('');
        setFile(null);
        setIsDragging(false);
      } catch (error) {
        clearProgressInterval();
        toast({
          variant: 'destructive',
          title: 'Unable to upload resume',
          description: error instanceof Error ? error.message : 'Please try again.',
        });
      } finally {
        setIsUploading(false);
      }
    },
    [
      addVersionMutation,
      clearProgressInterval,
      createResumeMutation,
      file,
      isAddingVersion,
      targetOpportunityId,
      navigate,
      resumeId,
      title,
      toast,
    ]
  );

  return {
    file,
    title,
    isUploading,
    progress,
    isDragging,
    isAddingVersion,
    isTargetedVersionUpload,
    setTitle,
    clearFile: () => setFile(null),
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileChange,
    handleSubmit,
  };
}
