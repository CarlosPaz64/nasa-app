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

import Animated, {  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutUp,
  ZoomIn,
  ZoomOut,
  BounceInRight,
  BounceOutRight,
  SlideInLeft,
  SlideOutLeft, } from "react-native-reanimated";

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
      <Tab.Screen name="APOD" options={{ headerShown: false }}>
        {() => (
          <Animated.View
            style={{ flex: 1 }}
            entering={FadeIn.duration(500)}
            exiting={FadeOut.duration(300)}
          >
            <ApodScreen />
          </Animated.View>
        )}
      </Tab.Screen>

      <Tab.Screen name="EPIC" options={{ headerShown: false }}>
        {() => (
          <Animated.View
            style={{ flex: 1 }}
            entering={SlideInDown.springify()}
            exiting={SlideOutUp.springify()}
          >
            <EpicScreen />
          </Animated.View>
        )}
      </Tab.Screen>

      <Tab.Screen name="Mars">
        {() => (
          <Animated.View
            style={{ flex: 1 }}
            entering={ZoomIn.duration(400)}
            exiting={ZoomOut.duration(300)}
          >
            <MarsGalleryScreen />
          </Animated.View>
        )}
      </Tab.Screen>

      <Tab.Screen name="Nasa images">
        {() => (
          <Animated.View
            style={{ flex: 1 }}
            entering={BounceInRight.duration(500)}
            exiting={BounceOutRight.duration(400)}
          >
            <NasaMediaScreen />
          </Animated.View>
        )}
      </Tab.Screen>

      <Tab.Screen name="Asteroids">
        {() => (
          <Animated.View
            style={{ flex: 1 }}
            entering={SlideInLeft.duration(400)}
            exiting={SlideOutLeft.duration(300)}
          >
            <AsteroidListScreen />
          </Animated.View>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
