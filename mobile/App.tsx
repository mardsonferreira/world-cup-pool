import { NativeBaseProvider, StatusBar } from "native-base";
import {
    useFonts,
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_500Medium,
} from "@expo-google-fonts/roboto";

import { AuthContextProvider } from "./src/context/AuthContext";

import { Loading } from "./src/components/Loading";

import { Routes } from "./src/routes";

import { THEME } from "./src/styles/theme";

export default function App() {
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        Roboto_500Medium,
    });

    return (
        <NativeBaseProvider theme={THEME}>
            <AuthContextProvider>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor="transparent"
                    translucent
                />

                {!fontsLoaded ? <Loading /> : <Routes />}
            </AuthContextProvider>
        </NativeBaseProvider>
    );
}
