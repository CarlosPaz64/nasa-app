import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  MediaModal: { href: string };
};

export default function MediaModal() {
  const { params }  = useRoute();
  const { href }    = params as { href: string };
  const navigation  = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { width, height } = Dimensions.get("window");

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.close} onPress={() => navigation.goBack()}>
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>
      <Image
        source={{ uri: href }}
        style={[styles.image, { width: width*0.9, height: height*0.8 }]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay:   { flex:1, backgroundColor:"rgba(0,0,0,0.9)", justifyContent:"center", alignItems:"center" },
  close:     { position:"absolute", top:40, right:20 },
  closeText: { fontSize:24, color:"#FFF" },
  image:     { borderRadius:8 }
});
