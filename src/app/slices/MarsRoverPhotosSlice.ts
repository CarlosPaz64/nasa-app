// src/app/slices/marsRoverSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo";
import { MarsRoverPhotosImplementation } from "../../data/repositories/MarsRoverPhotosRepoImpl";
import type { MarsRoverPhotosEntity } from "../../domain/entities/MarsRoverPhotosEntity";
import type { RootState } from "../store/store";

interface MarsRoverState {
  data:     MarsRoverPhotosEntity[];
  page:     number;
  hasMore:  boolean;
  loading:  boolean;
  error:    string | null;
}

const initialState: MarsRoverState = {
  data:    [],
  page:    1,
  hasMore: true,
  loading: false,
  error:   null,
};

/**
 * Thunk para cargar fotos de Marte por página.  
 * - Si estamos offline y ya hay cache, sale con reject para que muestre cache.
 * - Si estamos online, llama a la API con el `page` actual.
 */
export const fetchMarsRoverPhotos = createAsyncThunk<
  MarsRoverPhotosEntity[],       // retorno en caso de éxito
  void,                          // no recibe argumentos
  { state: RootState; rejectValue: string }
>(
  "marsRover/fetch",
  async (_, thunkAPI) => {
    const net = await NetInfo.fetch();
    const slice = thunkAPI.getState().MarsRoverPhotos; // <— asegúrate que en combineReducers usas esta key

    if (!net.isConnected) {
      // Sin conexión pero tenemos datos cacheados
      if (slice.data.length > 0) {
        return thunkAPI.rejectWithValue("Offline: mostrando fotos cacheadas");
      }
      return thunkAPI.rejectWithValue("Offline y sin cache");
    }

    // Con conexión, pide la página `slice.page`
    const repo   = new MarsRoverPhotosImplementation();
    const photos = await repo.getMarsPhotosData(slice.page);
    return photos;
  }
);

export const marsRoverSlice = createSlice({
  name: "MarsRoverPhotos",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchMarsRoverPhotos.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchMarsRoverPhotos.fulfilled, (state, action) => {
        state.loading = false;
        // Añade al final los nuevos elementos
        state.data    = [...state.data, ...action.payload];
        state.page   += 1;
        // Si no vienen más, detenemos la paginación
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchMarsRoverPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error   = action.payload ?? "Error al cargar fotos de Marte";
      }),
});

export const MarsRoverReducer = marsRoverSlice.reducer;