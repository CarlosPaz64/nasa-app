// Mi segundo slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Para verificar estado de la conexión
import NetInfo from "@react-native-community/netinfo";
import type { RootState } from "../store/store";
// Tipo del estado raíz de Redux
import type { AsteroidEntity } from "../../domain/entities/AsteroidEntity";
import { AsteroidImplementation } from "../../data/repositories/AsteroidRepoImpl";
// Aquí se llama a la entidad inicial para la data y el id
import { NasaEntity } from "../../domain/entities/NasaEntity";

// Definimos el estado usando el genérico NasaEntity para manejar id y data
interface AsteroidState extends NasaEntity<AsteroidEntity> {
  loading: boolean;       // Indica si la petición está en curso
  error: string | null;   // Mensaje de error si algo falla
}

// Estado inicial: sin datos, sin error, sin carga, con un id fijo
const initialState: AsteroidState = {
  id: "asteroids",  
  data: [],         
  loading: false,   
  error: null,      
};

// Thunk para obtener la lista de asteroides, con manejo de offline y cache
export const fetchAsteroids = createAsyncThunk<
  NasaEntity<AsteroidEntity>,        // Tipo de retorno: { id, data: AsteroidEntity[] }
  void,                               // No recibe argumentos
  { state: RootState; rejectValue: string }
>(
  "asteroids/fetch",
  async (_, thunkAPI) => {
    const net = await NetInfo.fetch();
    // Si estamos offline, devolvemos datos cacheados si los hay
    if (!net.isConnected) {
      const cached = thunkAPI.getState().Asteroids.data;
      if (cached.length) {
        return { id: "asteroids", data: cached };
      }
      // Offline y sin datos → rechazamos con mensaje
      return thunkAPI.rejectWithValue("Offline y sin datos cacheados");
    }
    // Si hay conexión, obtenemos datos desde el repositorio
    const repo = new AsteroidImplementation();
    const list = await repo.getAsteroidsData();
    // Si el feed viene vacío, también lo consideramos un error
    if (!list.length) {
      return thunkAPI.rejectWithValue("No hay asteroides en el feed");
    }
    // Devolvemos la lista envuelta en NasaEntity
    return { id: "asteroids", data: list };
  }
);

// Creamos el slice con sus casos extraReducers para manejar los distintos estados
const slice = createSlice({
  name: "asteroids",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      // Cuando arranca la petición: activamos loading y limpiamos errores previos
      .addCase(fetchAsteroids.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // Si todo va bien: guardamos los datos y desactivamos loading
      .addCase(fetchAsteroids.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      // Si falla: guardamos el mensaje de error y desactivamos loading
      .addCase(fetchAsteroids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al cargar asteroides";
      }),
});

export const AsteroidReducer = slice.reducer; // Exportamos el reducer para configurarlo en el store