// src/presentation/screens/NasaMediaScreen.tsx
import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

import { useNasaMediaViewModel } from "../../viewmodels/UseNasaImagesViewModel";
import type { NasaMediaEntity } from "../../../domain/entities/NasaImageEntity";
import type { RootState } from "../../../app/store/store";

type RootStackParamList = {
  MediaModal: {
    href: string;              // url de preview (imagen o thumbnail de vídeo)
    render: "image" | "video"; // tipo de media
    assetHref?: string;        // si es vídeo, aquí el href al JSON de assets
  };
};

const { width, height } = Dimensions.get("window");
const LIGHT_BG = "#FFFFFF";
const DARK_BG  = "#222222";

export default function NasaMediaScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // 1) Tema global
  const mode = useSelector((s: RootState) => s.theme.mode);

  // 2) Animación de fondo
  const progress = useSharedValue(mode === "light" ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(mode === "light" ? 1 : 0, { duration: 500 });
  }, [mode]);
  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [DARK_BG, LIGHT_BG]
    ),
  }));

  // 3) Lógica del buscador + datos
  const {
    query,
    setQuery,
    includeVideos,
    setIncludeVideos,
    data,
    loading,
    error,
    search,
  } = useNasaMediaViewModel();

  // 4) renderItem: pasamos preview + assetHref
  const renderItem = ({ item }: { item: NasaMediaEntity }) => {
    const preview = item.preview;
    const isVideo = item.media_type === "video";
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("MediaModal", {
            href: preview,
            render: isVideo ? "video" : "image",
            assetHref: isVideo ? item.assetsHref : undefined,
          })
        }
      >
        <Image source={{ uri: preview }} style={styles.image} />
        <Text
          style={[
            styles.title,
            { color: mode === "light" ? "#000" : "#FFF" },
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={bgStyle}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: mode === "light" ? "#FFF" : "#444",
              color: mode === "light" ? "#000" : "#FFF",
              borderColor: mode === "light" ? "#888" : "#666",
            },
          ]}
          placeholder="Search NASA..."
          placeholderTextColor={mode === "light" ? "#888" : "#999"}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          returnKeyType="search"
        />
        <Button title="Go" onPress={search} />
      </View>

      {/* Switch para incluir vídeos */}
      <View style={styles.toggleRow}>
        <Text style={{ color: mode === "light" ? "#000" : "#FFF" }}>
          Include Videos
        </Text>
        <Switch value={includeVideos} onValueChange={setIncludeVideos} />
      </View>

      {/* Estado de carga / error */}
      {loading && <ActivityIndicator style={{ margin: 16 }} />}
      {error && (
        <Text
          style={[
            styles.errorText,
            { color: mode === "light" ? "red" : "#f88" },
          ]}
        >
          {error}
        </Text>
      )}

      {/* Lista de resultados */}
      <FlatList
        data={data}
        keyExtractor={(i) => i.nasa_id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginRight: 8,
    height: 40,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 8,
  },
  list: {
    padding: 8,
    paddingBottom: 32,
  },
  card: {
    flex: 1,
    margin: 4,
    alignItems: "center",
  },
  image: {
    width: (width / 2) - 16,
    height: (width / 2) - 16,
    borderRadius: 8,
  },
  title: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
});