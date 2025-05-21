import React from "react";
// Hook de Redux para obtener estado global
// react-redux
import { useSelector } from "react-redux";
// Importación para crear la navegación por debajo
// @react-navigation/bottom-tabs
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// Librería de íconos
import { Ionicons } from "@expo/vector-icons";
// Tipo del estado raíz de mi store 
// export type RootState = ReturnType<typeof rootReducer>
import type { RootState } from "../store/store";

// Las vistas
import ApodScreen from "../../presentation/views/principal/APODScreen";
import EpicScreen from "../../presentation/views/principal/EPICScreen";
import MarsGalleryScreen from "../../presentation/views/principal/MarsRoverPhotosScreen";
import NasaMediaScreen from "../../presentation/views/principal/NasaImagesScreen";
import AsteroidListScreen from "../../presentation/views/principal/AsteroidScreen";

// Animaciones de react-native-reanimated para transiciones de pantalla
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

// instancia del bottomTabNavigator
const Tab = createBottomTabNavigator();

// Extraemos el tipo correcto para los nombres de ícono
type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

export default function BottomTabNavigator() {
  // Se crean las variables para el cambio de color
  // const mode = useSelector((s: RootState) => s.theme.mode);
  const mode = useSelector((s: RootState) => s.theme.mode);
  // Constante validador del tema claro
  // const isLight = mode === "light";
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
      {/* Pantalla APOD con animaciones de entrada y salida */}
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

      {/* Pantalla EPIC con deslizamiento vertical */}
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

      {/* Pantalla Mars con zoom */}
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

      {/* Pantalla Nasa images con rebote */}
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

      {/* Pantalla Asteroids con deslizamiento horizontal */}
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
