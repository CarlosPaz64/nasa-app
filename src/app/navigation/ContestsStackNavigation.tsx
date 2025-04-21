// Este es un stack para la vista de los concursos con formularios
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContestsScreen from "../../presentation/views/contests/ContestsScreen";

const Stack = createNativeStackNavigator();

export default function ContestsStack () {
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="Concursos"
            component={ContestsScreen}
            options={{ title: "Concursos de la NASA" , headerShown: false}}
            ></Stack.Screen>
        </Stack.Navigator>
    );
}