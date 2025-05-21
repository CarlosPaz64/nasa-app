import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Main: undefined;
  HDPhotoModal: { uri: string };
};

export default function HDPhotoModal() {
  const { params }   = useRoute();
  const navigation   = useNavigation<NativeStackNavigationProp<RootStackParamList, "HDPhotoModal">>();
  const uri          = (params as any).uri as string;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.pop()}
      >
        <Text style={styles.closeText}>Cerrar</Text>
      </TouchableOpacity>

      <Image
        source={{ uri }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // overlay semitransparente
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: "90%",
    height: "80%",
  },
});