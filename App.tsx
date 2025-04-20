// App.tsx
import 'react-native-gesture-handler';    // requerido por React Navigation
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigation from './src/app/navigation/RootStackNavigation';
import { store, persistor } from './src/app/store/store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <RootStackNavigation />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}
