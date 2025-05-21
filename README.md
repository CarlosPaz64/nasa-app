# Segundo parcial: NASA Explorer
## Materia: Certificación de software

**Explicación:** Esta es una aplicación realizada en **React Native + Expo + TypeScript**, que respeta y se guía bajo la arquitectura **MVVM + Clean Architecture.** Consiste en un "explorador de la NASA", que consume 5 APIs públicas de la NASA, además de contener 4 concursos falsos. Puedes explorar libremente cada una de ellas instalando la aplicación y ejecutándola ya sea en Web o mediante un emulador de Android (puedes compilarlo también directamente desde tu teléfono móvil).

**Pasos para instalar:** Únicamente escribe en tu terminal del proyecto el comando ```npm install``` y se instalan todas las dependencias. Una vez hayas instalado todo, escribe ```npx expo start``` y selecciona la opción según te convenga.

**Dependencias:**
```
  "dependencies": {
    "@expo/metro-runtime": "~4.0.1",
    "@lottiefiles/dotlottie-react": "^0.6.5",
    "@react-native-async-storage/async-storage": "1.23.1",
    "@react-native-community/netinfo": "11.4.1",
    "@react-navigation/bottom-tabs": "^7.3.10",
    "@react-navigation/drawer": "^7.3.9",
    "@react-navigation/native": "^7.1.6",
    "@react-navigation/native-stack": "^7.3.10",
    "@reduxjs/toolkit": "^2.7.0",
    "axios": "^1.8.4",
    "expo": "~52.0.46",
    "expo-linear-gradient": "~14.0.2",
    "expo-status-bar": "~2.0.1",
    "lottie-ios": "^4.5.1",
    "lottie-react-native": "7.1.0",
    "lottie-web": "^5.12.2",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-hook-form": "^7.56.4",
    "react-native": "0.76.9",
    "react-native-gesture-handler": "~2.20.2",
    "react-native-reanimated": "~3.16.1",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.4.0",
    "react-native-vector-icons": "^10.2.0",
    "react-native-web": "~0.19.13",
    "react-redux": "^9.2.0",
    "redux-persist": "^6.0.0",
    "@react-native-community/datetimepicker": "8.2.0"
  },
  "devDependencies": {
    "@babel/core": "^7.25.2",
    "@types/react": "~18.3.12",
    "babel-preset-expo": "^12.0.11",
    "typescript": "^5.3.3"
  },
```

**Explicación de cada capa:**
## Presentation
Se encarga de todo lo visible al usuario: pantallas (Views), componentes UI reutilizables y la lógica de enlace (ViewModels) que recibe eventos de la UI y expone datos listos para mostrar.

## Domain
Contiene la lógica de negocio pura: las Entidades (modelos de datos), los Use Cases (casos de uso que orquestan flujos) y los Contracts (interfaces que definen operaciones sin detalles de implementación).

## Data
Implementa los Contracts del dominio con repositorios que obtienen datos (APIs, caché, base de datos) y mappers que transforman respuestas crudas en Entidades del dominio.

## App/Infrastructure
Provee servicios concretos y configuración: acceso a la NasaAPI, Redux (slices y store) para estado global, navegación (stacks, tabs) y punto de entrada ```(App.tsx/index.ts)``` que arranca la aplicación.
