import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { LandingDetails } from "../../types/landing-page";
import httpclient from "../../utils/api";
import error from "../../utils/error";

interface LandingPageState {
  data?: LandingDetails | null;
  loading: boolean;
  error?: string | null;
}

const initialState: LandingPageState = {
  data: undefined,
  loading: false,
  error: undefined,
};

export const getLandingPageDetails = createAsyncThunk(
  "landing/getDetails",
  async () => {
    try {
      const response = await httpclient().get("/global/mock-data/landing.json");
      return response.data;
    } catch (error_) {
      throw new Error(error(error_));
    }
  }
);

const slice = createSlice({
  name: "landing",
  initialState,
  reducers: {},
  extraReducers(builder): void {
    builder.addCase(getLandingPageDetails.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(getLandingPageDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getLandingPageDetails.rejected, (state, action) => {
      state.loading = false;
      // action.payload contains error information
      state.error = error(action.payload);
    });
  },
});

export default slice.reducer;
