import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigation";
import HDPhotoModal from "../../presentation/views/modals/HDPhotoModal";
import IntroScreen from "../../presentation/views/principal/HomeScreen";
import MediaModal from "../../presentation/views/modals/MediaModal";
import EpicDetailModal from "../../presentation/views/modals/EpicDetail";
import MarsHDPhoto from "../../presentation/views/modals/MarsHDPhoto";
import AsteroidDetailModal from "../../presentation/views/modals/AsteroidDetailModal";
import ContestFormScreen from "../../presentation/views/modals/ContestForm";

export type RootStackParamList = {
  // pantallas principales
  Intro: undefined;
  Home: undefined;

  // modales de APOD, Media, Epic, Marte, Asteroides…
  HDPhotoModal: { uri: string };
  MediaModal: { mediaId: string };             // ajusta según tus params
  EpicDetailModal: { epicId: string };
  MarsHDPhoto: { uri: string };
  AsteroidDetailModal: { asteroidId: string };
 
  // pantallas de concursos
  ConcursosList: undefined;
  ContestForm: { contestId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigation() {
  return (
    <Stack.Navigator
    initialRouteName="Intro"
    >
      {/* Ruta de inicio, que sirve para explicar al usuario qué hace y cómo funciona la aplicación */}
      <Stack.Screen
        name="Intro"
        component={IntroScreen}
        options={{ headerShown: false }}
      />
      {/* Aquí renderizas tu DrawerNavigator, sin header */}
      <Stack.Screen
        name="Home"
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
          animation: 'slide_from_bottom'
        }}
      />
      {/* Modal del archivo multimedia seleccionado */}
      <Stack.Screen
        name="MediaModal"
        component={MediaModal}
        options={{
          presentation: "modal",
          headerShown: false,  // o true si quieres un header con un “Cerrar”
          animation: 'fade_from_bottom'
        }}
      />

      {/* Modal de detalles del EPIC */}
      <Stack.Screen
        name="EpicDetailModal"
        component={EpicDetailModal}
        options={{
          presentation: "modal",
          headerShown: false,  // o true si quieres un header con un “Cerrar”
          animation: 'fade'
        }}
      />

      {/* Modal de detalles de Marte */}
      <Stack.Screen
        name="MarsHDPhoto"
        component={MarsHDPhoto}
        options={{
          presentation: "modal",
          headerShown: false,  // o true si quieres un header con un “Cerrar”
          animation: 'slide_from_right'
        }}
      />

      {/* Modal de detalles de los asteroides */}
      <Stack.Screen
        name="AsteroidDetailModal"
        component={AsteroidDetailModal}
        options={{
          presentation: "modal",
          headerShown: false,  // o true si quieres un header con un “Cerrar”
          animation: 'slide_from_left'
        }}
      />

      {/* Grupo de modales */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="ContestForm"
            component={ContestFormScreen}
            options={{ title: 'Formulario de Concurso', headerShown: false, animation: 'slide_from_bottom'}}
          />
        </Stack.Group>
    </Stack.Navigator>
  );
}