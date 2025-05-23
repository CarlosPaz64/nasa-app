/* STORE DE MI REDUX */
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"; // Esto es la persistencia
import AsyncStorage from "@react-native-async-storage/async-storage";
// El AsyncStorage solo aplica para móvil
// import storageWeb from "redux-persist/lib/storage";
// Este es para web
// Import del primer reducer
import { APODReducer } from "../slices/APODSlice";
import { EPICReducer } from "../slices/EPICSlice";
import { ThemeReducer } from "../slices/ThemeSlice";
import { MarsRoverReducer } from "../slices/MarsRoverPhotosSlice";
import { NasaImageReducer } from "../slices/NasaImageSlice";
import { AsteroidReducer } from "../slices/AsteroidSlice";
import { Platform } from "react-native";

// Esta validación es muy importante ya que define el storage a usar y no fuerza a Android a usar el de web ni viceversa
const storage = Platform.OS === "web"
  ? require("redux-persist/lib/storage").default  // Sólo en web
  : AsyncStorage; // Android/iOS :contentReference[oaicite:0]{index=0}


// Configuración de persistencia:
// * key: clave raíz bajo la que se almacena el estado
// * storage: el storage seleccionado arriba
// * whitelist: lista de slices cuyo estado queremos persistir
const persistConfig = {
    key: "root",
    // Aquí se define cuál usar; si AsyncStorage o el storageWeb
    storage,
    whitelist: ["APOD", "EPIC", "theme", "MarsRoverPhotos", "NasaImages", "Asteroids"]
    // Luego siguen los reducers
};

const rootReducer = combineReducers({
    APOD: APODReducer,
    EPIC: EPICReducer,
    theme: ThemeReducer,
    MarsRoverPhotos: MarsRoverReducer,
    NasaImages: NasaImageReducer,
    Asteroids: AsteroidReducer
    // Reducers...
})

// Esto es como en el useContext lo del children
// Se habilita la persistencia
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Crea el store configurado:
// * reducer: el persistedReducer para que el estado se recupere al reiniciar la app
// * middleware: desactiva las comprobaciones de serializabilidad e inmutabilidad
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
        getDefault({ serializableCheck: false, immutableCheck: false, })
})

// Crea el persistor que se encargará de rehidratar el estado al iniciar la app
export const persistor = persistStore(store)
// Tipo que representa el estado global a partir del rootReducer
export type RootState = ReturnType<typeof rootReducer>
// Tipo de dispatch con todas las acciones disponibles en el store
export type AppDispatch = typeof store.dispatch