import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { resumeService } from '@/services/resumes';
import { sharingService, type CreateShareLinkRequest } from '@/services/sharing';
import { commentService } from '@/services/comments';
import type { Comment, ResumeSummary, ResumeVersion, SharedLink } from '@/types';

type ResumeDetailsState = {
  resume: ResumeSummary | null;
  versions: ResumeVersion[];
  sharedLinks: SharedLink[];
  comments: Comment[];
  isLoadingResume: boolean;
  isDeletingResume: boolean;
  isLoadingLinks: boolean;
  isLoadingComments: boolean;
  isCreatingLink: boolean;
  previewVersionId: string | null;
};

const initialState: ResumeDetailsState = {
  resume: null,
  versions: [],
  sharedLinks: [],
  comments: [],
  isLoadingResume: true,
  isDeletingResume: false,
  isLoadingLinks: false,
  isLoadingComments: false,
  isCreatingLink: false,
  previewVersionId: null,
};

export const fetchResumeDetails = createAsyncThunk(
  'resumeDetails/fetchResumeDetails',
  async (resumeId: string) => resumeService.getResumeById(resumeId)
);

export const fetchSharedLinks = createAsyncThunk(
  'resumeDetails/fetchSharedLinks',
  async (resumeId: string) => sharingService.getShareLinks(resumeId)
);

export const fetchComments = createAsyncThunk(
  'resumeDetails/fetchComments',
  async ({ resumeId, versionId }: { resumeId: string; versionId: string }) =>
    commentService.getComments(resumeId, versionId)
);

export const createShareLink = createAsyncThunk(
  'resumeDetails/createShareLink',
  async ({ resumeId, data }: { resumeId: string; data: CreateShareLinkRequest }) =>
    sharingService.createShareLink(resumeId, data)
);

export const revokeShareLink = createAsyncThunk(
  'resumeDetails/revokeShareLink',
  async ({ resumeId, linkId }: { resumeId: string; linkId: string }) => {
    await sharingService.revokeShareLink(resumeId, linkId);
    return linkId;
  }
);

export const addComment = createAsyncThunk(
  'resumeDetails/addComment',
  async (
    { resumeId, versionId, body }: { resumeId: string; versionId: string; body: string }
  ) => commentService.addComment(resumeId, versionId, { body })
);

export const deleteComment = createAsyncThunk(
  'resumeDetails/deleteComment',
  async (
    { resumeId, versionId, commentId }: { resumeId: string; versionId: string; commentId: string }
  ) => {
    await commentService.deleteComment(resumeId, versionId, commentId);
    return commentId;
  }
);

export const deleteResume = createAsyncThunk(
  'resumeDetails/deleteResume',
  async (resumeId: string) => {
    await resumeService.deleteResume(resumeId);
    return resumeId;
  }
);

const resumeDetailsSlice = createSlice({
  name: 'resumeDetails',
  initialState,
  reducers: {
    setPreviewVersionId(state, action: PayloadAction<string | null>) {
      state.previewVersionId = action.payload;
    },
    resetResumeDetailsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumeDetails.pending, (state) => {
        state.isLoadingResume = true;
      })
      .addCase(fetchResumeDetails.fulfilled, (state, action) => {
        state.resume = action.payload.resume;
        state.versions = action.payload.versions;
        state.isLoadingResume = false;
      })
      .addCase(fetchResumeDetails.rejected, (state) => {
        state.isLoadingResume = false;
      })
      .addCase(fetchSharedLinks.pending, (state) => {
        state.isLoadingLinks = true;
      })
      .addCase(fetchSharedLinks.fulfilled, (state, action) => {
        state.sharedLinks = action.payload;
        state.isLoadingLinks = false;
      })
      .addCase(fetchSharedLinks.rejected, (state) => {
        state.isLoadingLinks = false;
      })
      .addCase(fetchComments.pending, (state) => {
        state.isLoadingComments = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoadingComments = false;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.isLoadingComments = false;
      })
      .addCase(createShareLink.pending, (state) => {
        state.isCreatingLink = true;
      })
      .addCase(createShareLink.fulfilled, (state, action) => {
        state.sharedLinks.push(action.payload);
        state.isCreatingLink = false;
      })
      .addCase(createShareLink.rejected, (state) => {
        state.isCreatingLink = false;
      })
      .addCase(revokeShareLink.fulfilled, (state, action) => {
        state.sharedLinks = state.sharedLinks.filter((link) => link.id !== action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => (comment.id || comment._id) !== action.payload
        );
      })
      .addCase(deleteResume.pending, (state) => {
        state.isDeletingResume = true;
      })
      .addCase(deleteResume.fulfilled, (state) => {
        state.isDeletingResume = false;
      })
      .addCase(deleteResume.rejected, (state) => {
        state.isDeletingResume = false;
      });
  },
});

export const { setPreviewVersionId, resetResumeDetailsState } = resumeDetailsSlice.actions;
export default resumeDetailsSlice.reducer;
