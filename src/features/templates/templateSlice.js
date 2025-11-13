import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import templateService from "./templateService";

const initialState = {
  templateList: [],
  template: {},
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// Get Multiple templates
export const getTemplates = createAsyncThunk(
  "template/list",
  async (params, thunkAPI) => {
    try {
      return await templateService.getTemplateList(params.page, params.search);
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

export const getTemplateById = createAsyncThunk(
  "template/detail",
  async (id, thunkAPI) => {
    try {
      return await templateService.getTemplateById(id);
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

export const templateSlice = createSlice({
  name: "template",
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
      .addCase(getTemplates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templateList = action.payload;
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTemplateById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.template = action.payload;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, resetVariables } = templateSlice.actions;
export default templateSlice.reducer;
