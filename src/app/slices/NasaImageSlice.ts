// app/slices/nasaImageSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo";
import type { RootState }       from "../store/store";
import type { NasaImageEntity } from "../../domain/entities/NasaImageEntity";
import { NasaImageRepoImpl }    from "../../data/repositories/NasaImageRepoImpl";

interface State {
  id:      string;
  data:    NasaImageEntity[];
  loading: boolean;
  error:   string | null;
}

const initialState: State = {
  id:      "",
  data:    [],
  loading: false,
  error:   null,
};

export const fetchNasaImages = createAsyncThunk<
  { id: string; data: NasaImageEntity[] },
  { query: string },
  { state: RootState; rejectValue: string }
>(
  "nasaImages/fetch",
  async ({ query }, thunkAPI) => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) {
      const cached = thunkAPI.getState().NasaImages.data;
      if (cached.length) return { id: query, data: cached };
      return thunkAPI.rejectWithValue("Offline y sin datos cacheados");
    }
    const repo = new NasaImageRepoImpl();
    const images = await repo.getNasaImagesData(query);
    if (!images.length)
      return thunkAPI.rejectWithValue(`No se encontraron imágenes para "${query}"`);
    return { id: query, data: images };
  }
);

const slice = createSlice({
  name: "nasaImages",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchNasaImages.pending, state => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchNasaImages.fulfilled, (state, action) => {
        state.loading = false;
        state.id      = action.payload.id;
        state.data    = action.payload.data;
      })
      .addCase(fetchNasaImages.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? "Error al cargar imágenes";
      }),
});

export const NasaImageReducer = slice.reducer;