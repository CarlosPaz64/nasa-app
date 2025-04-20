// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ApodScreen from '../../presentation/views/APODScreen';
import EpicScreen from '../../presentation/views/EPICScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="APOD" component={ApodScreen} />
      <Tab.Screen name="EPIC" component={EpicScreen} />
    </Tab.Navigator>
    
  );
}
