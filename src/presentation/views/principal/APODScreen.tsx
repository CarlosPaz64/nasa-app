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
import { UseApodViewModel } from "../../viewmodels/UseAPODViewModel";
import type { RootState } from "../../../app/store/store";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Definición de los parámetros para la vista modal con la fotografía en HD
type RootStackParamList = {
  Main: undefined;
  HDPhotoModal: { uri: string };
};

/** Devuelve el sufijo ordinal para un día dado */
function getOrdinalSuffix(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

/** Formatea "2025-04-07" → "April 7th of 2025" */
function formatDateEnglish(isoDate: string): string {
  const d = new Date(isoDate);
  const day = d.getDate();
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear();
  const suffix = getOrdinalSuffix(day);
  return `${month} ${day}${suffix} of ${year}`;
}

export default function ApodScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data, loading, error, refetch } = UseApodViewModel();
  const mode = useSelector((s: RootState) => s.theme.mode);

  const colors = {
    background: mode === "light" ? "#FFFFFF" : "#222222",
    text: mode === "light" ? "#000000" : "#FFFFFF",
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator
          size="large"
          color={colors.text}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.text }]}>
          Error: {error}
        </Text>
        <Button
          title="Reintentar"
          color={mode === "light" ? undefined : "#FFFFFF"}
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
          color={mode === "light" ? undefined : "#FFFFFF"}
          onPress={refetch}
        />
      </View>
    );
  }

  // Aquí usamos formatDateEnglish en lugar de data.date
  const englishDate = formatDateEnglish(data.date);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <Text style={[styles.date, { color: colors.text }]}>
        {englishDate}
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>
        {data.title}
      </Text>
      <Image source={{ uri: data.url }} style={styles.image} />
      <Text style={[styles.explanation, { color: colors.text }]}>
        {data.explanation}
      </Text>
      {data.hdurl && (
        <Button
          title="See photo in high definition"
          color={mode === "light" ? undefined : "gray"}
          onPress={() =>
            navigation.navigate("HDPhotoModal", { uri: data.hdurl })
          }
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
  date: { fontSize: 16, marginBottom: 4, fontStyle: "italic" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  image: { width: "100%", height: 250, marginBottom: 12, borderRadius: 8 },
  explanation: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  error: { fontSize: 16, marginBottom: 8 },
});