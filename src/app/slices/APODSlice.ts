// Creación del primer slice de mi contexto en Redux
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import NetInfo from "@react-native-community/netinfo"; // Básicamente esto me va a ayudar para saber el tipo de conexión y la calidad de la misma
// Esta es la documentación: https://www.npmjs.com/package/@react-native-community/netinfo
