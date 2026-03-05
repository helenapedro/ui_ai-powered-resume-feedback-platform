import { useCallback, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resumeService } from '@/services/resumes';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetUploadState,
  setFile,
  setIsDragging,
  setIsUploading,
  setProgress,
  setTitle,
} from '@/store/slices/uploadSlice';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function useUploadPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeId = searchParams.get('resumeId');
  const isAddingVersion = !!resumeId;

  const { file, title, isUploading, progress, isDragging } = useAppSelector(
    (state) => state.upload
  );

  const clearProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearProgressInterval();
      dispatch(resetUploadState());
    };
  }, [clearProgressInterval, dispatch]);

  const validateAndSetFile = useCallback(
    (nextFile: File) => {
      if (!ACCEPTED_TYPES.includes(nextFile.type)) {
        toast({
          variant: 'destructive',
          title: 'Tipo de arquivo invalido',
          description: 'Apenas PDF, JPEG e PNG sao aceitos.',
        });
        return;
      }

      if (nextFile.size > MAX_FILE_SIZE) {
        toast({
          variant: 'destructive',
          title: 'Arquivo muito grande',
          description: 'O tamanho maximo e 10MB.',
        });
        return;
      }

      dispatch(setFile(nextFile));
    },
    [dispatch, toast]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      dispatch(setIsDragging(false));

      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        validateAndSetFile(droppedFile);
      }
    },
    [dispatch, validateAndSetFile]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      dispatch(setIsDragging(true));
    },
    [dispatch]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      dispatch(setIsDragging(false));
    },
    [dispatch]
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

      dispatch(setIsUploading(true));
      dispatch(setProgress(0));
      clearProgressInterval();

      let nextProgress = 0;
      progressIntervalRef.current = setInterval(() => {
        nextProgress = Math.min(nextProgress + 10, 90);
        dispatch(setProgress(nextProgress));
      }, 200);

      try {
        if (isAddingVersion && resumeId) {
          await resumeService.addVersion(resumeId, file);
          toast({
            title: 'Nova versao adicionada!',
            description: 'A versao foi adicionada com sucesso.',
          });
          navigate(`/resume/${resumeId}`);
        } else {
          const resume = await resumeService.createResume(file, title || undefined);
          toast({
            title: 'Curriculo criado!',
            description: 'Seu curriculo foi enviado com sucesso.',
          });
          navigate(`/resume/${resume.id}`);
        }

        clearProgressInterval();
        dispatch(setProgress(100));
        dispatch(resetUploadState());
      } catch (error) {
        clearProgressInterval();
        toast({
          variant: 'destructive',
          title: 'Erro ao enviar curriculo',
          description: error instanceof Error ? error.message : 'Tente novamente.',
        });
      } finally {
        dispatch(setIsUploading(false));
      }
    },
    [clearProgressInterval, dispatch, file, isAddingVersion, navigate, resumeId, title, toast]
  );

  return {
    file,
    title,
    isUploading,
    progress,
    isDragging,
    isAddingVersion,
    setTitle: (value: string) => dispatch(setTitle(value)),
    clearFile: () => dispatch(setFile(null)),
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileChange,
    handleSubmit,
  };
}
