// src/app/slices/epicSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo";
import { EPICContractImplementation } from "../../data/repositories/EPICRepoImpl";
import type { EPICEntity } from "../../domain/entities/EPICEntity";
import type { RootState } from "../store/store";

// Thunk
export const GetEPICTheme = createAsyncThunk<
  EPICEntity[],
  void,
  { state: RootState }
>(
  "epic/fetch",
  async (_, thunkAPI) => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      return thunkAPI.rejectWithValue("Offline");
    }
    const repo = new EPICContractImplementation();
    return repo.getEPICData(); // devuelve un solo EPICEntity
  }
);

interface EpicState {
  data: EPICEntity[];
  loading: boolean;
  error: string | null;
}

const initialState: EpicState = {
  data: [],
  loading: false,
  error: null,
};

const epicSlice = createSlice({
  name: "epic",
  initialState,
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(GetEPICTheme.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(GetEPICTheme.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
      .addCase(GetEPICTheme.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; }),
});

export const EPICReducer = epicSlice.reducer;
