import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UploadState = {
  title: string;
  isUploading: boolean;
  progress: number;
  isDragging: boolean;
};

const initialState: UploadState = {
  title: '',
  isUploading: false,
  progress: 0,
  isDragging: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setIsUploading(state, action: PayloadAction<boolean>) {
      state.isUploading = action.payload;
    },
    setProgress(state, action: PayloadAction<number>) {
      state.progress = action.payload;
    },
    setIsDragging(state, action: PayloadAction<boolean>) {
      state.isDragging = action.payload;
    },
    resetUploadState() {
      return initialState;
    },
  },
});

export const {
  setTitle,
  setIsUploading,
  setProgress,
  setIsDragging,
  resetUploadState,
} = uploadSlice.actions;

export default uploadSlice.reducer;
