import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAddResumeVersionMutation, useCreateResumeMutation } from '@/features/resumes/queries';
import {
  resetUploadState,
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
  const resumeId = searchParams.get('resumeId');
  const isAddingVersion = !!resumeId;
  const createResumeMutation = useCreateResumeMutation();
  const addVersionMutation = useAddResumeVersionMutation(resumeId);
  const [file, setFile] = useState<File | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { title, isUploading, progress, isDragging } = useAppSelector(
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
      setFile(null);
      dispatch(resetUploadState());
    };
  }, [clearProgressInterval, dispatch]);

  const validateAndSetFile = useCallback(
    (nextFile: File) => {
      if (!ACCEPTED_TYPES.includes(nextFile.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Only PDF, JPEG, and PNG files are supported.',
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
          await addVersionMutation.mutateAsync(file);
          toast({
            title: 'New version added',
            description: 'The new version was added successfully.',
          });
          navigate(`/resume/${resumeId}`);
        } else {
          const resume = await createResumeMutation.mutateAsync({ file, title: title || undefined });
          toast({
            title: 'Resume created',
            description: 'Your resume was uploaded successfully.',
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
          title: 'Unable to upload resume',
          description: error instanceof Error ? error.message : 'Please try again.',
        });
      } finally {
        dispatch(setIsUploading(false));
      }
    },
    [
      addVersionMutation,
      clearProgressInterval,
      createResumeMutation,
      dispatch,
      file,
      isAddingVersion,
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
    setTitle: (value: string) => dispatch(setTitle(value)),
    clearFile: () => setFile(null),
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleFileChange,
    handleSubmit,
  };
}
