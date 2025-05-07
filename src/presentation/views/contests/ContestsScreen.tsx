// src/presentation/screens/ContestsScreen.tsx
import React, { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  FadeIn,
} from "react-native-reanimated";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { RootState } from "../../../app/store/store";

// Tipo de íconos válidos
type IoniconsName = keyof typeof Ionicons.glyphMap;

// Definición de un concurso
type Contest = { id: string; label: string; icon: IoniconsName };
const contests: Contest[] = [
  { id: "visitNASA", label: "Visit NASA", icon: "planet-outline" },
  { id: "moonRocks", label: "Moon rocks", icon: "moon-outline" },
  { id: "spaceTour", label: "Space travel", icon: "rocket-outline" },
  { id: "telescope", label: "Get a telescope", icon: "telescope-outline" },
];

type ContestsParamList = {
  ConcursosList: undefined;
  ContestForm: { contestId: string };
};

const { width, height } = Dimensions.get("window");
const CARD_SIZE = (width - 16 * 3) / 2;

const LIGHT_BG = "#FFFFFF";
const DARK_BG = "#222222";

export default function ContestsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<ContestsParamList>>();
  const mode = useSelector((st: RootState) => st.theme.mode);

  // animación de fondo
  const progress = useSharedValue(mode === "light" ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(mode === "light" ? 1 : 0, { duration: 500 });
  }, [mode]);
  const bgStyle = useAnimatedStyle(() => ({
    position: "absolute",
    width, height,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [DARK_BG, LIGHT_BG]
    ),
  }));

  return (
    <Animated.View style={bgStyle}>
      <ScrollView contentContainerStyle={styles.outer}>
        {/* Texto explicativo */}
        <Animated.Text
        entering={FadeIn.duration(500)}
          style={[
            styles.description,
            { color: mode === "light" ? "#000" : "#FFF" }
          ]}
        >
          Explore NASA’s contests and challenges!{'\n'}
          Choose one below to visit NASA facilities,{'\n'}
          win moon rocks, travel to space, or get a telescope.
        </Animated.Text>
        {/* Grid de 2x2 */}
        <View style={styles.grid}>
          {contests.map(({ id, label, icon }) => (
            <Pressable
              key={id}
              style={[
                styles.card,
                { backgroundColor: mode === "light" ? "#f0f0f0" : "#333333" },
              ]}
              onPress={() =>
                navigation.navigate("ContestForm", { contestId: id })
              }
            >
              <Ionicons
                name={icon}
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
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    padding: 16,
    paddingTop: 32,
  },
  description: {
    width: "100%",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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