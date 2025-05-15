import { Pressable, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login({ navigation }) {
    function handleLoginSuccess() {
        navigation.reset({
            index: 0,
            routes: [{ name: 'BottomTabs' }],
        });
    }

    return (<SafeAreaView>
        <Pressable onPress={() => {
            // navigation.navigate("BottomTabs");
            handleLoginSuccess()
        }}>
            <Text>Navegar</Text>
        </Pressable>
    </SafeAreaView>)
}