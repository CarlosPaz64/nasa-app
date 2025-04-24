import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  FadeIn,
} from "react-native-reanimated";
import { useAsteroidsViewModel } from "../../viewmodels/UseAsteroidViewModel";
import type { AsteroidEntity } from "../../../domain/entities/AsteroidEntity";
import type { RootState } from "../../../app/store/store";

// Lottie para móvil
import LottieView from "lottie-react-native";
import starfield from "../../../../assets/animations/meteor.json";

const { width } = Dimensions.get("window");
const LIGHT_BG = "#FFFFFF";
const DARK_BG  = "#222222";

export default function AsteroidListScreen() {
  const { data, loading, error } = useAsteroidsViewModel();
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  // Fondo animado al cambiar tema
  const progress = useSharedValue(isLight ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(isLight ? 1 : 0, { duration: 500 });
  }, [isLight]);
  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [DARK_BG, LIGHT_BG]
    ),
  }));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={isLight ? "#000" : "#fff"} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={[styles.errorText, { color: isLight ? "red" : "#f88" }]}>
          {error}
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: AsteroidEntity }) => {
    const accent = item.is_potentially_hazardous_asteroid ? "tomato" : "limegreen";
    const textColor = isLight ? "#000" : "#fff";

    // fondo semitransparente: más claro en light, más oscuro en dark
    const cardBg = isLight
      ? "rgba(255,255,255,0.7)"
      : "rgba(0,0,0,0.5)";

    return (
      <Animated.View
        entering={FadeIn.duration(300)}
        style={[
          styles.card,
          {
            backgroundColor: cardBg,
            borderLeftColor: accent,
          },
        ]}
      >
        <Text style={[styles.name, { color: textColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Approach: {item.close_approach_date}
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Velocity: {item.velocity_kph} km/h
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Distance: {item.miss_distance_km} km
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Hazardous: {item.is_potentially_hazardous_asteroid ? "Yes" : "No"}
        </Text>
      </Animated.View>
    );
  };

  return (
    <Animated.View style={bgStyle}>
      {Platform.OS !== "web" && (
        <LottieView
          source={starfield}
          autoPlay
          loop
          style={StyleSheet.absoluteFillObject}
        />
      )}

      <FlatList
        data={data}
        keyExtractor={(i) => i.name + i.close_approach_date}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
  },
  list: {
    padding:       16,
    paddingBottom: 32,
  },
  card: {
    borderLeftWidth: 4,
    borderRadius:    12,
    padding:         16,
    marginHorizontal: 16,
    marginBottom:    16,
    // sombras suaves para glass effect
    shadowColor:   "#000",
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius:  6,
    elevation:     4,
  },
  name: {
    fontSize:     18,
    fontWeight:   "700",
    marginBottom: 8,
  },
  field: {
    fontSize:       14,
    marginVertical: 2,
  },
  errorText: {
    fontSize: 16,
  },
});