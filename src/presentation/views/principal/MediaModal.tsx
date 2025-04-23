// src/presentation/screens/MediaModal.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
// 🔥 Usa expo-av para vídeo
import { Video, ResizeMode } from "expo-av";

// Importa tu helper de API, no axios
import { NasaMediaAssetsFetch } from "../../../app/api/NasaAPI";

type RootStackParamList = {
  MediaModal: { href: string; render: "image" | "video"; assetHref?: string; };
};

export default function MediaModal() {
  const { params } = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { href, render, assetHref } = params as {
    href: string;
    render: "image" | "video";
    assetHref?: string
  };

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(render === "video");
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (render === "video" && assetHref) {
      // Llama al helper que internamente usa axios
      NasaMediaAssetsFetch(assetHref)
        .then(res => {
          // La API devuelve un objeto con collection.items
          const items = (res.data as any).collection.items as Array<{ href: string }>;
          const mp4 = items.find(item => item.href.endsWith(".mp4"))?.href;
          setVideoUrl(mp4 ?? null);
        })
        .catch(err => {
          console.error("Error al cargar assets de vídeo:", err);
          setVideoUrl(null);
        })
        .finally(() => setLoading(false));
    }
  }, [render, assetHref]);

  // Dimensiones
  const { width, height } = Dimensions.get("window");
  const mediaStyle = {
    width: width * 0.9,
    height: height * 0.8,
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.close}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {render === "image" && (
        <Image
          source={{ uri: href }}
          style={[styles.media, mediaStyle]}
          resizeMode="contain"
        />
      )}

      {render === "video" && loading && (
        <ActivityIndicator size="large" color="#fff" />
      )}

      {render === "video" && !loading && videoUrl && Platform.OS !== "web" && (
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={[styles.media, mediaStyle]}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping={false}
          onError={error => {
            console.error("Mira tu error: ", error)
          }}
        />
      )}

      {render === "video" && !loading && videoUrl && Platform.OS === "web" && (
        // En web simplemente uso la etiqueta <video>
        <video
          src={videoUrl}
          controls
          style={{
            width: mediaStyle.width,
            height: mediaStyle.height,
          }}
        />
      )}

      {render === "video" && !loading && !videoUrl && (
        <Text style={styles.errorText}>
          No se encontró un vídeo válido para reproducir.
        </Text>
      )}
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
    top: 40,
    right: 20,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: "#FFF",
  },
  media: {
    borderRadius: 8,
  },
  errorText: {
    color: "#fff",
    marginTop: 16,
  },
});