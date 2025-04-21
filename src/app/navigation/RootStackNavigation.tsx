import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigation";
import HDPhotoModal from "../../presentation/views/principal/HDPhotoModal";

const Stack = createNativeStackNavigator();

export default function RootStackNavigation() {
  return (
    <Stack.Navigator>
      {/* Aquí renderizas tu DrawerNavigator, sin header */}
      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      {/* Modal de la foto en HD del APOD */}
      <Stack.Screen
        name="HDPhotoModal"
        component={HDPhotoModal}
        options={{
          presentation: "modal",
          headerShown: false,  // o true si quieres un header con un “Cerrar”
        }}
      />
    </Stack.Navigator>
  );
}