import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Creación de un slice para manejar el cambio de color en la aplicación
interface ThemeState { mode: "light" | "dark" }
const initialState: ThemeState = { mode: "light" };

// Creación del slice para el cambio de tema
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    // Aquí se establece un estado
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
    },
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const ThemeReducer = themeSlice.reducer;