// src/presentation/screens/ApodScreen.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { UseApodViewModel } from "../viewmodels/UseAPODViewModel";
import type { RootState } from "../../app/store/store";

export default function ApodScreen() {
  const { data, loading, error, refetch } = UseApodViewModel();
  // 1) Nos suscribimos al modo actual
  const mode = useSelector((s: RootState) => s.theme.mode);

  // 2) Definimos colores dinámicos
  const colors = {
    background: mode === "light" ? "#fff" : "#000",
    text:       mode === "light" ? "#000" : "#fff",
    secondary:  mode === "light" ? "#666" : "#aaa",
    error:      mode === "light" ? "red" : "#f88",
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.error }]}>
          Error: {error}
        </Text>
        <Button
          title="Reintentar"
          color={mode === "light" ? undefined : "#fff"}
          onPress={refetch}
        />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No hay datos disponibles.</Text>
        <Button
          title="Cargar de nuevo"
          color={mode === "light" ? undefined : "#fff"}
          onPress={refetch}
        />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {data.title}
      </Text>
      <Image source={{ uri: data.url }} style={styles.image} />
      <Text style={[styles.date, { color: colors.secondary }]}>
        {data.date}
      </Text>
      <Text style={[styles.explanation, { color: colors.text }]}>
        {data.explanation}
      </Text>
      {data.hdurl && (
        <Button
          title="Ver en alta resolución"
          color={mode === "light" ? undefined : "#fff"}
          onPress={() => {
            /* navega a un modal con la HD url */
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: { padding: 16, flexGrow: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  image: { width: "100%", height: 250, marginBottom: 12, borderRadius: 8 },
  date: { fontSize: 16, marginBottom: 8 },
  explanation: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  error: { marginBottom: 8 },
});