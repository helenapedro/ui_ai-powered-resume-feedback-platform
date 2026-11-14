import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type AppLanguage = 'en' | 'pt';

export type TranslationKey =
  | 'app.name'
  | 'nav.profile'
  | 'nav.careerProfile'
  | 'nav.signOut'
  | 'nav.signIn'
  | 'nav.about'
  | 'nav.menuTitle'
  | 'nav.menuDescription'
  | 'language.switchLabel'
  | 'language.english'
  | 'language.portuguese'
  | 'feedback.cardTitle'
  | 'feedback.cardDescription'
  | 'feedback.noAnalysisEyebrow'
  | 'feedback.noAnalysisTitle'
  | 'feedback.noAnalysisDescription'
  | 'feedback.generate'
  | 'feedback.regenerate'
  | 'feedback.legacy'
  | 'feedback.failedEyebrow'
  | 'feedback.failedTitle'
  | 'feedback.unsupportedDocumentTitle'
  | 'feedback.unsupportedDocumentDescription'
  | 'feedback.unreadableDocumentDescription'
  | 'feedback.tryAgain'
  | 'feedback.interruptedEyebrow'
  | 'feedback.interruptedTitle'
  | 'feedback.reload'
  | 'feedback.pendingEyebrow'
  | 'feedback.pendingTitle'
  | 'feedback.pendingDescription'
  | 'feedback.emptyEyebrow'
  | 'feedback.emptyTitle'
  | 'feedback.emptyDescription'
  | 'feedback.timeout'
  | 'feedback.failedDefault'
  | 'feedback.loadError'
  | 'feedback.regenerateError'
  | 'feedback.progressUnavailable'
  | 'feedback.summaryFallback'
  | 'feedback.forVersion'
  | 'feedback.overallAssessment'
  | 'feedback.strengthSignals'
  | 'feedback.gapsToClose'
  | 'feedback.aiFeedback'
  | 'feedback.strengthDescription'
  | 'feedback.gapsDescription'
  | 'feedback.noStrengths'
  | 'feedback.noGaps'
  | 'feedback.processingEyebrow'
  | 'feedback.processingTitle'
  | 'feedback.processingDescription'
  | 'feedback.buildingFeedback'
  | 'feedback.usuallyFinishes'
  | 'feedback.statusQueued'
  | 'feedback.statusAnalyzing'
  | 'feedback.statusReady'
  | 'feedback.statusRetry'
  | 'feedback.statusUnsupported'
  | 'progress.titleFallback'
  | 'progress.startsAfterSecond'
  | 'progress.buildingTitle'
  | 'progress.buildingDescription'
  | 'progress.pending'
  | 'progress.unavailable'
  | 'progress.changedTitle'
  | 'progress.status'
  | 'progress.score'
  | 'progress.notScored'
  | 'progress.whatImproved'
  | 'progress.whatImprovedDescription'
  | 'progress.noImprovements'
  | 'progress.stillNeedsWork'
  | 'progress.stillNeedsWorkDescription'
  | 'progress.noUnchanged'
  | 'progress.newIssues'
  | 'progress.newIssuesDescription'
  | 'progress.noNewIssues'
  | 'progress.statusUpdated'
  | 'progress.statusNoMajorChange'
  | 'progress.statusNeedsReview'
  | 'progress.statusUnknown'
  | 'upload.addNewVersion'
  | 'upload.uploadResume'
  | 'upload.addVersionDescription'
  | 'upload.uploadDescription'
  | 'upload.titleOptional'
  | 'upload.titlePlaceholder'
  | 'upload.dropResume'
  | 'upload.browse'
  | 'upload.selectFile'
  | 'upload.pdfLimit'
  | 'upload.uploadingResume'
  | 'upload.uploading'
  | 'upload.addVersion'
  | 'resumes.loadErrorTitle'
  | 'resumes.loadErrorDescription'
  | 'resumes.workflowBadge'
  | 'resumes.title'
  | 'resumes.description'
  | 'resumes.searchPlaceholder'
  | 'resumes.newResume'
  | 'resumes.totalWorkflows'
  | 'resumes.activeWorkflows'
  | 'resumes.newestWorkflow'
  | 'resumes.noneYet'
  | 'resumes.emptyTitle'
  | 'resumes.emptyDescription'
  | 'resumes.emptyAction'
  | 'resumes.noResultsTitle'
  | 'resumes.noResultsDescription'
  | 'resumes.pinned'
  | 'resumes.pinnedDescription'
  | 'resumes.searchResults'
  | 'resumes.allWorkflows'
  | 'resumes.recentWorkflows'
  | 'resumes.sortedDescription'
  | 'details.back'
  | 'details.untitled'
  | 'details.active'
  | 'details.versions'
  | 'details.previewing'
  | 'details.activeVersion'
  | 'details.createShareLink'
  | 'details.addVersion'
  | 'details.delete'
  | 'details.deleteResumeTitle'
  | 'details.deleteResumeDescription'
  | 'details.cancel'
  | 'preview.title'
  | 'preview.version'
  | 'preview.current'
  | 'preview.downloadVersion'
  | 'preview.loading'
  | 'preview.unable'
  | 'preview.selectVersion'
  | 'history.title'
  | 'history.empty'
  | 'history.jump'
  | 'history.currentSuffix'
  | 'history.older'
  | 'history.preview'
  | 'history.download'
  | 'careerProfile.title'
  | 'careerProfile.description'
  | 'careerProfile.emptyTitle'
  | 'careerProfile.emptyDescription'
  | 'careerProfile.startInterview'
  | 'careerProfile.loadErrorTitle'
  | 'careerProfile.loadErrorDescription'
  | 'careerProfile.present'
  | 'careerProfile.untitledExperience'
  | 'careerInterview.title'
  | 'careerInterview.description'
  | 'careerInterview.emptyThread'
  | 'careerInterview.sendPlaceholder'
  | 'careerInterview.send'
  | 'careerInterview.sending'
  | 'careerInterview.retry'
  | 'careerInterview.startErrorTitle'
  | 'careerInterview.startErrorDescription'
  | 'careerInterview.agentUnavailableTitle'
  | 'careerInterview.agentUnavailableDescription'
  | 'careerInterview.versionConflictTitle'
  | 'careerInterview.versionConflictDescription'
  | 'careerInterview.sessionErrorTitle'
  | 'careerInterview.sessionErrorDescription'
  | 'careerInterview.sessionExpiredTitle'
  | 'careerInterview.sessionExpiredDescription'
  | 'careerInterview.cancel'
  | 'careerInterview.cancelTitle'
  | 'careerInterview.cancelDescription'
  | 'careerInterview.cancelConfirm'
  | 'careerInterview.keepGoing'
  | 'careerInterview.proposalTitle'
  | 'careerInterview.proposalDescription'
  | 'careerInterview.accept'
  | 'careerInterview.edit'
  | 'careerInterview.reject'
  | 'careerInterview.saveEdited'
  | 'careerInterview.confirming'
  | 'careerInterview.editHint'
  | 'careerInterview.factNotProvided'
  | 'careerInterview.fieldEmployer'
  | 'careerInterview.fieldJobTitle'
  | 'careerInterview.fieldStartDate'
  | 'careerInterview.fieldEndDate'
  | 'careerInterview.fieldResponsibilities'
  | 'careerInterview.learnedTitle'
  | 'careerInterview.learnedEmpty'
  | 'careerInterview.confirmedTitle'
  | 'careerInterview.confirmedEmpty'
  | 'careerInterview.progressConfirmed'
  | 'careerInterview.statusNotStarted'
  | 'careerInterview.statusInProgress'
  | 'careerInterview.statusAwaitingConfirmation'
  | 'careerInterview.statusCompleted'
  | 'careerInterview.statusCancelled'
  | 'careerInterview.completedNotice'
  | 'careerInterview.cancelledNotice'
  | 'careerInterview.viewProfile'
  | 'careerInterview.backToProfile'
  | 'careerInterview.viewProfilePanel'
  | 'careerInterview.profilePanelTitle'
  | 'careerInterview.agentLabel'
  | 'careerInterview.youLabel';

