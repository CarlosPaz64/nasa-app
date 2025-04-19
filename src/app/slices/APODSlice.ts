// Creación del primer slice de mi contexto en Redux
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo"; // Básicamente esto me va a ayudar para saber el tipo de conexión y la calidad de la misma
// Esta es la documentación: https://www.npmjs.com/package/@react-native-community/netinfo
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

