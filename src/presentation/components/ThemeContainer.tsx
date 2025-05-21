import React, { useEffect } from "react";
// Dimensions: API de React Native para obtener dimensiones de la ventana (ancho y alto)
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
// Hook de Redux para leer valores del estado global
import { useSelector } from "react-redux";
// Tipo TypeScript que describe la forma completa del estado raíz de Redux
import type { RootState } from "../../app/store/store";

// Constantes de estilo para una mayor facilidad a los valores de los colores
const LIGHT_BG = "#FFFFFF";
const DARK_BG = "#222222";
const { width, height } = Dimensions.get("window");

export const ThemedContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Leemos el modo actual ("light" o "dark") desde Redux
  const mode = useSelector((s: RootState) => s.theme.mode);
  // Creamos un valor compartido que determinará el progreso de la animación
  // Inicialmente 1 si el tema es light, 0 si es dark
  const progress = useSharedValue(mode === "light" ? 1 : 0);

  // useEffect para reaccionar al cambio de modo
  useEffect(() => {
    // Al cambiar 'mode', animamos 'progress.value' de 0 ↔ 1 en 500ms
    progress.value = withTiming(
      mode === "light" ? 1 : 0,  // Valor final de la animación
      { duration: 500 }          // Duración en milisegundos
    );
  }, [mode, progress]); // Dependencias: se vuelve a ejecutar cuando cambian 'mode' o 'progress'

  // Creamos un estilo animado que se aplicará al contenedor
  const style = useAnimatedStyle(() => ({
    position: "absolute",  // Se posiciona absoluto para cubrir toda la ventana
    width, // Ancho igual al de la pantalla
    height, // Alto igual al de la pantalla
    // Interpolamos el color de fondo entre DARK_BG y LIGHT_BG según progress.value
    backgroundColor: interpolateColor(
      progress.value, // Valor de entrada (0 → oscuro, 1 → claro)
      [0, 1], // Rango de entrada
      [DARK_BG, LIGHT_BG] // Colores de salida para cada extremo
    ),
  }));

  return (
    <Animated.View style={style}>
      {children}
    </Animated.View>
  );
};