const translations: Record<AppLanguage, Record<TranslationKey, string>> = {
  en: {
    'app.name': 'Resume Feedback',
    'nav.profile': 'Profile',
    'nav.careerProfile': 'Career Profile',
    'nav.signOut': 'Sign out',
    'nav.signIn': 'Sign in',
    'nav.about': 'About',
    'nav.menuTitle': 'Navigation menu',
    'nav.menuDescription': 'Primary navigation links and account actions.',
    'language.switchLabel': 'Language',
    'language.english': 'English',
    'language.portuguese': 'Portuguese',
    'feedback.cardTitle': 'AI Review',
    'feedback.cardDescription': 'Review for the selected resume version, including version-to-version progress when available.',
    'feedback.noAnalysisEyebrow': 'No analysis yet',
    'feedback.noAnalysisTitle': 'Generate a recruiter-style review',
    'feedback.noAnalysisDescription': 'Create an executive summary, highlight what already works, and surface the highest-leverage gaps.',
    'feedback.generate': 'Generate Feedback',
    'feedback.regenerate': 'Regenerate',
    'feedback.legacy': 'This review uses an older feedback format. Regenerate to get the latest review.',
    'feedback.failedEyebrow': 'Review Failed',
    'feedback.failedTitle': 'The feedback run did not complete',
    'feedback.unsupportedDocumentTitle': 'This file is not a resume',
    'feedback.unsupportedDocumentDescription': 'This PDF looks like a book, article, or long document, so AI feedback was not generated. Please upload a resume/CV PDF instead.',
    'feedback.unreadableDocumentDescription': 'We could not read enough text from this PDF to generate feedback. Please upload a text-based resume/CV PDF.',
    'feedback.tryAgain': 'Try Again',
    'feedback.interruptedEyebrow': 'Review Interrupted',
    'feedback.interruptedTitle': 'The latest feedback could not be loaded',
    'feedback.reload': 'Reload Review',
    'feedback.pendingEyebrow': 'AI Review Pending',
    'feedback.pendingTitle': 'AI review is still being generated',
    'feedback.pendingDescription': 'The job has completed, but the latest review document is not available yet. Try refreshing in a moment.',
    'feedback.emptyEyebrow': 'No Feedback',
    'feedback.emptyTitle': 'The review completed without displayable content',
    'feedback.emptyDescription': 'Regenerate the analysis to request a fresh recruiter-style pass on this version.',
    'feedback.timeout': 'The AI review timed out. Try regenerating the review.',
    'feedback.failedDefault': 'The AI review failed.',
    'feedback.loadError': 'Unable to load AI feedback.',
    'feedback.regenerateError': 'Unable to regenerate AI feedback.',
    'feedback.progressUnavailable': 'Progress comparison is not available right now.',
    'feedback.summaryFallback': 'No AI summary is available for this version.',
    'feedback.forVersion': 'Feedback for v{version}',
    'feedback.overallAssessment': 'Overall Assessment',
    'feedback.strengthSignals': 'Strength Signals',
    'feedback.gapsToClose': 'Gaps to Close',
    'feedback.aiFeedback': 'AI Feedback',
    'feedback.strengthDescription': 'These are the parts already helping the current version read clearly and credibly.',
    'feedback.gapsDescription': 'Treat these as the highest-leverage changes for the current version.',
    'feedback.noStrengths': 'No strength signals were returned.',
    'feedback.noGaps': 'No gaps were returned.',
    'feedback.processingEyebrow': 'In Progress',
    'feedback.processingTitle': 'Reviewing this resume like a recruiter would',
    'feedback.processingDescription': 'The model is evaluating positioning, evidence quality, skills coverage, and whether the resume reads at the level it is aiming for.',
    'feedback.buildingFeedback': 'Building feedback',
    'feedback.usuallyFinishes': 'Usually finishes in a few seconds.',
    'feedback.statusQueued': 'Queued',
    'feedback.statusAnalyzing': 'Analyzing',
    'feedback.statusReady': 'Ready',
    'feedback.statusRetry': 'Needs retry',
    'feedback.statusUnsupported': 'Unsupported file',
    'progress.titleFallback': 'Progress Since Previous Version',
    'progress.startsAfterSecond': 'Progress comparison starts after you upload a second version.',
    'progress.buildingTitle': 'Building version-to-version comparison',
    'progress.buildingDescription': 'The AI review is still processing. Progress insights will appear once this version finishes analysis.',
    'progress.pending': 'Pending',
    'progress.unavailable': 'Progress comparison is not available yet for this version.',
    'progress.changedTitle': 'How this version changed compared with the previous resume',
    'progress.status': 'Status',
    'progress.score': 'Score',
    'progress.notScored': 'Not scored',
    'progress.whatImproved': 'What improved',
    'progress.whatImprovedDescription': 'Signals that got stronger in this version.',
    'progress.noImprovements': 'No improvements detected for this comparison.',
    'progress.stillNeedsWork': 'Still needs work',
    'progress.stillNeedsWorkDescription': 'Issues that remain unresolved from the previous version.',
    'progress.noUnchanged': 'No items in this category for the current comparison.',
    'progress.newIssues': 'New issues',
    'progress.newIssuesDescription': 'Problems introduced or made more visible in this version.',
    'progress.noNewIssues': 'No items in this category for the current comparison.',
    'progress.statusUpdated': 'Updated',
    'progress.statusNoMajorChange': 'No major change',
    'progress.statusNeedsReview': 'Needs review',
    'progress.statusUnknown': 'Unknown',
    'upload.addNewVersion': 'Add New Version',
    'upload.uploadResume': 'Upload Resume',
    'upload.addVersionDescription': 'Add a new version to an existing resume',
    'upload.uploadDescription': 'Upload your resume and receive AI feedback in minutes',
    'upload.titleOptional': 'Title (optional)',
    'upload.titlePlaceholder': 'Example: Backend Developer Resume',
    'upload.dropResume': 'Drag and drop your resume here',
    'upload.browse': 'or click to browse',
    'upload.selectFile': 'Select File',
    'upload.pdfLimit': 'PDF | Max 10MB',
    'upload.uploadingResume': 'Uploading resume...',
    'upload.uploading': 'Uploading...',
    'upload.addVersion': 'Add Version',
    'resumes.loadErrorTitle': 'Unable to load resumes',
    'resumes.loadErrorDescription': 'Please try again.',
    'resumes.workflowBadge': 'Resume workflows',
    'resumes.title': 'My Resume Workflow',
    'resumes.description': 'Reopen active drafts, add new versions, and keep important review workflows pinned for quick access.',
    'resumes.searchPlaceholder': 'Search workflows',
    'resumes.newResume': 'New Resume',
    'resumes.totalWorkflows': 'Total workflows',
    'resumes.activeWorkflows': 'Active workflows',
    'resumes.newestWorkflow': 'Newest workflow',
    'resumes.noneYet': 'None yet',
    'resumes.emptyTitle': 'You do not have any resume workflows yet',
    'resumes.emptyDescription': 'Upload your first resume to start a version-aware feedback workflow.',
    'resumes.emptyAction': 'Upload Resume',
    'resumes.noResultsTitle': 'No resume workflows found',
    'resumes.noResultsDescription': 'Try searching with a different title.',
    'resumes.pinned': 'Pinned',
    'resumes.pinnedDescription': 'High-priority workflows stay at the top of your dashboard.',
    'resumes.searchResults': 'Search Results',
    'resumes.allWorkflows': 'All Workflows',
    'resumes.recentWorkflows': 'Recent Workflows',
    'resumes.sortedDescription': 'Sorted by pinned status first, then newest created date.',
    'details.back': 'Back to workflows',
    'details.untitled': 'Untitled resume',
    'details.active': 'active',
    'details.versions': 'versions',
    'details.previewing': 'Previewing',
    'details.activeVersion': 'active version',
    'details.createShareLink': 'Create Share Link',
    'details.addVersion': 'Add Version',
    'details.delete': 'Delete',
    'details.deleteResumeTitle': 'Delete resume?',
    'details.deleteResumeDescription': 'This action cannot be undone. All versions will be removed.',
    'details.cancel': 'Cancel',
    'preview.title': 'Resume Preview',
    'preview.version': 'Version',
    'preview.current': 'Current',
    'preview.downloadVersion': 'Download Version',
    'preview.loading': 'Loading PDF preview...',
    'preview.unable': 'Unable to load the PDF.',
    'preview.selectVersion': 'Select a version to preview its resume file.',
    'history.title': 'Version History',
    'history.empty': 'No versions available.',
    'history.jump': 'Jump to version',
    'history.currentSuffix': 'Current',
    'history.older': 'Older versions',
    'history.preview': 'Preview',
    'history.download': 'Download',
    'careerProfile.title': 'Career Profile',
    'careerProfile.description': 'Work history confirmed through the career interview.',
    'careerProfile.emptyTitle': 'No confirmed experience yet',
    'careerProfile.emptyDescription': 'Complete a career interview to add confirmed work experience to your profile.',
    'careerProfile.startInterview': 'Start interview',
    'careerProfile.loadErrorTitle': 'Unable to load career profile',
    'careerProfile.loadErrorDescription': 'Please try again.',
    'careerProfile.present': 'Present',
    'careerProfile.untitledExperience': 'Untitled experience',
    'careerInterview.title': 'Career Interview',
    'careerInterview.description':
      'Answer a few questions about your work history. Confirm each proposal before it joins your profile.',
    'careerInterview.emptyThread':
      'Start by telling the agent about your most recent job.',
    'careerInterview.sendPlaceholder': 'Describe your work experience...',
    'careerInterview.send': 'Send',
    'careerInterview.sending': 'Sending...',
    'careerInterview.retry': 'Retry',
    'careerInterview.startErrorTitle': 'Unable to start the interview',
    'careerInterview.startErrorDescription': 'Please try again.',
    'careerInterview.agentUnavailableTitle': 'The career agent is unavailable',
    'careerInterview.agentUnavailableDescription':
      'Your message was kept. Try again in a moment.',
    'careerInterview.versionConflictTitle': 'The interview was updated',
    'careerInterview.versionConflictDescription':
      'Showing the latest state. Review it and continue.',
    'careerInterview.sessionErrorTitle': 'Something went wrong',
    'careerInterview.sessionErrorDescription': 'Please try again.',
    'careerInterview.sessionExpiredTitle': 'Session expired',
    'careerInterview.sessionExpiredDescription': 'Please log in again to continue the interview.',
    'careerInterview.cancel': 'Cancel interview',
    'careerInterview.cancelTitle': 'Cancel this interview?',
    'careerInterview.cancelDescription':
      'Your confirmed experience stays on your profile. The unfinished conversation is discarded.',
    'careerInterview.cancelConfirm': 'Yes, cancel',
    'careerInterview.keepGoing': 'Keep going',
    'careerInterview.proposalTitle': 'Review this proposal',
    'careerInterview.proposalDescription':
      'Confirm the details before they join your profile.',
    'careerInterview.accept': 'Accept',
    'careerInterview.edit': 'Edit',
    'careerInterview.reject': 'Reject',
    'careerInterview.saveEdited': 'Save changes',
    'careerInterview.confirming': 'Saving...',
    'careerInterview.editHint': 'All five fields are required.',
    'careerInterview.factNotProvided': 'Not provided',
    'careerInterview.fieldEmployer': 'Employer',
    'careerInterview.fieldJobTitle': 'Job title',
    'careerInterview.fieldStartDate': 'Start date',
    'careerInterview.fieldEndDate': 'End date',
    'careerInterview.fieldResponsibilities': 'Responsibilities',
    'careerInterview.learnedTitle': 'What we learned so far',
    'careerInterview.learnedEmpty': 'Nothing learned yet. Answer the first question to begin.',
    'careerInterview.confirmedTitle': 'Confirmed experience',
    'careerInterview.confirmedEmpty': 'No confirmed experience yet.',
    'careerInterview.progressConfirmed': '{count} confirmed',
    'careerInterview.statusNotStarted': 'Not started',
    'careerInterview.statusInProgress': 'In progress',
    'careerInterview.statusAwaitingConfirmation': 'Awaiting confirmation',
    'careerInterview.statusCompleted': 'Completed',
    'careerInterview.statusCancelled': 'Cancelled',
    'careerInterview.completedNotice': 'This interview is complete.',
    'careerInterview.cancelledNotice': 'This interview was cancelled.',
    'careerInterview.viewProfile': 'View profile',
    'careerInterview.backToProfile': 'Back to career profile',
    'careerInterview.viewProfilePanel': 'View profile so far',
    'careerInterview.profilePanelTitle': 'Your profile so far',
    'careerInterview.agentLabel': 'Career Agent',
    'careerInterview.youLabel': 'You',
  },
  pt: {
    'app.name': 'Resume Feedback',
    'nav.profile': 'Perfil',
    'nav.careerProfile': 'Perfil de Carreira',
    'nav.signOut': 'Sair',
    'nav.signIn': 'Entrar',
    'nav.about': 'Sobre',
    'nav.menuTitle': 'Menu de navegacao',
    'nav.menuDescription': 'Links principais e acoes da conta.',
    'language.switchLabel': 'Idioma',
    'language.english': 'Ingles',
    'language.portuguese': 'Portugues',
    'feedback.cardTitle': 'Revisao da IA',
    'feedback.cardDescription': 'Revisao da versao selecionada do CV, incluindo progresso entre versoes quando disponivel.',
    'feedback.noAnalysisEyebrow': 'Sem analise ainda',
    'feedback.noAnalysisTitle': 'Gerar uma revisao estilo recruiter',
    'feedback.noAnalysisDescription': 'Crie um resumo executivo, destaque o que ja funciona e mostre as lacunas de maior impacto.',
    'feedback.generate': 'Gerar Feedback',
    'feedback.regenerate': 'Gerar novamente',
    'feedback.legacy': 'Esta revisao usa um formato antigo. Gere novamente para receber a versao mais recente.',
    'feedback.failedEyebrow': 'Revisao falhou',
    'feedback.failedTitle': 'A execucao do feedback nao terminou',
    'feedback.unsupportedDocumentTitle': 'Este ficheiro nao e um CV',
    'feedback.unsupportedDocumentDescription': 'Este PDF parece ser um livro, artigo ou documento longo, por isso o feedback da IA nao foi gerado. Carregue um CV em PDF.',
    'feedback.unreadableDocumentDescription': 'Nao foi possivel ler texto suficiente deste PDF para gerar feedback. Carregue um CV em PDF com texto selecionavel.',
    'feedback.tryAgain': 'Tentar novamente',
    'feedback.interruptedEyebrow': 'Revisao interrompida',
    'feedback.interruptedTitle': 'Nao foi possivel carregar o feedback mais recente',
    'feedback.reload': 'Recarregar revisao',
    'feedback.pendingEyebrow': 'Revisao da IA pendente',
    'feedback.pendingTitle': 'A revisao da IA ainda esta a ser gerada',
    'feedback.pendingDescription': 'O job terminou, mas o documento de revisao mais recente ainda nao esta disponivel. Tente atualizar em instantes.',
    'feedback.emptyEyebrow': 'Sem feedback',
    'feedback.emptyTitle': 'A revisao terminou sem conteudo visivel',
    'feedback.emptyDescription': 'Gere a analise novamente para pedir uma nova revisao desta versao.',
    'feedback.timeout': 'A revisao da IA demorou demasiado. Tente gerar novamente.',
    'feedback.failedDefault': 'A revisao da IA falhou.',
    'feedback.loadError': 'Nao foi possivel carregar o feedback da IA.',
    'feedback.regenerateError': 'Nao foi possivel gerar o feedback novamente.',
    'feedback.progressUnavailable': 'A comparacao de progresso nao esta disponivel neste momento.',
    'feedback.summaryFallback': 'Nao ha resumo da IA disponivel para esta versao.',
    'feedback.forVersion': 'Feedback para v{version}',
    'feedback.overallAssessment': 'Avaliacao geral',
    'feedback.strengthSignals': 'Pontos fortes',
    'feedback.gapsToClose': 'Lacunas a fechar',
    'feedback.aiFeedback': 'Feedback da IA',
    'feedback.strengthDescription': 'Estas partes ja ajudam a versao atual a parecer clara e credivel.',
    'feedback.gapsDescription': 'Trate estes pontos como as mudancas de maior impacto para a versao atual.',
    'feedback.noStrengths': 'Nenhum ponto forte foi retornado.',
    'feedback.noGaps': 'Nenhuma lacuna foi retornada.',
    'feedback.processingEyebrow': 'Em progresso',
    'feedback.processingTitle': 'A rever este CV como um recruiter',
    'feedback.processingDescription': 'O modelo esta a avaliar posicionamento, qualidade das evidencias, cobertura de skills e se o CV esta no nivel pretendido.',
    'feedback.buildingFeedback': 'A gerar feedback',
    'feedback.usuallyFinishes': 'Normalmente termina em poucos segundos.',
    'feedback.statusQueued': 'Na fila',
    'feedback.statusAnalyzing': 'A analisar',
    'feedback.statusReady': 'Pronto',
    'feedback.statusRetry': 'Precisa repetir',
    'feedback.statusUnsupported': 'Ficheiro nao suportado',
    'progress.titleFallback': 'Progresso desde a versao anterior',
    'progress.startsAfterSecond': 'A comparacao de progresso comeca depois de carregar uma segunda versao.',
    'progress.buildingTitle': 'A criar comparacao entre versoes',
    'progress.buildingDescription': 'A revisao da IA ainda esta em processamento. Os insights de progresso aparecem quando esta versao terminar.',
    'progress.pending': 'Pendente',
    'progress.unavailable': 'A comparacao de progresso ainda nao esta disponivel para esta versao.',
    'progress.changedTitle': 'Como esta versao mudou em relacao ao CV anterior',
    'progress.status': 'Estado',
    'progress.score': 'Pontuacao',
    'progress.notScored': 'Sem pontuacao',
    'progress.whatImproved': 'O que melhorou',
    'progress.whatImprovedDescription': 'Sinais que ficaram mais fortes nesta versao.',
    'progress.noImprovements': 'Nenhuma melhoria detectada nesta comparacao.',
    'progress.stillNeedsWork': 'Ainda precisa melhorar',
    'progress.stillNeedsWorkDescription': 'Problemas que continuam por resolver desde a versao anterior.',
    'progress.noUnchanged': 'Nenhum item nesta categoria para a comparacao atual.',
    'progress.newIssues': 'Novos problemas',
    'progress.newIssuesDescription': 'Problemas introduzidos ou mais visiveis nesta versao.',
    'progress.noNewIssues': 'Nenhum item nesta categoria para a comparacao atual.',
    'progress.statusUpdated': 'Atualizado',
    'progress.statusNoMajorChange': 'Sem grande mudanca',
    'progress.statusNeedsReview': 'Precisa de revisao',
    'progress.statusUnknown': 'Desconhecido',
    'upload.addNewVersion': 'Adicionar nova versao',
    'upload.uploadResume': 'Carregar CV',
    'upload.addVersionDescription': 'Adicione uma nova versao a um CV existente',
    'upload.uploadDescription': 'Carregue o seu CV e receba feedback da IA em minutos',
    'upload.titleOptional': 'Titulo (opcional)',
    'upload.titlePlaceholder': 'Exemplo: CV de Backend Developer',
    'upload.dropResume': 'Arraste e solte o seu CV aqui',
    'upload.browse': 'ou clique para procurar',
    'upload.selectFile': 'Selecionar ficheiro',
    'upload.pdfLimit': 'PDF | Max 10MB',
    'upload.uploadingResume': 'A carregar CV...',
    'upload.uploading': 'A carregar...',
    'upload.addVersion': 'Adicionar versao',
    'resumes.loadErrorTitle': 'Nao foi possivel carregar os CVs',
    'resumes.loadErrorDescription': 'Tente novamente.',
    'resumes.workflowBadge': 'Fluxos de CV',
    'resumes.title': 'Meu fluxo de CV',
    'resumes.description': 'Reabra drafts ativos, adicione novas versoes e fixe fluxos importantes para acesso rapido.',
    'resumes.searchPlaceholder': 'Pesquisar fluxos',
    'resumes.newResume': 'Novo CV',
    'resumes.totalWorkflows': 'Total de fluxos',
    'resumes.activeWorkflows': 'Fluxos ativos',
    'resumes.newestWorkflow': 'Fluxo mais recente',
    'resumes.noneYet': 'Ainda nenhum',
    'resumes.emptyTitle': 'Ainda nao tem nenhum fluxo de CV',
    'resumes.emptyDescription': 'Carregue o seu primeiro CV para iniciar um fluxo de feedback com versoes.',
    'resumes.emptyAction': 'Carregar CV',
    'resumes.noResultsTitle': 'Nenhum fluxo encontrado',
    'resumes.noResultsDescription': 'Tente pesquisar com outro titulo.',
    'resumes.pinned': 'Fixados',
    'resumes.pinnedDescription': 'Fluxos de alta prioridade ficam no topo do dashboard.',
    'resumes.searchResults': 'Resultados da pesquisa',
    'resumes.allWorkflows': 'Todos os fluxos',
    'resumes.recentWorkflows': 'Fluxos recentes',
    'resumes.sortedDescription': 'Ordenado primeiro por fixados e depois pela data mais recente.',
    'details.back': 'Voltar aos fluxos',
    'details.untitled': 'CV sem titulo',
    'details.active': 'ativo',
    'details.versions': 'versoes',
    'details.previewing': 'A visualizar',
    'details.activeVersion': 'versao ativa',
    'details.createShareLink': 'Criar link de partilha',
    'details.addVersion': 'Adicionar versao',
    'details.delete': 'Eliminar',
    'details.deleteResumeTitle': 'Eliminar CV?',
    'details.deleteResumeDescription': 'Esta acao nao pode ser desfeita. Todas as versoes serao removidas.',
    'details.cancel': 'Cancelar',
    'preview.title': 'Pre-visualizacao do CV',
    'preview.version': 'Versao',
    'preview.current': 'Atual',
    'preview.downloadVersion': 'Descarregar versao',
    'preview.loading': 'A carregar pre-visualizacao do PDF...',
    'preview.unable': 'Nao foi possivel carregar o PDF.',
    'preview.selectVersion': 'Selecione uma versao para pre-visualizar o ficheiro do CV.',
    'history.title': 'Historico de versoes',
    'history.empty': 'Nenhuma versao disponivel.',
    'history.jump': 'Ir para versao',
    'history.currentSuffix': 'Atual',
    'history.older': 'Versoes antigas',
    'history.preview': 'Pre-visualizar',
    'history.download': 'Descarregar',
    'careerProfile.title': 'Perfil de Carreira',
    'careerProfile.description': 'Historico profissional confirmado atraves da entrevista de carreira.',
    'careerProfile.emptyTitle': 'Ainda nao ha experiencia confirmada',
    'careerProfile.emptyDescription': 'Completa uma entrevista de carreira para adicionar experiencia profissional confirmada ao teu perfil.',
    'careerProfile.startInterview': 'Comecar entrevista',
    'careerProfile.loadErrorTitle': 'Nao foi possivel carregar o perfil de carreira',
    'careerProfile.loadErrorDescription': 'Tenta novamente.',
    'careerProfile.present': 'Atual',
    'careerProfile.untitledExperience': 'Experiencia sem titulo',
    'careerInterview.title': 'Entrevista de Carreira',
    'careerInterview.description':
      'Responde a algumas perguntas sobre o teu historico profissional. Confirma cada proposta antes de entrar no teu perfil.',
    'careerInterview.emptyThread':
      'Comeca por contar ao agente sobre o teu emprego mais recente.',
    'careerInterview.sendPlaceholder': 'Descreve a tua experiencia profissional...',
    'careerInterview.send': 'Enviar',
    'careerInterview.sending': 'A enviar...',
    'careerInterview.retry': 'Tentar novamente',
    'careerInterview.startErrorTitle': 'Nao foi possivel iniciar a entrevista',
    'careerInterview.startErrorDescription': 'Tenta novamente.',
    'careerInterview.agentUnavailableTitle': 'O agente de carreira esta indisponivel',
    'careerInterview.agentUnavailableDescription':
      'A tua mensagem foi guardada. Tenta novamente daqui a pouco.',
    'careerInterview.versionConflictTitle': 'A entrevista foi atualizada',
    'careerInterview.versionConflictDescription':
      'A mostrar o estado mais recente. Reve e continua.',
    'careerInterview.sessionErrorTitle': 'Algo correu mal',
    'careerInterview.sessionErrorDescription': 'Tenta novamente.',
    'careerInterview.sessionExpiredTitle': 'Sessao expirada',
    'careerInterview.sessionExpiredDescription':
      'Inicia sessao novamente para continuar a entrevista.',
    'careerInterview.cancel': 'Cancelar entrevista',
    'careerInterview.cancelTitle': 'Cancelar esta entrevista?',
    'careerInterview.cancelDescription':
      'A tua experiencia confirmada fica no teu perfil. A conversa por terminar e descartada.',
    'careerInterview.cancelConfirm': 'Sim, cancelar',
    'careerInterview.keepGoing': 'Continuar',
    'careerInterview.proposalTitle': 'Reve esta proposta',
    'careerInterview.proposalDescription':
      'Confirma os detalhes antes de entrarem no teu perfil.',
    'careerInterview.accept': 'Aceitar',
    'careerInterview.edit': 'Editar',
    'careerInterview.reject': 'Rejeitar',
    'careerInterview.saveEdited': 'Guardar alteracoes',
    'careerInterview.confirming': 'A guardar...',
    'careerInterview.editHint': 'Os cinco campos sao obrigatorios.',
    'careerInterview.factNotProvided': 'Nao indicado',
    'careerInterview.fieldEmployer': 'Empregador',
    'careerInterview.fieldJobTitle': 'Cargo',
    'careerInterview.fieldStartDate': 'Data de inicio',
    'careerInterview.fieldEndDate': 'Data de fim',
    'careerInterview.fieldResponsibilities': 'Responsabilidades',
    'careerInterview.learnedTitle': 'O que aprendemos ate agora',
    'careerInterview.learnedEmpty':
      'Ainda nao aprendemos nada. Responde a primeira pergunta para comecar.',
    'careerInterview.confirmedTitle': 'Experiencia confirmada',
    'careerInterview.confirmedEmpty': 'Ainda nao ha experiencia confirmada.',
    'careerInterview.progressConfirmed': '{count} confirmadas',
    'careerInterview.statusNotStarted': 'Nao iniciada',
    'careerInterview.statusInProgress': 'Em curso',
    'careerInterview.statusAwaitingConfirmation': 'A espera de confirmacao',
    'careerInterview.statusCompleted': 'Concluida',
    'careerInterview.statusCancelled': 'Cancelada',
    'careerInterview.completedNotice': 'Esta entrevista esta concluida.',
    'careerInterview.cancelledNotice': 'Esta entrevista foi cancelada.',
    'careerInterview.viewProfile': 'Ver perfil',
    'careerInterview.backToProfile': 'Voltar ao perfil de carreira',
    'careerInterview.viewProfilePanel': 'Ver o perfil ate agora',
    'careerInterview.profilePanelTitle': 'O seu perfil ate agora',
    'careerInterview.agentLabel': 'Agente de Carreira',
    'careerInterview.youLabel': 'Tu',
  },
};

interface LanguageContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const stored = window.localStorage.getItem('resume-feedback-language');
    return stored === 'pt' ? 'pt' : 'en';
  });

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem('resume-feedback-language', nextLanguage);
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: Record<string, string | number>) => {
      let value = translations[language][key] ?? translations.en[key] ?? key;
      if (values) {
        Object.entries(values).forEach(([name, replacement]) => {
          value = value.replaceAll(`{${name}}`, String(replacement));
        });
      }
      return value;
    },
    [language],
  );

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
