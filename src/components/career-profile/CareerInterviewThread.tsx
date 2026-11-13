import { Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/useAuth';
import { CareerProposalCard } from '@/components/career-profile/CareerProposalCard';
import type {
  CareerConfirmationDecision,
  CareerMessageResponse,
  CareerProposalResponse,
} from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CareerInterviewThreadProps {
  messages: CareerMessageResponse[];
  pendingProposal: CareerProposalResponse | null;
  isConfirming: boolean;
  onConfirm: (
    proposalId: string,
    decision: CareerConfirmationDecision,
    editedFacts?: Record<string, string>,
  ) => void;
}

export function CareerInterviewThread({
  messages,
  pendingProposal,
  isConfirming,
  onConfirm,
}: CareerInterviewThreadProps) {
  const { t } = useLanguage();
  const { user } = useAuth();

  const sorted = [...messages].sort((a, b) => a.sequence - b.sequence);
  const proposalMessageIndex = sorted.findIndex((message) => message.responseType === 'PROPOSAL');
  const showCardAtEnd = pendingProposal !== null && proposalMessageIndex === -1;

  if (sorted.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <p className="max-w-md text-center text-sm text-muted-foreground">
          {t('careerInterview.emptyThread')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sorted.map((message, index) => {
        const isUser = message.role === 'USER';
        const showProposalCard =
          pendingProposal !== null && index === proposalMessageIndex;
        return (
          <div key={message.messageId} className="space-y-3">
            <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
              {isUser ? (
                <Avatar>
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.username?.charAt(0).toUpperCase() || 'Y'}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar>
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div className={`min-w-0 flex-1 ${isUser ? 'text-right' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {isUser ? t('careerInterview.youLabel') : t('careerInterview.agentLabel')}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div
                  className={`mt-1 inline-block max-w-full whitespace-pre-line rounded-lg px-3 py-2 text-left text-sm ${
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </div>
            {showProposalCard && pendingProposal ? (
              <CareerProposalCard
                proposal={pendingProposal}
                isConfirming={isConfirming}
                onConfirm={onConfirm}
              />
            ) : null}
          </div>
        );
      })}
      {showCardAtEnd && pendingProposal ? (
        <CareerProposalCard
          proposal={pendingProposal}
          isConfirming={isConfirming}
          onConfirm={onConfirm}
        />
      ) : null}
    </div>
  );
}
