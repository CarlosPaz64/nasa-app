import React from "react";
/* Estas son importaciones del Drawer que son necesarias
* además de ciertas características adicionales
* con el fin de cumplir con las animaciones requeridas
* y del contenido del scroll. 
* Imports: 
* import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";  */
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
// Animación de enfoque a las rutas: import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
// Ionicons
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
// Hooks de Redux para acceder y modificar el estado global
// useSelector y useDispatch
import { useSelector, useDispatch } from "react-redux";
// Los tipos de mi store
import type { RootState, AppDispatch } from "../store/store";
// Cambio de tema
import { toggleTheme } from "../slices/ThemeSlice";

// Importación de las 2 navegaciones creadas que estarán en mi Drawer
import BottomTabNavigator from "./BottomTabNavigatior";
import ContestsStack from "./ContestsStackNavigation";

// Crea la instancia del Drawer Navigator
const Drawer = createDrawerNavigator();

/**
 * Componente para renderizar contenido personalizado en el drawer,
 * incluyendo la lista de rutas y un toggle de tema.
 */
function CustomDrawerContent(props: DrawerContentComponentProps) {
  // Aquí se despachan las acciones del redux
  const dispatch = useDispatch<AppDispatch>();
  // La constante del mode, que obtiene el modo actual
  const mode = useSelector((s: RootState) => s.theme.mode);
  // Booleano para el cambio de tema claro
  // const isLight = mode === "light";
  const isLight = mode === "light";

  return (
    <DrawerContentScrollView {...props}>
      {/* Lista de ítems generados automáticamente */}
      <DrawerItemList {...props} />

      {/* Ítem personalizado para alternar entre tema claro/oscuro */}
      <DrawerItem
        label={isLight ? "Change to dark mode" : "Change to light mode"} // Texto que cambia acorde al tema seleccionado
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

/**
 * Componente principal que define las rutas del Drawer Navigator
 * y sus opciones de estilo y comportamiento.
 */
export default function DrawerNavigator() {
  // Aquí básicamente obtiene el modo actual
  const mode = useSelector((s: RootState) => s.theme.mode);
  const isLight = mode === "light";

  return (
    <Drawer.Navigator
    // Reemplaza el contenido por defecto con nuestro componente personalizado
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      // Opciones de estilo generales para el drawer y el header
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
      {/* Ruta principal que anida el navegador de pestañas */}
      <Drawer.Screen
        name="HomeTabs"
        component={BottomTabNavigator}
        // options tiene 2 parámetros (route y navigation)
        options={({ route, navigation }) => ({
          // Utiliza el nombre de la ruta enfocada como título, o "APOD" si no hay
          title: getFocusedRouteNameFromRoute(route) ?? "APOD",
          headerStyle: { backgroundColor: isLight ? "#fff" : "#222" },
          headerTintColor: isLight ? "#000" : "#fff",
          // Botón para abrir/cerrar el drawer desde el header
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => (navigation as any).toggleDrawer()} // Alterna visibilidad del drawer
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
      {/* Ruta secundaria para el stack de concursos */}
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