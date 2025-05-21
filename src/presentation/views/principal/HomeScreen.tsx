import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Parám para navegación tras intro
type RootStackParamList = {
  Intro: undefined;
  Home: undefined;
};

const { height } = Dimensions.get("window");

export default function IntroScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Intro">>();

  // Shared value para movimiento flotante
  const float = useSharedValue(0);
  useEffect(() => {
    // movimiento suave de vaivén
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

  // Shared value para lanzamiento
  const launch = useSharedValue(0);
  const launchStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: launch.value }],
  }));

  // Maneja el press: escala y lanza el cohete
  const handleBegin = () => {
    // dispara efecto de botón
    const scale = withSpring(0.9);
    // lanzamos flotación breve
    float.value = withSpring(0); // detiene vaivén
    // animamos lanzamiento hasta fuera de pantalla
    launch.value = withTiming(
      -height,
      { duration: 600, easing: Easing.in(Easing.quad) },
      (finished) => {
        if (finished) {
          runOnJS(navigation.replace)("Home");
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      {/* Rocket flotante y lanzamiento */}
      <Animated.View style={[styles.rocketContainer, floatStyle, launchStyle]}>  
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
      <Text style={styles.paragraph}>
        • Open the side menu to enter one of three{" "}
        <Text style={styles.bold}>NASA Contests</Text>:
      </Text>
      <Text style={styles.paragraph}>
        ‣ Visit<Text style={styles.bold}> NASA </Text>facilities!{"\n"}
        ‣ Win beautiful <Text style={styles.bold}>MOON ROCKS!</Text>{"\n"}
        ‣ Take a <Text style={styles.bold}>TRIP TO SPACE!</Text>{"\n"}
        ‣ Get a <Text style={styles.bold}>TELESCOPE</Text> for <Text style={styles.bold}>FREE!</Text>
      </Text>
      <Text style={styles.paragraph}>
        • You can also change the color theme in the side menu!{" "}
      </Text>
      <Text style={styles.heading}>
        Remember to STAY ONLINE to use this explorer!
      </Text>

      {/* Botón Begin! siempre visible ahora */}
      <Pressable onPress={handleBegin} style={styles.buttonWrapper}>
        <Animated.View style={[styles.button]}>
          <Text style={styles.buttonText}>Begin!</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0C10",
    padding: 24,
    justifyContent: "center",
  },
  rocketContainer: {
    alignSelf: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#66FCF1",
    textAlign: "center",
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    color: "#C5C6C7",
    marginBottom: 12,
    lineHeight: 22,
  },
  bold: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  buttonWrapper: {
    marginTop: 32,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#45A29E",
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 32,
    elevation: 4,
  },
  buttonText: {
    color: "#0B0C10",
    fontSize: 18,
    fontWeight: "bold",
  },
});