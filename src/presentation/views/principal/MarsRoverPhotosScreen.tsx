// src/presentation/screens/MarsGalleryScreen.tsx
import React from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useMarsRoverViewModel } from "../../viewmodels/UseMarsRoverPhotosViewModel";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";

const { width } = Dimensions.get("window");
// Definimos cuántas columnas queremos:
const NUM_COLUMNS = 2;
// Margen exterior entre “cards”:
const MARGIN = 8;
// Calculamos el tamaño de cada card restando los márgenes totales:
const CARD_SIZE = (width - MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

export default function MarsGalleryScreen() {
  const { data, loading, error, hasMore, loadMore } =
    useMarsRoverViewModel();
  const mode = useSelector((s: RootState) => s.theme.mode);

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        // Retiramos alignItems: "center"
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.img_src }}
              style={styles.image}
            />
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator style={styles.footer} color={colors.text} />
          ) : null
        }
      />
    </View>
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