// src/presentation/screens/IntroScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../app/store/store";

// Tus thunks:
import { GetTheAPOD }       from "../../../app/slices/APODSlice";
import { GetEPICTheme }     from "../../../app/slices/EPICSlice";
import { fetchMarsRoverPhotos } from "../../../app/slices/MarsRoverPhotosSlice";
import { fetchNasaImages }     from "../../../app/slices/NasaImageSlice";
import { fetchAsteroids }      from "../../../app/slices/AsteroidSlice";

type RootStackParamList = {
  Intro: undefined;
  Home:  undefined;
};

const { width } = Dimensions.get("window");

export default function IntroScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Intro">>();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string| null>(null);

  // 1) Al montarse, disparo prefetch de todas las thunks
  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          dispatch(GetTheAPOD()).unwrap(),
          dispatch(GetEPICTheme()).unwrap(),
          dispatch(fetchMarsRoverPhotos()).unwrap(),
          dispatch(fetchNasaImages({ query: "nasa" })).unwrap(),
          dispatch(fetchAsteroids()).unwrap(),
        ]);
      } catch (err: any) {
        setError(typeof err === "string" ? err : err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  // 2) Animación del cohete
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(
      withTiming(-20, {
        duration: 2000,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
  }, []);
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  // 3) Animación del botón
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Rocket flotante */}
      <Animated.View style={[styles.rocketContainer, floatStyle]}>
        <Ionicons name="rocket" size={64} color="#ff3b30" />
      </Animated.View>

      {/* Texto de introducción */}
      <Text style={styles.heading}>Welcome to NASA Explorer</Text>
      <Text style={styles.paragraph}>
        • Use the <Text style={styles.bold}>bottom tabs</Text> to navigate:
      </Text>
      <Text style={styles.paragraph}>
        ‣ <Text style={styles.bold}>APOD</Text> – Astronomy Picture of the Day{'\n'}
        ‣ <Text style={styles.bold}>EPIC</Text> – Earth Polychromatic Imaging{'\n'}
        ‣ <Text style={styles.bold}>Mars</Text> – Mars rover photos{'\n'}
        ‣ <Text style={styles.bold}>Library</Text> – NASA image & video library{'\n'}
        ‣ <Text style={styles.bold}>Asteroids</Text> – Near-Earth objects & hazards
      </Text>

      {/* Si hay error de precarga */}
      {error && (
        <Text style={styles.errorText}>
          ⚠️ {error}
        </Text>
      )}

      {/* Spinner mientras carga */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#66FCF1" />
          <Text style={styles.loadingText}>Loading data…</Text>
        </View>
      )}

      {/* Botón Begin! sólo aparece tras cargar */}
      {!loading && !error && (
        <Pressable
          onPress={() => {
            scale.value = withSpring(0.9);
            setTimeout(() => {
              scale.value = withSpring(1);
              navigation.replace("Home");
            }, 100);
          }}
          style={styles.buttonWrapper}
        >
          <Animated.View style={[styles.button, scaleStyle]}>
            <Text style={styles.buttonText}>Begin!</Text>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: "#0B0C10",
    padding:         24,
    justifyContent:  "center",
  },
  rocketContainer: {
    alignSelf:   "center",
    marginBottom: 24,
  },
  heading: {
    fontSize:     28,
    fontWeight:   "bold",
    color:        "#66FCF1",
    textAlign:    "center",
    marginBottom: 16,
  },
  paragraph: {
    fontSize:     16,
    color:        "#C5C6C7",
    marginBottom: 12,
    lineHeight:   22,
  },
  bold: {
    color:      "#FFFFFF",
    fontWeight: "600",
  },
  loadingContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color:     "#66FCF1",
  },
  errorText: {
    marginTop:   16,
    color:       "tomato",
    textAlign:   "center",
    fontSize:    14,
  },
  buttonWrapper: {
    marginTop:   32,
    alignItems:  "center",
  },
  button: {
    backgroundColor: "#45A29E",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius:    32,
    elevation:       4,
  },
  buttonText: {
    color:      "#0B0C10",
    fontSize:   18,
    fontWeight: "bold",
  },
});