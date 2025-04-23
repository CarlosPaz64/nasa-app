// src/app/slices/nasaMediaSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo";
import type { RootState } from "../store/store";
import type { NasaMediaEntity } from "../../domain/entities/NasaImageEntity";
import { NasaMediaImplementation } from "../../data/repositories/NasaImageRepoImpl";

interface NasaMediaState {
  id: string;
  data: NasaMediaEntity[];
  loading: boolean;
  error: string | null;
}

const initialState: NasaMediaState = {
  id: "",
  data: [],
  loading: false,
  error: null,
};

export const fetchNasaMedia = createAsyncThunk<
  { id: string; data: NasaMediaEntity[] },
  { query: string; includeVideos: boolean },
  { state: RootState; rejectValue: string }
>(
  "nasaMedia/fetch",
  async ({ query, includeVideos }, thunkAPI) => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      const cached = thunkAPI.getState().NasaMedia.data;
      if (cached.length) {
        return { id: query, data: cached };
      }
      return thunkAPI.rejectWithValue("Offline y sin datos");
    }

    const repo = new NasaMediaImplementation();
    const medias = await repo.getNasaMediaData(query, includeVideos);
    if (!medias.length) {
      return thunkAPI.rejectWithValue(
        `No se encontraron ${
          includeVideos ? "imágenes o videos" : "imágenes"
        } para "${query}"`
      );
    }
    return { id: query, data: medias };
  }
);

const nasaMediaSlice = createSlice({
  name: "nasaMedia",
  initialState,
  reducers: {},
  extraReducers: (b) =>
    b
      .addCase(fetchNasaMedia.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchNasaMedia.fulfilled, (s, a) => {
        s.loading = false;
        s.id = a.payload.id;
        s.data = a.payload.data;
      })
      .addCase(fetchNasaMedia.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ?? "Error genérico";
      }),
});

export const NasaMediaReducer = nasaMediaSlice.reducer;