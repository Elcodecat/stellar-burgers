import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
  type TLoginData,
  type TRegisterData,
} from '@api';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { deleteCookie, setCookie } from '@utils/cookie';

import type { TUser } from '@utils-types';
export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const r = await getUserApi();
  return r.user;
});
export const loginUser = createAsyncThunk('user/login', async (d: TLoginData) => {
  const r = await loginUserApi(d);
  localStorage.setItem('refreshToken', r.refreshToken);
  setCookie('accessToken', r.accessToken);
  return r.user;
});
export const registerUser = createAsyncThunk(
  'user/register',
  async (d: TRegisterData) => {
    const r = await registerUserApi(d);
    localStorage.setItem('refreshToken', r.refreshToken);
    setCookie('accessToken', r.accessToken);
    return r.user;
  }
);
export const updateUser = createAsyncThunk(
  'user/update',
  async (d: Partial<TRegisterData>) => {
    const r = await updateUserApi(d);
    return r.user;
  }
);
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
});
type State = {
  user: TUser | null;
  loading: boolean;
  checked: boolean;
  error: string | null;
};
const initialState: State = { user: null, loading: false, checked: false, error: null };
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(s, a: PayloadAction<TUser | null>) {
      s.user = a.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchUser.pending, (s) => {
      s.loading = true;
    })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.loading = false;
        s.checked = true;
        s.user = a.payload;
      })
      .addCase(fetchUser.rejected, (s) => {
        s.loading = false;
        s.checked = true;
        s.user = null;
      })
      .addCase(loginUser.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addCase(updateUser.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addCase(logoutUser.fulfilled, (s) => {
        s.user = null;
      });
  },
});
export const { setUser } = slice.actions;
export default slice.reducer;
