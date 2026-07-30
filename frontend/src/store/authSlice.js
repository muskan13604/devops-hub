import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, initialized: false },
  reducers: {
    setCredentials: (state, action) => { state.user = action.payload.user; state.accessToken = action.payload.accessToken; state.initialized = true; },
    clearSession: (state) => { state.user = null; state.accessToken = null; state.initialized = true; },
  },
});

export const { setCredentials, clearSession } = authSlice.actions;
export default authSlice.reducer;
