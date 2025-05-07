// src/presentation/screens/MarsGalleryScreen.tsx
import React, { useEffect, memo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
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
  interpolate,
} from "react-native-reanimated";

// wrap FlatList into an animated component
import type { FlatListProps } from "react-native";
// Wrap FlatList with Animated, telling TS it's FlatListProps<Photo>
const AnimatedFlatList = Animated.createAnimatedComponent<FlatListProps<Photo>>(FlatList);

const { width } = Dimensions.get("window");
const MARGIN = 8;
const NUM_COLUMNS = 2;

type Photo = { id: number; img_src: string };

interface AnimatedCardProps {
  item: Photo;
  index: number;
  scrollY: Animated.SharedValue<number>;
}

const AnimatedCard = memo(({ item, index, scrollY }: AnimatedCardProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const cardSize = width / NUM_COLUMNS - MARGIN;

  const inputRange = [
    (index - 1) * (cardSize + MARGIN),
    index * (cardSize + MARGIN),
  ];
  const animatedStyle = useAnimatedStyle(() => {
    const t = scrollY.value < inputRange[0]
      ? 0
      : scrollY.value > inputRange[1]
      ? -20
      : interpolate(scrollY.value, inputRange, [0, -20], "clamp");
    return { transform: [{ translateY: t }] };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate("MarsHDPhoto", { mars: item })}
      style={[styles.cardWrapper, { width: cardSize, height: cardSize }]}
    >
      <Animated.View style={[styles.card, animatedStyle]}>  
        <Image source={{ uri: item.img_src }} style={styles.image} />
      </Animated.View>
    </TouchableOpacity>
  );
});
AnimatedCard.displayName = "AnimatedCard";

export default function MarsGalleryScreen() {
  const { data, loading, error, hasMore, loadMore } = useMarsRoverViewModel();
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  const progress = useSharedValue(isLight ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(isLight ? 1 : 0, { duration: 500 });
  }, [isLight]);
  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#222222", "#FFFFFF"]
    ),
  }));

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => { scrollY.value = e.contentOffset.y; },
  });

  return (
    <Animated.View style={bgStyle}>
      <AnimatedFlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        numColumns={NUM_COLUMNS}
        contentContainerStyle={styles.listContent}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item, index }: { item: Photo; index: number }) => (
          <AnimatedCard item={item} index={index} scrollY={scrollY} />
        )}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        removeClippedSubviews
        getItemLayout={(_, index) => ({
          length: width / NUM_COLUMNS,
          offset: (width / NUM_COLUMNS + MARGIN) * index,
          index,
        })}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <ActivityIndicator style={styles.footer} color={isLight ? "#000" : "#fff"} />
          ) : null
        }
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  listContent: { padding: MARGIN / 2, alignItems: "center" },
  row: { justifyContent: "space-between", marginBottom: MARGIN / 2 },
  cardWrapper: { margin: MARGIN / 2, borderRadius: 8, overflow: "hidden" },
  card: { flex: 1 },
  image: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: "stretch",
  },
  footer: { marginVertical: 16 },
});