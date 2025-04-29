import React, { useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useMarsRoverViewModel } from "../../viewmodels/UseMarsRoverPhotosViewModel";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
// Para la navegación
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor
} from 'react-native-reanimated';


const { width } = Dimensions.get("window");
// Definimos cuántas columnas queremos:
const NUM_COLUMNS = 2;
// Margen exterior entre “cards”:
const MARGIN = 8;
// Calculamos el tamaño de cada card restando los márgenes totales:
const CARD_SIZE = (width - MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function MarsGalleryScreen() {
    // constante de la navegación
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { data, loading, error, hasMore, loadMore } =
    useMarsRoverViewModel();
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  // ② Configura la animación de fondo
  const progress = useSharedValue(isLight ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(isLight ? 1 : 0, { duration: 500 });
  }, [isLight]);
  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#222222", "#FFFFFF"]
    ),
  }));


  const colors = {
    background: mode === "light" ? "#FFFFFF" : "#222222",
    text:       mode === "light" ? "#000000" : "#FFFFFF",
  };

  if (loading && data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error && data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <Animated.View style={bgStyle}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("MarsHDPhoto", { mars: item })
            }
            activeOpacity={0.8}
          >
            <View style={styles.card}>
              <Image source={{ uri: item.img_src }} style={styles.image} />
            </View>
          </TouchableOpacity>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator style={styles.footer} color={colors.text} />
          ) : null
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
  },
  errorText: {
    fontSize: 16,
  },
  listContent: {
    // Padding alrededor y de cada card
    padding: MARGIN,
  },
  card: {
    width:        CARD_SIZE,
    height:       CARD_SIZE,
    marginBottom: MARGIN,
    marginRight:  MARGIN,
    // Para que la última card de cada fila no tenga margen derecho
    // RN maneja bien el wrap sin necesidad de chequear índice
  },
  image: {
    width:       "100%",
    height:      undefined,
    aspectRatio: 1,       // siempre cuadrada
    borderRadius: 8,
  },
  footer: {
    marginVertical: 16,
  },
});