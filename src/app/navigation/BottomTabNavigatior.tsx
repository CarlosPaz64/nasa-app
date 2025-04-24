// src/navigation/BottomTabNavigator.tsx
import React from "react";
import { useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import type { RootState } from "../store/store";

import ApodScreen from "../../presentation/views/principal/APODScreen";
import EpicScreen from "../../presentation/views/principal/EPICScreen";
import MarsGalleryScreen from "../../presentation/views/principal/MarsRoverPhotosScreen";
import NasaMediaScreen from "../../presentation/views/principal/NasaImagesScreen";
import AsteroidListScreen from "../../presentation/views/principal/AsteroidScreen";

const Tab = createBottomTabNavigator();

// Extraemos el tipo correcto para los nombres de ícono
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function BottomTabNavigator() {
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        // Escoge un icono según la ruta
        let iconName: IoniconName;
        switch (route.name) {
          case "APOD":
            iconName = isLight ? "sunny" : "moon";
            break;
          case "EPIC":
            iconName = "earth-outline";
            break;
          case "Mars":
            iconName = "planet";
            break;
          case "Nasa images":
            iconName = "images-outline";
            break;
          case "Asteroids":
            iconName = "alert-circle-outline";
            break;
          default:
            iconName = "ellipse-outline";
        }

        return {
          // Cabecera
          headerShown: false,
          headerTitle: route.name, 
          headerStyle: {
            backgroundColor: isLight ? "#fff" : "#222",
          },
          headerTintColor: isLight ? "#000" : "#fff",

          // Iconos del bottom
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={size} color={color} />
          ),
          tabBarActiveTintColor: isLight ? "#000" : "#fff",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: isLight ? "#fff" : "#222",
          },
        };
      }}
    >
      <Tab.Screen name="APOD" component={ApodScreen} />
      <Tab.Screen name="EPIC" component={EpicScreen} />
      <Tab.Screen name="Mars" component={MarsGalleryScreen} />
      <Tab.Screen name="Nasa images" component={NasaMediaScreen} />
      <Tab.Screen name="Asteroids" component={AsteroidListScreen} />
    </Tab.Navigator>
  );
}
