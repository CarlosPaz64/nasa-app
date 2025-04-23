// src/presentation/screens/IntroScreen.tsx
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
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Intro: undefined;
  Home: undefined;
  HDPhotoModal: { uri: string };
};

const { width } = Dimensions.get("window");

export default function IntroScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, "Intro">>();

  // Rocket float animation: sharedValue cycles between +0 and -20
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

  // Button press animation
  const scale = useSharedValue(1);
  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Floating Rocket */}
      <Animated.View style={[styles.rocketContainer, floatStyle]}>
        <Ionicons name="rocket" size={64} color="#ff3b30" />
      </Animated.View>

      {/* Intro Text */}
      <Text style={styles.heading}>Welcome to NASA Explorer</Text>
      <Text style={styles.paragraph}>
        • Use the <Text style={styles.bold}>bottom tabs</Text> to navigate:
      </Text>
      <Text style={styles.paragraph}>
        ‣ <Text style={styles.bold}>APOD</Text> – Astronomy Picture of the Day{"\n"}
        ‣ <Text style={styles.bold}>EPIC</Text> – Earth Polychromatic Imaging{"\n"}
        ‣ <Text style={styles.bold}>Mars</Text> – Mars rover photos{"\n"}
        ‣ <Text style={styles.bold}>Library</Text> – NASA image & video library{"\n"}
        ‣ <Text style={styles.bold}>Asteroids</Text> – Near‑Earth objects & hazards
      </Text>
      <Text style={styles.paragraph}>
        • Open the side menu to enter one of three{" "}
        <Text style={styles.bold}>NASA Contests</Text>:
      </Text>
      <Text style={styles.paragraph}>
        ‣ Visit NASA facilities!{"\n"}
        ‣ Win beautiful moon rocks!{"\n"}
        ‣ Take a trip to space!{"\n"}
        ‣ Get a telescope for free!
      </Text>

      {/* Begin Button */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    backgroundColor: "#0B0C10",
    padding:        24,
    justifyContent: "center",
  },
  rocketContainer: {
    alignSelf: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize:   28,
    fontWeight: "bold",
    color:      "#66FCF1",
    textAlign:  "center",
    marginBottom: 16,
  },
  paragraph: {
    fontSize:   16,
    color:      "#C5C6C7",
    marginBottom: 12,
    lineHeight: 22,
  },
  bold: {
    color:      "#FFFFFF",
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
    color:      "#0B0C10",
    fontSize:   18,
    fontWeight: "bold",
  },
});