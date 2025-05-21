import React from "react";
import {
  View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { EPICEntity } from "../../../domain/entities/EPICEntity";

// Helper para formatear fechas en inglés
function getOrdinal(d: number) {
  if (d % 100 >= 11 && d % 100 <= 13) return "th";
  return ({1:"st",2:"nd",3:"rd"}[d%10]||"th");
}
function formatEnglish(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}${getOrdinal(day)} of ${year}`;
}

export default function EpicDetailModal() {
  const { params } = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<any>>();
  const { epic } = params as { epic: EPICEntity };

  // URL de la imagen full-res
  const dateOnly = epic.date.split(" ")[0].replace(/-/g, "/");
  const uri = `https://epic.gsfc.nasa.gov/archive/natural/${dateOnly}/png/${epic.image}.png`;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.close}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.date}>
          {formatEnglish(epic.date)}
        </Text>
        <Image source={{ uri }} style={styles.image} />

        <Text style={styles.caption}>{epic.caption}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Centroid Coordinates</Text>
          <Text style={styles.valueText}>Lat: {epic.centroid_coordinates.lat.toFixed(4)}</Text>
          <Text style={styles.valueText}>Lon: {epic.centroid_coordinates.lon.toFixed(4)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DSCOVR Position (J2000)</Text>
          <Text style={styles.valueText}>X: {epic.dscovr_j2000_position.x.toFixed(2)}</Text>
          <Text style={styles.valueText}>Y: {epic.dscovr_j2000_position.y.toFixed(2)}</Text>
          <Text style={styles.valueText}>Z: {epic.dscovr_j2000_position.z.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sun Position (J2000)</Text>
          <Text style={styles.valueText}>X: {epic.sun_j2000_position.x.toFixed(2)}</Text>
          <Text style={styles.valueText}>Y: {epic.sun_j2000_position.y.toFixed(2)}</Text>
          <Text style={styles.valueText}>Z: {epic.sun_j2000_position.z.toFixed(2)}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000",
  },
  close: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 24,
  },
  container: {
    paddingTop: 80,
    padding: 16,
    alignItems: "center",
  },
  date: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
  },
  image: {
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: 8,
    marginBottom: 16,
  },
  caption: {
    color: "#fff",
    fontStyle: "italic",
    marginBottom: 16,
  },
  section: {
    alignSelf: "stretch",
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#444",
    paddingTop: 8,
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 4,
  }, valueText: {
    color: "#fff",       // aquí el color blanco
    fontSize: 14,
    marginBottom: 2,
  },
});
