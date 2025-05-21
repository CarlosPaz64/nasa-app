// A pesar de no ser parte fundamental del propósito de la aplicación
// Es necesaria para persistir la elección del usuario
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Creación de un slice para manejar el cambio de color en la aplicación
interface ThemeState { mode: "light" | "dark" }
const initialState: ThemeState = { mode: "light" };

// Creación del slice para el cambio de tema
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    /**
 * setTheme:
 * Permite forzar un tema específico (por ejemplo, leerlo de configuración o preferencias)
 * Útil para persistir la elección del usuario y restaurarla al iniciar la app
 */
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.mode = action.payload;
    },
    /**
 * toggleTheme:
 * Facilita alternar entre modo claro y oscuro con un solo dispatch
 * Mejora accesibilidad y usabilidad: muchos usuarios valoran este control
 * En un NASA Explorer, el modo oscuro realza imágenes espaciales y evita
 * el resplandor cuando se consultan fotos de espacio en entornos oscuros
 */
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export const ThemeReducer = themeSlice.reducer;