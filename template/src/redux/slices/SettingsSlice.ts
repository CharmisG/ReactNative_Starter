import { createSlice } from '@reduxjs/toolkit';
import { AppConstants } from '../../constants/AppConstants';

interface SampleState {
  appTheme: string;
}

const initialState: SampleState = {
  appTheme: AppConstants.light,
};

const SettingsSlice = createSlice({
  name: 'Settings',
  initialState,
  reducers: {
    setAppTheme: (state, action) => {
      state.appTheme = action.payload;
    },
  },
});

export const SettingsSliceActions = { ...SettingsSlice.actions };
export const setAppTheme = SettingsSlice.actions.setAppTheme;
export default SettingsSlice.reducer;
