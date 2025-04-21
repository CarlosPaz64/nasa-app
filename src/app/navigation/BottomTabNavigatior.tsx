// src/navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ApodScreen from '../../presentation/views/principal/APODScreen';
import EpicScreen from '../../presentation/views/principal/EPICScreen';
import MarsGalleryScreen from '../../presentation/views/principal/MarsRoverPhotosScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="APOD" component={ApodScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="EPIC" component={EpicScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Mars" component={MarsGalleryScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
    
  );
}
