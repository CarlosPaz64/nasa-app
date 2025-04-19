/* STORE DE MI REDUX */
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"; // Esto es la persistencia
import AsyncStorage from "@react-native-async-storage/async-storage";
// El AsyncStorage solo aplica para móvil
import storageWeb from "redux-persist/lib/storage";
// Este es para web

const persistConfig = {
    key: "root",
    // Aquí se define cuál usar; si AsyncStorage o el storageWeb
    storage: AsyncStorage || storageWeb,
    // Luego siguen los reducers
};

const rootReducer = combineReducers({
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