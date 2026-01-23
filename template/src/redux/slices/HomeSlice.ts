import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSampleDataAsync } from '../../api/SampleService';
import SampleModel from '../../models/SampleModel';

const getSampleDataAction = createAsyncThunk(
  'HomeSlice/getSampleDataAction',
  async () => {
    return await getSampleDataAsync();
  },
);

interface SampleState {
  sampleData: any;
  isLoading: boolean;
  error: string | null;
}

const initialState: SampleState = {
  sampleData: [],
  isLoading: false,
  error: null,
};

const HomeSlice = createSlice({
  name: 'Home',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSampleDataAction.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getSampleDataAction.fulfilled, (state, action) => {
      try {
        let sampleList = [];
        // Handle cases where payload or payload.data might be undefined
        if (action.payload && action.payload.data && Array.isArray(action.payload.data)) {
          for (var item of action.payload.data) {
            var sampleModel = new SampleModel();
            sampleModel.id = item?.id;
            sampleModel.userId = item?.userId;
            sampleModel.title = item?.title;
            sampleModel.completed = item?.completed;
            sampleList.push(sampleModel);
          }
        }
        state.sampleData = [...sampleList];
        state.isLoading = false;
        state.error = null;
      } catch (error) {
        // If there's an error processing the payload, set error state
        state.isLoading = false;
        state.error = 'Failed to process data';
        state.sampleData = [];
      }
    });
    builder.addCase(getSampleDataAction.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Failed to load data';
    });
  },
});

export const HomeSliceActions = { ...HomeSlice.actions, getSampleDataAction };
export default HomeSlice.reducer;
