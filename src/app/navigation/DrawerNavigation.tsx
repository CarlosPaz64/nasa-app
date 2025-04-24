// src/navigation/DrawerNavigator.tsx
import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

import BottomTabNavigator from "./BottomTabNavigatior";
import ContestsStack from "./ContestsStackNavigation";

type DrawerParamList = {
  HomeTabs: undefined;
  ContestsStack: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: isLight ? "#fff" : "#222" },
        drawerActiveTintColor: isLight ? "#000" : "#fff",
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabNavigator}
        options={({ route, navigation }) => {
          // Determina qué Tab está activo:
          const focused = getFocusedRouteNameFromRoute(route) ?? "APOD";
          return {
            title: focused,  // ¡usamos la ruta activa como título!
            headerStyle: {
              backgroundColor: isLight ? "#fff" : "#222",
            },
            headerTintColor: isLight ? "#000" : "#fff",
            // Botón hamburguesa:
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => (navigation as DrawerNavigationProp<any>).toggleDrawer()}
                style={{ marginLeft: 12 }}
              >
                <Ionicons name="menu" size={24} color={isLight ? "#000" : "#fff"} />
              </TouchableOpacity>
            ),
          };
        }}
      />

      <Drawer.Screen
        name="ContestsStack"
        component={ContestsStack}
        options={{
          title: "Contests",
          headerStyle: {
            backgroundColor: isLight ? "#fff" : "#222",
          },
          headerTintColor: isLight ? "#000" : "#fff",
        }}
      />
    </Drawer.Navigator>
  );
}