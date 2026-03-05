import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from '@/services/auth';
import type { User } from '@/types';

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
};

function getStoredUser(): User | null {
  const storedUser = authService.getUser();
  if (!storedUser) {
    return null;
  }

  return {
    id: storedUser.id,
    email: storedUser.email,
  };
}

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isInitialized: false,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => getStoredUser());

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    await authService.login({ email, password });
    return getStoredUser();
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password }: { email: string; password: string }) => {
    await authService.register({ email, password });
    return getStoredUser();
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (idToken: string) => {
    await authService.loginWithGoogle(idToken);
    return getStoredUser();
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      authService.logout();
      state.user = null;
      state.isLoading = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(register.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isInitialized = true;
      })
      .addCase(loginWithGoogle.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
