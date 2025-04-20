// src/navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigatior';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      {/* Vista principal con tabs */}
      <Drawer.Screen 
        name="HomeTabs" 
        component={BottomTabNavigator}
        options={{ title: 'Inicio' }}
      />

    </Drawer.Navigator>
  );
}
