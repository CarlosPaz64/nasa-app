// src/presentation/screens/ContestsScreen.tsx
import React, { useEffect } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { RootState } from "../../../app/store/store";

// Tipo de nombres válidos de Ionicons
type IoniconsName = keyof typeof Ionicons.glyphMap;

// Datos de los concursos
const concursos: {
  id:    string;
  label: string;
  icon:  IoniconsName;
}[] = [
  { id: "visitNASA", label: "Visit NASA",  icon: "planet-outline" },
  { id: "moonRocks", label: "Moon rocks", icon: "moon-outline"  },
  { id: "spaceTour", label: "Space travel",  icon: "rocket-outline" },
];

// Parámetros de navegación
type ConcursosParamList = {
  ConcursosList: undefined;
  ContestForm: { contestId: string };
};

const { width, height } = Dimensions.get("window");
const CARD_SIZE = (width - 16 * 3) / 2;

// Colores de tema
const LIGHT_BG = "#FFFFFF";
const DARK_BG  = "#222222";

export default function ContestsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ConcursosParamList>>();

  // 1) Suscribirse al mode global
  const mode = useSelector((s: RootState) => s.theme.mode);

  // 2) sharedValue para animar de 0 (dark) a 1 (light)
  const progress = useSharedValue(mode === "light" ? 1 : 0);

  // 3) Cada vez que cambie mode, animamos
  useEffect(() => {
    progress.value = withTiming(mode === "light" ? 1 : 0, { duration: 500 });
  }, [mode]);

  // 4) Estilo animado de fondo
  const bgStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width,
    height,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [DARK_BG, LIGHT_BG]
    ),
  }));

  return (
    <Animated.View style={bgStyle}>
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        // ScrollView animado en caso de overflow
      >
        {concursos.map((c, i) => (
          <Pressable
            key={c.id}
            style={[
              styles.card,
              i === 2 && { alignSelf: "center" },
              // color dinámico de tarjeta
              {
                backgroundColor:
                  mode === "light" ? "#f0f0f0" : "#333333",
              },
            ]}
            onPress={() =>
              navigation.navigate("ContestForm", { contestId: c.id })
            }
          >
            <Ionicons
              name={c.icon}
              size={48}
              color={mode === "light" ? "#333" : "#EEE"}
              style={styles.icon}
            />
            <Text
              style={[
                styles.label,
                { color: mode === "light" ? "#000" : "#FFF" },
              ]}
            >
              {c.label}
            </Text>
          </Pressable>
        ))}
      </Animated.ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 32,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
