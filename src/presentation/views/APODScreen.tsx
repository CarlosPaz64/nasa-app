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
import { UseApodViewModel } from "../viewmodels/UseAPODViewModel";

export default function ApodScreen() {
  const { data, loading, error, refetch } = UseApodViewModel();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Error: {error}</Text>
        <Button title="Reintentar" onPress={refetch} />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No hay datos disponibles.</Text>
        <Button title="Cargar de nuevo" onPress={refetch} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{data.title}</Text>
      <Image source={{ uri: data.url }} style={styles.image} />
      <Text style={styles.date}>{data.date}</Text>
      <Text style={styles.explanation}>{data.explanation}</Text>
      {data.hdurl && (
        <Button
          title="Ver en alta resolución"
          onPress={() => {
            /* por ejemplo, navegar a un modal con la imagen hdurl */
          }}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  image: { width: "100%", height: 250, marginBottom: 12, borderRadius: 8 },
  date: { fontSize: 16, color: "#666", marginBottom: 8 },
  explanation: { fontSize: 14, lineHeight: 20 },
  error: { color: "red", marginBottom: 8 },
});