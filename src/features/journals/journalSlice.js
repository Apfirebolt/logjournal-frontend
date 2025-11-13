import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import journalService from "./journalService";

const initialState = {
  journalList: [],
  journal: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get Multiple journals
export const getJournals = createAsyncThunk(
  "journal/list",
  async (params, thunkAPI) => {
    try {
      return await journalService.getJournalList(params.page, params.search);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getJournalById = createAsyncThunk(
  "journal/detail",
  async (id, thunkAPI) => {
    try {
      return await journalService.getJournalById(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const journalSlice = createSlice({
  name: "journal",
  initialState,
  reducers: {
    reset: () => initialState,
    resetVariables: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJournals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJournals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.journalList = action.payload;
      })
      .addCase(getJournals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getJournalById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getJournalById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.journal = action.payload;
      })
      .addCase(getJournalById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetVariables } = journalSlice.actions;
export default journalSlice.reducer;
