/* STORE DE MI REDUX */
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"; // Esto es la persistencia
import AsyncStorage from "@react-native-async-storage/async-storage";
// El AsyncStorage solo aplica para móvil
// import storageWeb from "redux-persist/lib/storage";
// Este es para web
// Import del primer reducer
import { APODReducer } from "../slices/APODSlice";
import { Platform } from "react-native";

// Esta validación es muy importante ya que define el storage a usar y no fuerza a Android a usar el de web ni viceversa
const storage = Platform.OS === "web"
  ? require("redux-persist/lib/storage").default  // Sólo en web
  : AsyncStorage;                                 // Android/iOS :contentReference[oaicite:0]{index=0}


const persistConfig = {
    key: "root",
    // Aquí se define cuál usar; si AsyncStorage o el storageWeb
    storage,
    whitelist: ["APOD"]
    // Luego siguen los reducers
};

const rootReducer = combineReducers({
    APOD: APODReducer
    // Reducers...
})

// Esto es como en el useContext lo del children
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false })
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch