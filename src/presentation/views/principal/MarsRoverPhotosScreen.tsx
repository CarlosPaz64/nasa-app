// src/presentation/screens/MarsGalleryScreen.tsx
import React, { useEffect, memo, useCallback } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useMarsRoverViewModel } from "../../viewmodels/UseMarsRoverPhotosViewModel";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  interpolateColor,
  FadeIn,
  Layout,
  interpolate,
} from "react-native-reanimated";

// Constantes de layout
const { width } = Dimensions.get("window");
const NUM_COLUMNS = 2;
const MARGIN = 8;
const CARD_SIZE = (width - MARGIN * (NUM_COLUMNS + 1)) / NUM_COLUMNS;

// Props del componente AnimatedCard
interface AnimatedCardProps {
  item: { id: number; img_src: string };
  index: number;
  scrollY: Animated.SharedValue<number>;
}

// 🚀 Componente de tarjeta animada, memoizado para evitar re-renders innecesarios
const AnimatedCard = memo(({ item, index, scrollY }: AnimatedCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  // ① Estilo parallax basado en scrollY
  const inputRange = [
    (index - 2) * (CARD_SIZE + MARGIN),
    index * (CARD_SIZE + MARGIN),
  ];
  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY:
          scrollY.value < 0
            ? 0
            : interpolate(scrollY.value, inputRange, [0, -20], "clamp"),
      },
    ],
  }));

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("MarsHDPhoto", { mars: item })}
      activeOpacity={0.8}
      style={{ margin: MARGIN / 2 }}
    >
      <Animated.View
        entering={FadeIn.springify()}
        layout={Layout.springify()}
        style={[styles.card, cardStyle]}
      >
        <Image source={{ uri: item.img_src }} style={styles.image} />
      </Animated.View>
    </TouchableOpacity>
  );
});
AnimatedCard.displayName = "AnimatedCard";

export default function MarsGalleryScreen() {
  const { data, loading, error, hasMore, loadMore } =
    useMarsRoverViewModel();
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  // Fondo animado al cambiar tema
  const bgProgress = useSharedValue(isLight ? 1 : 0);
  useEffect(() => {
    bgProgress.value = withTiming(isLight ? 1 : 0, { duration: 500 });
  }, [isLight]);
  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      bgProgress.value,
      [0, 1],
      ["#222222", "#FFFFFF"]
    ),
  }));

  // Scroll handler para parallax
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const colors = {
    background: isLight ? "#FFFFFF" : "#222222",
    text: isLight ? "#000000" : "#FFFFFF",
  };

  // Callback memoizado para renderizar cada tarjeta
  const renderCard = useCallback(
    ({ item, index }: { item: { id: number; img_src: string }; index: number }) => (
      <AnimatedCard item={item} index={index} scrollY={scrollY} />
    ),
    [scrollY]
  );

  if (loading && data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }
  if (error && data.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
      </View>
    );
  }

  return (
    <Animated.View style={bgStyle}>
      <Animated.FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={renderCard}

        // Props de virtualización para mejor rendimiento
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={5}
        removeClippedSubviews={true}

        // getItemLayout para evitar mediciones
        getItemLayout={(_, index) => ({
          length: CARD_SIZE + MARGIN,
          offset: (CARD_SIZE + MARGIN) * index,
          index,
        })}

        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator style={styles.footer} color={colors.text} />
          ) : null
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
  },
  listContent: {
    padding: MARGIN / 2,
  },
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  footer: {
    marginVertical: 16,
  },
});