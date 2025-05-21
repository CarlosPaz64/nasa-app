import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// Componente para reproducir animaciones Lottie en React Native  
import LottieView from "lottie-react-native";
import meteorAnim from "../../../../assets/animations/detail_meteor.json";
import type { AsteroidEntity } from "../../../domain/entities/AsteroidEntity";

type RouteParams = {
  asteroid: AsteroidEntity;
};

export default function AsteroidDetailModal() {
  const { params } = useRoute();
  // Obtenemos los parámetros de la ruta actual
  const { asteroid } = params as RouteParams;
  // Hacemos un cast de params para extraer el objeto asteroid
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  // Obtenemos el objeto navigation para controlar la navegación (goBack, etc.)

  // Propiedades a mostrar
  const {
    name,
    close_approach_date,
    velocity_kph,
    miss_distance_km,
    is_potentially_hazardous_asteroid,
  } = asteroid;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* animación en la parte superior */}
      {Platform.OS !== "web" && (
        <LottieView
          source={meteorAnim}
          autoPlay
          loop={false}
          style={styles.animation}
        />
      )}

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Approach Date:</Text>
          <Text style={styles.value}>{close_approach_date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Velocity (km/h):</Text>
          <Text style={styles.value}>{velocity_kph}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Miss Distance (km):</Text>
          <Text style={styles.value}>{miss_distance_km}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Hazardous:</Text>
          <Text
            style={[
              styles.value,
              is_potentially_hazardous_asteroid
                ? styles.hazardYes
                : styles.hazardNo,
            ]}
          >
            {is_potentially_hazardous_asteroid ? "Yes" : "No"}
          </Text>
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
  closeBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: "#fff",
  },
  animation: {
    width: width * 0.6,
    height: width * 0.6,
    alignSelf: "center",
    marginTop: 80,
  },
  content: {
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    flex: 1,
    color: "#aaa",
    fontWeight: "600",
  },
  value: {
    flex: 1,
    color: "#fff",
    fontWeight: "400",
  },
  hazardYes: {
    color: "tomato",
    fontWeight: "700",
  },
  hazardNo: {
    color: "limegreen",
    fontWeight: "700",
  },
});