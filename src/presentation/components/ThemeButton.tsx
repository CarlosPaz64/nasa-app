import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
// useDispatch: hook para obtener la función dispatch y enviar acciones al store
// useSelector: hook para leer valores del state global de Redux

import { toggleTheme } from "../../app/slices/ThemeSlice";
// Acción que alterna entre tema claro y oscuro

import type { RootState, AppDispatch } from "../../app/store/store";
// Tipos TypeScript:
// - RootState: tipo del estado raíz de Redux
// - AppDispatch: tipo de la función dispatch configurada en el store

export const ThemeToggleButton: React.FC = () => {
  // Componente funcional que renderiza un botón para cambiar el tema
  const dispatch = useDispatch<AppDispatch>();
  // Obtenemos dispatch con el tipo correcto para enviar acciones tipadas

  const mode = useSelector((s: RootState) => s.theme.mode);
  // Leemos el modo actual ("light" o "dark") desde el estado global

  return (
    <TouchableOpacity
      // Estilo combinado: base + variante según el modo actual
      style={[
        styles.button, // Estilos generales del botón: posición, padding, etc.
        mode === "light" // Si el modo es light...
          ? styles.darkBtn // ...usamos estilo para botón claro (fondo blanco)
          : styles.lightBtn // ...si es dark usamos estilo para botón oscuro (fondo negro)
      ]}
      onPress={() => dispatch(toggleTheme())}
    // Al presionar, despachamos la acción toggleTheme para alternar el tema
    >
      {/* Aquí podrías poner un icono o texto indicando el tema actual */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {               // Estilos genéricos para el contenedor del botón
    padding: 8,           // Espacio interno around del contenido
    borderRadius: 4,      // Bordes redondeados de 4px
    position: "absolute", // Posicionamiento absoluto dentro del padre
    top: 16,              // 16px desde la parte superior
    right: 16,            // 16px desde la parte derecha
    zIndex: 10,           // Se asegura que el botón esté por encima de otros elementos
  },
  lightBtn: {             // Variante de estilo cuando el modo es dark (texto claro sobre fondo oscuro)
    backgroundColor: "#222222", // Fondo oscuro para tema oscuro
  },
  darkBtn: {              // Variante de estilo cuando el modo es light (texto oscuro sobre fondo claro)
    backgroundColor: "#FFFFFF", // Fondo claro para tema claro
  },
  text: {                 // Estilo para texto interno, en caso de usar <Text>
    fontSize: 14,         // Tamaño de fuente 14px
  },
});