import { combineReducers, configureStore } from '@reduxjs/toolkit';
import HomeReducer from './slices/HomeSlice'
import SettingsReducer from './slices/SettingsSlice'
import BTPeripheralReducer from './slices/BTPeripheralSlice';
import VersionReducer from './slices/VersionSlice';

/**
 * Contains list of reducers
 * Add reducers here
 */
const reducers = combineReducers({
  Home: HomeReducer,
  Settings: SettingsReducer,
  Peripherals: BTPeripheralReducer,
  Version: VersionReducer
});

export const Store = configureStore({
  reducer: reducers,
  middleware: getDefaultMiddleWare =>
    getDefaultMiddleWare({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof Store.getState>
export type AppDispatch = typeof Store.dispatch
