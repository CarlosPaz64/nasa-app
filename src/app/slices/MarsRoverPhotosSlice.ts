import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo";
import type { RootState } from "../store/store";
import type { MarsRoverPhotosEntity } from "../../domain/entities/MarsRoverPhotosEntity";
import { MarsRoverPhotosImplementation } from "../../data/repositories/MarsRoverPhotosRepoImpl";
import { NasaEntity } from "../../domain/entities/NasaEntity";

// Definimos el estado extendiendo el genérico NasaEntity para manejar id y data,
// y agregamos page, hasMore, loading y error.
interface MarsRoverState extends NasaEntity<MarsRoverPhotosEntity> {
  page: number;         // Página actual para paginación
  hasMore: boolean;     // Indica si hay más páginas por cargar
  loading: boolean;     // Indicador de carga en curso
  error: string | null; // Mensaje de error si falla la petición
}

// Estado inicial: sin datos, página 1, habilitado paginación, sin carga ni error.
const initialState: MarsRoverState = {
  id: "MarsRoverPhotos",
  data: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
};

/**
 * Thunk para cargar fotos de Marte:
 * - Si estamos offline y hay cache, devolvemos los datos cacheados.
 * - Si estamos offline y no hay cache, rechazamos con error.
 * - Si estamos online, solicitamos la página actual al repositorio.
 * - Si la respuesta viene vacía, también rechazamos para indicar fin de feed.
 */
export const fetchMarsRoverPhotos = createAsyncThunk<
  NasaEntity<MarsRoverPhotosEntity>,    // Retorna { id, data: MarsRoverPhotosEntity[] }
  void,
  { state: RootState; rejectValue: string }
>(
  "marsRover/fetch",
  async (_, thunkAPI) => {
    const net = await NetInfo.fetch();
    const slice = thunkAPI.getState().MarsRoverPhotos; // Obtenemos page y data actuales

    if (!net.isConnected) {
      // Offline: si hay cache, devolvemos datos; sino, rechazamos
      if (slice.data.length > 0) {
        return { id: "MarsRoverPhotos", data: slice.data };
      }
      return thunkAPI.rejectWithValue("Offline y sin cache de fotos");
    }

    // Online: pedimos la página actual al repositorio
    const repo = new MarsRoverPhotosImplementation();
    const photos = await repo.getMarsPhotosData(slice.page);

    // Si no hay fotos nuevas, rechazamos para indicar que no hay más
    if (photos.length === 0) {
      return thunkAPI.rejectWithValue("No hay más fotos de Marte");
    }

    // Devolvemos las fotos envueltas en NasaEntity
    return { id: "MarsRoverPhotos", data: photos };
  }
);

export const marsRoverSlice = createSlice({
  name: "MarsRoverPhotos",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      // Al iniciar la petición: activamos el loading y limpiamos errores anteriores
      .addCase(fetchMarsRoverPhotos.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // Si se cumple: agregamos las nuevas fotos, avanzamos página y actualizamos hasMore
      .addCase(fetchMarsRoverPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.data = [...state.data, ...action.payload.data];
        state.page += 1;
        state.hasMore = action.payload.data.length > 0;
      })
      // Si rechaza: guardamos el mensaje de error y desactivamos loading
      .addCase(fetchMarsRoverPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al cargar fotos de Marte";
      }),
});

// Exportamos el reducer con el mismo nombre que usa combineReducers
export const MarsRoverReducer = marsRoverSlice.reducer;