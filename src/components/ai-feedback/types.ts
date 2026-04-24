import type { ReactNode } from 'react';
import type { AiJobStatus } from '@/types';

export interface ParsedFeedbackItem {
  label: string | null;
  content: string;
}

export interface StatusPresentation {
  icon: ReactNode;
  label: string;
  color: string;
}

export interface FeedbackViewAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'outline';
  loading?: boolean;
}

export type FeedbackStatusMap = Record<AiJobStatus, StatusPresentation>;
