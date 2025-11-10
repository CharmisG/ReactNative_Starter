import {createSlice} from '@reduxjs/toolkit';

interface SampleState {
  appTheme: any;
}

const initialState: SampleState = {
  appTheme: '',
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

export const SettingsSliceActions = {...SettingsSlice.actions};
export const setAppTheme = SettingsSlice.actions.setAppTheme;
export default SettingsSlice.reducer;
