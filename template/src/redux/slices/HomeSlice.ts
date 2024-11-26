import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getSampleDataAsync} from '../../api/SampleService';
import SampleModel from '../../models/SampleModel';

const getSampleDataAction = createAsyncThunk(
  'HomeSlice/getSampleDataAction',
  async () => {
    return await getSampleDataAsync();
  },
);

interface SampleState {
  sampleData: any;
}

const initialState: SampleState = {
  sampleData: [],
};

const HomeSlice = createSlice({
  name: 'Home',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSampleDataAction.pending, (state, action) => {
      //
    });
    builder.addCase(getSampleDataAction.fulfilled, (state, action) => {
      let sampleList = [];
      for (var item of action.payload.data) {
        var sampleModel = new SampleModel();
        sampleModel.id = item?.id;
        sampleModel.userId = item?.userId;
        sampleModel.title = item?.title;
        sampleModel.completed = item?.completed;
        sampleList.push(sampleModel);
      }
      state.sampleData = [...sampleList];
    });
    builder.addCase(getSampleDataAction.rejected, (state, action) => {
      //
    });
  },
});

export const HomeSliceActions = {...HomeSlice.actions, getSampleDataAction};
export default HomeSlice.reducer;
