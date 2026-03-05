import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { aiService } from '@/services/ai';
import type { AiFeedbackDTO, AiJobDTO } from '@/types';
import type { RootState } from '@/store';

type AiFeedbackEntry = {
  job: AiJobDTO | null;
  feedback: AiFeedbackDTO | null;
  isLoading: boolean;
  isRegenerating: boolean;
  error: string | null;
};

type AiFeedbackState = {
  entries: Record<string, AiFeedbackEntry>;
};

const initialEntry = (): AiFeedbackEntry => ({
  job: null,
  feedback: null,
  isLoading: true,
  isRegenerating: false,
  error: null,
});

const initialState: AiFeedbackState = {
  entries: {},
};

const getKey = (resumeId: string, versionId: string) => `${resumeId}:${versionId}`;

export const fetchLatestAiJob = createAsyncThunk(
  'aiFeedback/fetchLatestJob',
  async ({ resumeId, versionId }: { resumeId: string; versionId: string }) => ({
    key: getKey(resumeId, versionId),
    job: await aiService.getLatestJob(resumeId, versionId),
  })
);

export const fetchAiFeedback = createAsyncThunk(
  'aiFeedback/fetchFeedback',
  async ({ resumeId, versionId }: { resumeId: string; versionId: string }) => ({
    key: getKey(resumeId, versionId),
    feedback: await aiService.getFeedback(resumeId, versionId),
  })
);

export const regenerateAiFeedback = createAsyncThunk(
  'aiFeedback/regenerate',
  async ({ resumeId, versionId }: { resumeId: string; versionId: string }) => ({
    key: getKey(resumeId, versionId),
    job: await aiService.regenerate(resumeId, versionId),
  })
);

const aiFeedbackSlice = createSlice({
  name: 'aiFeedback',
  initialState,
  reducers: {
    resetAiFeedbackEntry(state, action: { payload: { resumeId: string; versionId: string } }) {
      state.entries[getKey(action.payload.resumeId, action.payload.versionId)] = initialEntry();
    },
    setAiFeedbackError(
      state,
      action: { payload: { resumeId: string; versionId: string; error: string | null } }
    ) {
      const key = getKey(action.payload.resumeId, action.payload.versionId);
      const entry = state.entries[key] || initialEntry();
      entry.error = action.payload.error;
      state.entries[key] = entry;
    },
    setAiFeedbackLoading(
      state,
      action: { payload: { resumeId: string; versionId: string; isLoading: boolean } }
    ) {
      const key = getKey(action.payload.resumeId, action.payload.versionId);
      const entry = state.entries[key] || initialEntry();
      entry.isLoading = action.payload.isLoading;
      state.entries[key] = entry;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestAiJob.pending, (state, action) => {
        const { resumeId, versionId } = action.meta.arg;
        const key = getKey(resumeId, versionId);
        const entry = state.entries[key] || initialEntry();
        entry.isLoading = true;
        entry.error = null;
        state.entries[key] = entry;
      })
      .addCase(fetchLatestAiJob.fulfilled, (state, action) => {
        const entry = state.entries[action.payload.key] || initialEntry();
        entry.job = action.payload.job;
        entry.isLoading = false;
        entry.error = action.payload.job.status === 'FAILED'
          ? action.payload.job.errorDetail || 'A analise falhou.'
          : null;
        state.entries[action.payload.key] = entry;
      })
      .addCase(fetchLatestAiJob.rejected, (state, action) => {
        const { resumeId, versionId } = action.meta.arg;
        const key = getKey(resumeId, versionId);
        const entry = state.entries[key] || initialEntry();
        entry.isLoading = false;
        state.entries[key] = entry;
      })
      .addCase(fetchAiFeedback.fulfilled, (state, action) => {
        const entry = state.entries[action.payload.key] || initialEntry();
        entry.feedback = action.payload.feedback;
        entry.error = null;
        entry.isLoading = false;
        state.entries[action.payload.key] = entry;
      })
      .addCase(fetchAiFeedback.rejected, (state, action) => {
        const { resumeId, versionId } = action.meta.arg;
        const key = getKey(resumeId, versionId);
        const entry = state.entries[key] || initialEntry();
        entry.error = 'Nao foi possivel carregar o feedback.';
        entry.isLoading = false;
        state.entries[key] = entry;
      })
      .addCase(regenerateAiFeedback.pending, (state, action) => {
        const { resumeId, versionId } = action.meta.arg;
        const key = getKey(resumeId, versionId);
        const entry = state.entries[key] || initialEntry();
        entry.isRegenerating = true;
        entry.feedback = null;
        entry.error = null;
        state.entries[key] = entry;
      })
      .addCase(regenerateAiFeedback.fulfilled, (state, action) => {
        const entry = state.entries[action.payload.key] || initialEntry();
        entry.job = action.payload.job;
        entry.isRegenerating = false;
        entry.isLoading = false;
        state.entries[action.payload.key] = entry;
      })
      .addCase(regenerateAiFeedback.rejected, (state, action) => {
        const { resumeId, versionId } = action.meta.arg;
        const key = getKey(resumeId, versionId);
        const entry = state.entries[key] || initialEntry();
        entry.isRegenerating = false;
        entry.error = 'Nao foi possivel regenerar o feedback.';
        state.entries[key] = entry;
      });
  },
});

export const { resetAiFeedbackEntry, setAiFeedbackError, setAiFeedbackLoading } =
  aiFeedbackSlice.actions;

export const selectAiFeedbackEntry = (state: RootState, resumeId: string, versionId: string) =>
  state.aiFeedback.entries[getKey(resumeId, versionId)] || initialEntry();

export default aiFeedbackSlice.reducer;
