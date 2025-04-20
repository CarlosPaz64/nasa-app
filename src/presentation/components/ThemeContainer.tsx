// src/presentation/components/ThemeContainer.tsx
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useSelector, useDispatch } from "react-redux";
import { GetEPICTheme } from "../../app/slices/EPICSlice";
import { setTheme }    from "../../app/slices/ThemeSlice";
import type { RootState, AppDispatch } from "../../app/store/store";

const LIGHT_BG = "#FFFFFF";
const DARK_BG  = "#222222";
const { width, height } = Dimensions.get("window");

export const ThemedContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  // 1️⃣ Cuando arranca la app, pedimos datos EPIC
  useEffect(() => {
    dispatch(GetEPICTheme());
  }, [dispatch]);

  // 2️⃣ Cuando llegue EPIC.data, calculamos día/noche y setTheme
  const epics = useSelector((s: RootState) => s.EPIC.data ?? []);
  useEffect(() => {
    if (epics.length > 0) {
      const hour = new Date(epics[0].date).getHours();
      dispatch(setTheme(hour >= 6 && hour < 18 ? "light" : "dark"));
    }
  }, [epics, dispatch]);

  // 3️⃣ Animación de fondo según el mode actual
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
