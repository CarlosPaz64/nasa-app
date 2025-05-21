// Slices para las imágenes de la NASA
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo";
import type { RootState } from "../store/store";
import type { NasaImageEntity } from "../../domain/entities/NasaImageEntity";
import { NasaImageRepoImpl } from "../../data/repositories/NasaImageRepoImpl";
import { NasaEntity } from "../../domain/entities/NasaEntity";

// Thunk para buscar imágenes en la API de la NASA, con manejo de offline y cache
export const fetchNasaImages = createAsyncThunk<
  NasaEntity<NasaImageEntity>,               // Retorna { id: string; data: NasaImageEntity[] }
  { query: string },                          // Recibe el término de búsqueda
  { state: RootState; rejectValue: string }
>(
  "nasaImages/fetch",
  async ({ query }, thunkAPI) => {
    const net = await NetInfo.fetch();

    // Si estamos offline, devolvemos la cache si existe
    if (!net.isConnected) {
      const cached = thunkAPI.getState().NasaImages.data;
      if (cached.length) {
        return { id: query, data: cached };
      }
      // Offline y sin cache → rechazamos con mensaje
      return thunkAPI.rejectWithValue("Offline y sin datos cacheados");
    }

    // Con conexión, consultamos el repositorio
    const repo = new NasaImageRepoImpl();
    const images = await repo.getNasaImagesData(query);

    // Si no devuelve resultados, lo consideramos un error
    if (!images.length) {
      return thunkAPI.rejectWithValue(`No se encontraron imágenes para "${query}"`);
    }

    // Devolvemos las imágenes envueltas en el genérico NasaEntity
    return { id: query, data: images };
  }
);

// Estado de la búsqueda de imágenes, usando NasaEntity para manejar id y data
interface NasaImageState extends NasaEntity<NasaImageEntity> {
  loading: boolean;       // Indica si la petición está en curso
  error: string | null;   // Mensaje de error si algo falla
}

// Estado inicial: sin id, sin datos, sin carga, sin error
const initialState: NasaImageState = {
  id: "",
  data: [],
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "NasaImages",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      // Al iniciar la petición: activamos loading y limpiamos errores previos
      .addCase(fetchNasaImages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // Si la petición es exitosa: guardamos id y datos, desactivamos loading
      .addCase(fetchNasaImages.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.data = action.payload.data;
      })
      // Si falla: guardamos mensaje de error y desactivamos loading
      .addCase(fetchNasaImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al cargar imágenes";
      }),
});

export const NasaImageReducer = slice.reducer;  // Exportamos el reducer para el store