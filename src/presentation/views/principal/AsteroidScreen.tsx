// src/presentation/screens/AsteroidListScreen.tsx

import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useSelector } from "react-redux";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useAsteroidsViewModel } from "../../viewmodels/UseAsteroidViewModel";
import type { AsteroidEntity } from "../../../domain/entities/AsteroidEntity";
import type { RootState } from "../../../app/store/store";

const LIGHT_BG = "#FFFFFF";
const DARK_BG  = "#222222";

export default function AsteroidListScreen() {
  const { data, loading, error } = useAsteroidsViewModel();
  const mode = useSelector((s: RootState) => s.theme.mode);

  // Animate background when theme changes
  const progress = useSharedValue(mode === "light" ? 1 : 0);
  React.useEffect(() => {
    progress.value = withTiming(mode === "light" ? 1 : 0, { duration: 500 });
  }, [mode]);
  const animatedBg = useAnimatedStyle(() => ({
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
        <ActivityIndicator
          size="large"
          color={mode === "light" ? "#000" : "#fff"}
        />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text
          style={[
            styles.errorText,
            { color: mode === "light" ? "red" : "#f88" },
          ]}
        >
          {error}
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: AsteroidEntity }) => {
    const borderColor = item.is_potentially_hazardous_asteroid
      ? "red"
      : "green";
    const textColor = mode === "light" ? "#000" : "#fff";
    const cardBg    = mode === "light" ? "#fff" : "#333";

    return (
      <View
        style={[
          styles.card,
          { borderLeftColor: borderColor, backgroundColor: cardBg },
        ]}
      >
        <Text style={[styles.name, { color: textColor }]}>
          {item.name}
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Approach Date: {item.close_approach_date}
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Velocity (km/h): {item.velocity_kph}
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Miss Distance (km): {item.miss_distance_km}
        </Text>
        <Text style={[styles.field, { color: textColor }]}>
          Potentially Hazardous:{" "}
          {item.is_potentially_hazardous_asteroid ? "Yes" : "No"}
        </Text>
      </View>
    );
  };

  return (
    <Animated.View style={animatedBg}>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderLeftWidth: 4,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    // shadows (iOS) & elevation (Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  field: {
    marginVertical: 2,
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
  },
});