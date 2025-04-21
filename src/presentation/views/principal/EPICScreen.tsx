import React, { useEffect } from "react";
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator, Button } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import { useSelector }           from "react-redux";
import { useEpicViewModel } from "../../viewmodels/UseEPICViewModel";
import type { RootState } from "../../../app/store/store";

export default function EpicScreen() {
  // Lógica de datos
  const { epics, loading, error, reload } = useEpicViewModel();
  // Tema global
  const mode = useSelector((s: RootState) => s.theme.mode);

  // Animación de fondo global
  const progress = useSharedValue(mode === "light" ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(mode === "light" ? 1 : 0, { duration: 500 });
  }, [mode]);

  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#222222", "#FFFFFF"]
    ),
  }));

  // UI
  if (loading) {
    return (
      <Animated.View style={[styles.center, bgStyle]}>
        <ActivityIndicator size="large" color={mode === "light" ? "#000" : "#fff"} />
      </Animated.View>
    );
  }

  if (error) {
    return (
      <Animated.View style={[styles.center, bgStyle]}>
        <Text style={{ color: mode === "light" ? "#000" : "#fff", marginBottom: 8 }}>{error}</Text>
        <Button title="Reintentar" onPress={reload} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <FlatList
        data={epics}
        keyExtractor={(item) => item.identifier}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          // Construir URL de la imagen EPIC
          const dateOnly = item.date.split(" ")[0].replace(/-/g, "/");
          const uri = `https://epic.gsfc.nasa.gov/archive/natural/${dateOnly}/png/${item.image}.png`;

          return (
            <View style={[styles.card, { backgroundColor: mode === "light" ? "#eee" : "#333" }]}>
              <Text style={[styles.title, { color: mode === "light" ? "#000" : "#fff" }]}>
                {item.date}
              </Text>
              <Image source={{ uri }} style={styles.image} />
              <Text style={[styles.caption, { color: mode === "light" ? "#000" : "#fff" }]}>
                {item.caption}
              </Text>

              {/* Ejemplo de datos extra */}
              <View style={styles.coords}>
                <Text style={{ color: mode === "light" ? "#000" : "#fff" }}>
                  Centroid: {item.centroid_coordinates.lat.toFixed(2)}, {item.centroid_coordinates.lon.toFixed(2)}
                </Text>
                <Text style={{ color: mode === "light" ? "#000" : "#fff" }}>
                  DSCOVR Pos: {item.dscovr_j2000_position.x.toFixed(0)}, {item.dscovr_j2000_position.y.toFixed(0)}, …
                </Text>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.button}>
        <Button title="Reload EPIC" onPress={reload} color={mode === "light" ? undefined : "gray"} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center:    { flex: 1, justifyContent: "center", alignItems: "center" },
  list:      { padding: 12 },
  card:      { marginBottom: 16, borderRadius: 8, overflow: "hidden", padding: 8 },
  title:     { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  image:     { width: "100%", height: 200, borderRadius: 6, marginBottom: 4 },
  caption:   { fontSize: 12, marginBottom: 4 },
  coords:    { padding: 4, borderTopWidth: 1, borderColor: "#999" },
  button:    { position: "absolute", bottom: 20, left: 20, right: 20 },
});
