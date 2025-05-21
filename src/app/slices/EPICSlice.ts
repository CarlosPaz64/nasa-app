import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";  
import NetInfo from "@react-native-community/netinfo";              // Para verificar estado de la conexión
import type { RootState } from "../store/store";                    // Tipo del estado raíz de Redux
import type { EPICEntity } from "../../domain/entities/EPICEntity";
import { EPICContractImplementation } from "../../data/repositories/EPICRepoImpl";
import { NasaEntity } from "../../domain/entities/NasaEntity";      // Genérico usado para id + data

// Thunk para obtener datos EPIC, con manejo de offline y cache
export const GetEPICTheme = createAsyncThunk<
  NasaEntity<EPICEntity>,        // Tipo de retorno: { id, data: EPICEntity[] }
  void,                           // No recibe argumentos
  { state: RootState; rejectValue: string }
>(
  "epic/fetch",
  async (_, thunkAPI) => {
    const net = await NetInfo.fetch();
    // Si no hay conexión, devolvemos cache si existe
    if (!net.isConnected) {
      const cached = thunkAPI.getState().EPIC.data;
      if (cached.length) {
        return { id: "EPIC", data: cached };
      }
      // Offline y sin cache → rechazamos con mensaje
      return thunkAPI.rejectWithValue("Offline y sin datos cacheados");
    }
    // Con conexión, obtenemos datos desde el repositorio
    const repo = new EPICContractImplementation();
    const list = await repo.getEPICData(); // Devuelve EPICEntity[]
    // Si no hay resultados, lo consideramos error
    if (!list.length) {
      return thunkAPI.rejectWithValue("No hay datos EPIC disponibles");
    }
    // Devolvemos envuelto en NasaEntity
    return { id: "EPIC", data: list };
  }
);

// Definimos el estado usando el genérico NasaEntity para id + data
interface EpicState extends NasaEntity<EPICEntity> {
  loading: boolean;       // Indica si la petición está en curso
  error: string | null;   // Mensaje de error si algo falla
}

// Estado inicial: sin datos, sin error, sin carga, con id fijo
const initialState: EpicState = {
  id: "EPIC",
  data: [],
  loading: false,
  error: null,
};

const epicSlice = createSlice({
  name: "EPIC",
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      // Cuando arranca la petición: activamos loading y limpiamos errores previos
      .addCase(GetEPICTheme.pending, state => {
        state.loading = true;
        state.error = null;
      })
      // Si todo va bien: guardamos los datos y desactivamos loading
      .addCase(GetEPICTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      // Si falla: guardamos el mensaje de error y desactivamos loading
      .addCase(GetEPICTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Error al cargar datos EPIC";
      }),
});

export const EPICReducer = epicSlice.reducer; // Exportamos el reducer para integrarlo en el store