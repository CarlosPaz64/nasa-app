import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../app/slices/ThemeSlice";
import type { RootState, AppDispatch } from "../../app/store/store";

export const ThemeToggleButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((s: RootState) => s.theme.mode);

  return (
    <TouchableOpacity
      style={[styles.button, mode === "light" ? styles.darkBtn : styles.lightBtn]}
      onPress={() => dispatch(toggleTheme())}
    >
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  lightBtn: {
    backgroundColor: "#222222",
  },
  darkBtn: {
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 14,
  },
});
