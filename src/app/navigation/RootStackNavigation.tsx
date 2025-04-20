import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigation";

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
        </Stack.Navigator>
      );
}