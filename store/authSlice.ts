import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import ApiService from "@/api";
import { SignupRequest, User } from "@/types/auth";
import { RootState } from ".";
import { saveUserData } from "@/utils/secure.store.helper";

const apiService = new ApiService();

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (signupData: SignupRequest) => {
    const response = await apiService.register(signupData);
    await saveUserData(response, response.access_token, response.refresh_token);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const response = await apiService.login(email, password);
    await saveUserData(response, response.access_token, response.refresh_token); // Lưu thông tin người dùng
    return response;
  }
);

export const checkAuthState = createAsyncThunk(
  "auth/checkState",
  async (_, { getState }) => {
    const { accessToken } = (getState() as RootState).auth;
    if (!accessToken) {
      throw new Error("No token found");
    }
    return { accessToken };
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          id: action.payload.id,
          user_name: action.payload.user_name,
          email: action.payload.email,
          avatar_url: action.payload.avatar_url,
          birth: action.payload.birth,
          first_name: action.payload.first_name,
          gender: action.payload.gender,
          last_name: action.payload.last_name,
          phone_number: action.payload.phone_number,
          created_at: action.payload.created_at,
          updated_at: action.payload.updated_at,
        };
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
      });
  },
});

export const { logout, setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
