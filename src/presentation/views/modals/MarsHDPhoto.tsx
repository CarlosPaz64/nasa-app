import React from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { MarsRoverPhotosEntity } from "../../../domain/entities/MarsRoverPhotosEntity";

type RootStackParamList = {
  MarsHDPhoto: { mars: MarsRoverPhotosEntity };
};

export default function MarsHDPhoto() {
  const { params } = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { mars } = (params as any) as { mars: MarsRoverPhotosEntity };

  const { width, height } = Dimensions.get("window");
  const imgStyle = { width: width * 0.9, height: height * 0.7 };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.close}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={{ uri: mars.img_src }}
          style={[styles.image, imgStyle]}
          resizeMode="contain"
        />
        <Text style={styles.title}>
          {mars.rover.name} — {mars.camera.full_name}
        </Text>
        <Text style={styles.meta}>Sol (marte-day): {mars.sol}</Text>
        <Text style={styles.meta}>Earth date: {mars.earth_date}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  close: {
    position: "absolute",
    top: Platform.OS === "web" ? 20 : 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: "#fff",
  },
  container: {
    paddingTop: Platform.OS === "web" ? 40 : 80,
    alignItems: "center",
  },
  image: {
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  meta: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 4,
  },
});
