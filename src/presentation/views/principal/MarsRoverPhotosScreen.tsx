// src/presentation/screens/MarsGalleryScreen.tsx
import React from "react";
import {
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { useMarsRoverViewModel } from "../../viewmodels/UseMarsRoverPhotosViewModel";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";

export default function MarsGalleryScreen() {
  // 1) Datos y estado de la galería
  const { data, loading, error, hasMore, loadMore } =
    useMarsRoverViewModel();

  // 2) Modo de tema global
  const mode = useSelector((s: RootState) => s.theme.mode);

  // 3) Colores dinámicos (idénticos a ApodScreen)
  const colors = {
    background: mode === "light" ? "#FFFFFF" : "#222222",
    text:       mode === "light" ? "#000000" : "#FFFFFF",
  };

  // 4) UI de carga
  if (loading && data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  // 5) UI de error
  if (error && data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error}
        </Text>
      </View>
    );
  }

  // 6) Lista principal
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.img_src }}
            style={styles.image}
          />
        )}
        // Infinite scroll
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
    fontSize:   16,
  },
  listContent: {
    padding:       8,
    alignItems:    "center",
    justifyContent:"center",
  },
  image: {
    width:    "48%",
    height:   150,
    margin:   "1%",
    borderRadius: 8,
  },
  footer: {
    marginVertical: 16,
  },
});