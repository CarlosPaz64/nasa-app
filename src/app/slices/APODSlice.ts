// Creación del primer slice de mi contexto en Redux
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo"; // Básicamente esto me va a ayudar para saber el tipo de conexión y la calidad de la misma
// Esta es la documentación: https://www.npmjs.com/package/@react-native-community/netinfo
// import NetInfo from "@react-native-community/netinfo";
import { APODContractImplementation } from "../../data/repositories/APODRepoImpl";
import { NasaEntity } from "../../domain/entities/NasaEntity";
// Este es para el manejo de los errores durante el fetch
import { APODEntity } from "../../domain/entities/APODEntity";
import type { RootState } from "../store/store";

// Se define el estado para la imagen del día APOD, usando el type que se declaró previamente con NasaEntity
interface APODState extends NasaEntity<APODEntity> {
    loading: boolean;
    error: string | null;
}

// Se prevcarga un estado inicial para APOD vacío
const initialState: APODState = {
    id: "APOD", // ID dentro del NasaEntity
    data: [], // La data inicial 
    loading: false, // El booleano previamente definido 
    error: null // El error inexistente
}


// Creación del thunk para el modo online y demás
export const GetTheAPOD = createAsyncThunk<
  NasaEntity<APODEntity>, // tipo de retorno
  void,                   // no recibe argumentos
  { state: RootState }    // para leer state.apod
>(
  "apod/fetch",
  async (_, thunkAPI) => {
    const net = await NetInfo.fetch();
    // Si no hay conexión:
    if (!net.isConnected) {
      const cached = thunkAPI.getState().APOD.data;
      if (cached.length) {
        // devolvemos los datos cacheados
        return { id: "apod", data: cached };
      }
      // offline + sin cache → error
      return thunkAPI.rejectWithValue("Offline y sin datos cacheados");
    }
    // Si hay conexión:
    const repo = new APODContractImplementation();
    const apod = await repo.getAPODData();
    return { id: "apod", data: [apod] };
  }
);

export const APODSlice = createSlice({
    name: "apod",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Pendiente → marca loading
        .addCase(GetTheAPOD.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        // Cumplido → guarda data y quita loading
        .addCase(GetTheAPOD.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
        })
        // Rechazado → guarda error y quita loading
        .addCase(GetTheAPOD.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
})

// Creamos una constante que 'llama' al reducer que acabamos de hacer
export const APODReducer = APODSlice.reducer;