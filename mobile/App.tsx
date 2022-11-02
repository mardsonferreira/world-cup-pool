import { NativeBaseProvider, StatusBar } from "native-base";
import {
    useFonts,
    Roboto_400Regular,
    Roboto_700Bold,
    Roboto_500Medium,
} from "@expo-google-fonts/roboto";

import { THEME } from "./src/styles/theme";

import { Loading } from "./src/components/Loading";

import { SignIn } from "./src/pages/SignIn";

export default function App() {
    let [fontsLoaded] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        Roboto_500Medium,
    });

    return (
        <NativeBaseProvider theme={THEME}>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            {!fontsLoaded ? <Loading /> : <SignIn />}
        </NativeBaseProvider>
    );
}
