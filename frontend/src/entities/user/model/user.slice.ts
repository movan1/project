import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  initialState: { token: '' },
  name: 'user',
  reducers: {
    clearToken: (state) => {
      state.token = '';
      localStorage.removeItem('token');
    },
    setToken: (
      state,
      action: PayloadAction<string>
    ) => {
      const token = action.payload;

      localStorage.setItem('token', token);
      state.token = token;
    }
  }
});

export const { clearToken, setToken } = userSlice.actions;
