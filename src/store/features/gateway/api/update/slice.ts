import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import {
  getApiByIdService,
  updateApiService,
} from "../../../../../services/gateway/api/api";
import error from "../../../../../utils/error";
import { initialState } from "./payload";
import { IGetApiByIdData } from ".";

export const getApiById = createAsyncThunk(
  "api/getApiById",
  async (Id: any) => {
    try {
      const response = await getApiByIdService(Id);
      return response?.data;
    } catch (error_) {
      const myError = error_ as Error | AxiosError;
      throw axios.isAxiosError(myError) && myError.response
        ? myError.response.data.Errors[0]
        : myError.message;
    }
  }
);
export const updateApi = createAsyncThunk(
  "api/update",
  async (data: IGetApiByIdData) => {
    try {
      const response = await updateApiService(data);
      return response.data;
    } catch (error_) {
      const myError = error_ as Error | AxiosError;
      console.log(
        "slice1",
        axios.isAxiosError(myError) && myError.response!.data.Errors[0]
      );
      console.log(
        "slice",
        axios.isAxiosError(myError) && myError.response
          ? myError.response.data.Errors[0]
          : myError.message
      );
      throw axios.isAxiosError(myError) && myError.response
        ? myError.response.data.Errors[0]
        : myError.message;
    }
  }
);

const slice = createSlice({
  name: "apiUpdate",
  initialState,
  reducers: {
    setForm: (state, action) => {
      state.data.form = action.payload;
      // console.log("form data : ", state.data.form);
    },
    setFormError: (state, action) => {
      state.data.errors = action.payload;
      // console.log("form error : ", state.data.errors);
    },
  },
  extraReducers(builder): void {
    builder.addCase(getApiById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getApiById.fulfilled, (state, action) => {
      state.loading = false;
      state.data.form = action.payload.Data;
    });
    builder.addCase(getApiById.rejected, (state, action) => {
      state.loading = false;
      // action.payload contains error information
      action.payload = action.error;
      state.error = error(action.payload);
    });
    builder.addCase(updateApi.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateApi.fulfilled, (state) => {
      state.loading = false;
      // state.data = action.payload;
    });
    builder.addCase(updateApi.rejected, (state, action) => {
      state.loading = false;
      console.log("action", action.payload);
      // action.payload contains error information
      action.payload = action.error;
      state.error = error(action.payload);
    });
  },
});

export const { setForm, setFormError } = slice.actions;
export default slice.reducer;
