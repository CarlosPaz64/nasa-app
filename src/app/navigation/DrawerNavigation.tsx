// src/navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigatior';
import ContestsStack from './ContestsStackNavigation';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      {/* Vista principal con tabs */}
      <Drawer.Screen 
        name="HomeTabs" 
        component={BottomTabNavigator}
        options={{ title: 'Home' }}
      />

      {/* Vista de los concursos */}
      <Drawer.Screen 
        name="ContestsStack" 
        component={ContestsStack}
        options={{ title: 'Contests' }}
      />

    </Drawer.Navigator>
  );
}
