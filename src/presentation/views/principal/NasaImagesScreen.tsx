// presentation/screens/NasaMediaScreen.tsx
import React, { useEffect } from "react";
import {
  View, Text, TextInput, Button,
  FlatList, Image, TouchableOpacity,
  ActivityIndicator, StyleSheet, Dimensions
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, interpolateColor
} from "react-native-reanimated";
import { useNasaImagesViewModel } from "../../viewmodels/UseNasaImagesViewModel";
import type { NasaImageEntity } from "../../../domain/entities/NasaImageEntity";
import type { RootState } from "../../../app/store/store";

type RootStackParamList = {
  MediaModal: { href: string };
};

const { width } = Dimensions.get("window");
const LIGHT_BG = "#FFFFFF";
const DARK_BG  = "#222222";

export default function NasaMediaScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mode       = useSelector((s: RootState) => s.theme.mode);
  const { query, setQuery, data, loading, error, search } = useNasaImagesViewModel();

  // animación de fondo
  const prog = useSharedValue(mode === "light" ? 1 : 0);
  useEffect(() => { prog.value = withTiming(mode === "light" ? 1 : 0, { duration: 500 }); }, [mode]);
  const bgStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: interpolateColor(prog.value, [0,1], [DARK_BG,LIGHT_BG]),
  }));

  const renderItem = ({ item }: { item: NasaImageEntity }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("MediaModal", { href: item.preview })}
    >
      <Image source={{ uri: item.preview }} style={styles.image} />
      <Text style={[styles.title, { color: mode === "light" ? "#000" : "#FFF" }]} numberOfLines={2}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={bgStyle}>
      <View style={styles.searchRow}>
        <TextInput
          style={[styles.input, {
            backgroundColor: mode==="light"?"#FFF":"#444",
            color: mode==="light"?"#000":"#FFF",
            borderColor: mode==="light"?"#888":"#666"
          }]}
          placeholder="Search NASA..."
          placeholderTextColor={mode==="light"?"#888":"#999"}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
        />
        <Button title="Go" onPress={search} />
      </View>

      {loading && <ActivityIndicator style={{ margin:16 }} />}
      {error   && <Text style={[styles.error, { color: mode==="light"?"red":"#f88" }]}>{error}</Text>}

      <FlatList
        data={data}
        keyExtractor={i => i.nasa_id}
        numColumns={2}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", padding:8, alignItems:"center" },
  input:     { flex:1, borderWidth:1, borderRadius:4, paddingHorizontal:8, height:40, marginRight:8 },
  list:      { padding:8, paddingBottom:32 },
  card:      { flex:1, margin:4, alignItems:"center" },
  image:     { width:(width/2)-16, height:(width/2)-16, borderRadius:8 },
  title:     { marginTop:4, fontSize:12, textAlign:"center" },
  error:     { textAlign:"center", marginVertical:8 }
});