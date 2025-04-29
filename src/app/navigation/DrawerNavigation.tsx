import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";
import { toggleTheme } from "../slices/ThemeSlice";

import BottomTabNavigator from "./BottomTabNavigatior";
import ContestsStack from "./ContestsStackNavigation";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

      {/* tu toggle, heredando tintas del Drawer */}
      <DrawerItem
        label={isLight ? "Change to dark mode" : "Change to light mode"}
        onPress={() => dispatch(toggleTheme())}
        // la propiedad `labelStyle` asegura que el texto herede tintas
        labelStyle={{
          color: isLight ? "#000" : "#fff"
        }}
        style={{ marginTop: 8 }}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: isLight ? "#fff" : "#222" },
        drawerActiveTintColor: isLight ? "#000" : "#fff",
        drawerInactiveTintColor: isLight ? "#666" : "#ccc",
        drawerLabelStyle: {
          fontSize: 16,
        },
        headerStyle: {
          backgroundColor: isLight ? "#fff" : "#222",
        },
        headerTintColor: isLight ? "#000" : "#fff",
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabNavigator}
        options={({ route, navigation }) => ({
          title: getFocusedRouteNameFromRoute(route) ?? "APOD",
          headerStyle: { backgroundColor: isLight ? "#fff" : "#222" },
          headerTintColor: isLight ? "#000" : "#fff",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => (navigation as any).toggleDrawer()}
              style={{ marginLeft: 12 }}
            >
              <Ionicons
                name="menu"
                size={24}
                color={isLight ? "#000" : "#fff"}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Drawer.Screen
        name="ContestsStack"
        component={ContestsStack}
        options={{
          title: "Contests",
          headerStyle: { backgroundColor: isLight ? "#fff" : "#222" },
          headerTintColor: isLight ? "#000" : "#fff",
        }}
      />
    </Drawer.Navigator>
  );
}