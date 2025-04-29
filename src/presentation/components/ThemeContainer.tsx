import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";

// Constantes de estilo para una mayor facilidad a los valores de los colores
const LIGHT_BG = "#FFFFFF";
const DARK_BG  = "#222222";
const { width, height } = Dimensions.get("window");

export const ThemedContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mode     = useSelector((s: RootState) => s.theme.mode);
  const progress = useSharedValue(mode === "light" ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(mode === "light" ? 1 : 0, { duration: 500 });
  }, [mode, progress]);

  const style = useAnimatedStyle(() => ({
    position:        "absolute",
    width, height,
    backgroundColor: interpolateColor(progress.value, [0,1], [DARK_BG, LIGHT_BG]),
  }));

  return (
    <Animated.View style={style}>
      {children}
    </Animated.View>
  );
};