// src/presentation/screens/IntroScreen.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Define aquí tus rutas de stack
type RootStackParamList = {
  Intro:    undefined;
  Main:     undefined;
  HDPhotoModal: { uri: string };
};

export default function IntroScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Intro">>();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Welcome! Tap below to start exploring NASA data.
      </Text>
      <Button
        title="Begin!"
        onPress={() => navigation.replace("Main")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    justifyContent: "center",
    alignItems:     "center",
    padding:        16,
  },
  text: {
    fontSize:   18,
    marginBottom: 24,
    textAlign:  "center",
  },
});