import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import versionService, { VersionInfo } from '../../services/VersionService';

export const checkVersionUpdate = createAsyncThunk(
    'version/checkUpdate',
    async () => {
        return await versionService.checkForUpdates();
    }
);

interface VersionState {
    versionInfo: VersionInfo | null;
    loading: boolean;
    error: string | null;
    lastCheckTime: number | null;
}

const initialState: VersionState = {
    versionInfo: null,
    loading: false,
    error: null,
    lastCheckTime: null,
};

const VersionSlice = createSlice({
    name: 'Version',
    initialState,
    reducers: {
        resetVersionError: (state) => {
            state.error = null;
        },
        dismissUpdatePrompt: (state) => {
            state.versionInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkVersionUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(checkVersionUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.versionInfo = action.payload;
                state.lastCheckTime = Date.now();
            })
            .addCase(checkVersionUpdate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to check version';
            });
    },
});

export const VersionSliceActions = { ...VersionSlice.actions, checkVersionUpdate };
export const { resetVersionError, dismissUpdatePrompt } = VersionSlice.actions;
export default VersionSlice.reducer;
