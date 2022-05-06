import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import error from "../../../../utils/error";
import axios, { AxiosError } from "axios";
import { addCertificateService } from "../../../../../services/gateway/api/api";
import { IAddCertificateState } from ".";

const initialState: IAddCertificateState = {
  certAdded: false,
  loading: false,
  error: undefined,
  data: undefined,
};

export const addCertificate = createAsyncThunk(
  "add/certificate",
  async (data: any) => {
    try {
      const response = await addCertificateService(data);
      console.log("response", response);
      return response.data;
    } catch (error__) {
      const myError = error__ as Error | AxiosError;
      const error_ =
        axios.isAxiosError(myError) && myError.response
          ? myError.response.data.Errors[0]
          : myError.message;
      throw error_;
    }
  }
);

const slice = createSlice({
  name: "addapi",
  initialState,
  reducers: {},
  extraReducers(builder): void {
    builder.addCase(addCertificate.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addCertificate.fulfilled, (state, action) => {
      state.loading = false;
      state.certAdded = true;
      state.data = action.payload;
    });
    builder.addCase(addCertificate.rejected, (state, action) => {
      state.loading = false;
      action.payload = action.error;
    });
  },
});

export default slice.reducer;
