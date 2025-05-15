import { useState } from "react";
import { Pressable, View, Text, KeyboardAvoidingView, TextInput, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../assets/style.js";
import { StatusBar } from "expo-status-bar";
import supabase from "../../supabaseConfig.js";

export default function Login({ navigation }) {
    const [ email, setEmail ] = useState("");
    const [ senha, setSenha ] = useState("");

    async function handleLogin() {
        try {
            await supabase.auth.signOut();

            const { error: signUpError } = await supabase.auth.signInWithPassword({
                email,
                password: senha
            });

            if (signUpError) {
                alert(signUpError.message);
                Alert.alert("Erro na autenticação", signUpError.message);
                return;
            }
        
            navigation.reset({
                index: 0,
                routes: [{ name: 'BottomTabs' }],
            });
        } catch (err) {

        }
    }

    const { width } = Dimensions.get("screen");

    return (<SafeAreaView
        style={[styles.main, styles.flexMain, ]}
    >
        <StatusBar style="light" />
        <KeyboardAvoidingView
            behavior="padding"
            style={{ flex:1, justifyContent: "center", alignItems: "center" }}
        >
            <View style={{
                
            }}>
                <View style={[styles.fieldContainer, { width: width * 0.95, }]}>
                    <Text style={styles.fieldLabel}>E-mail</Text>
                    <TextInput
                        inputMode="email"
                        onChangeText={setEmail}
                        value={email}
                        style={[ styles.field ]}
                        cursorColor={"#ffffff"}
                    />
                </View>
                <View style={[styles.fieldContainer, { width: width * 0.95, }]}>
                    <Text style={styles.fieldLabel}>Senha</Text>
                    <TextInput
                        onChangeText={setSenha}
                        value={senha}
                        style={[ styles.field ]}
                        secureTextEntry={true}
                        cursorColor={"#ffffff"}
                    />
                </View>
            </View>
            <Pressable
                onPress={handleLogin}
                style={[styles.button, !email || !senha ? { backgroundColor: "#bbb" } : {} ]}
            >
                <Text style={[styles.buttonText]}>Entrar</Text>
            </Pressable>
            <Pressable
                onPress={() => navigation.navigate("Register")}
            >
                <Text style={{
                    textAlign: "center",
                    color: "#bbb",
                    fontWeight: "bold"
                }}>
                    Não tem conta? Registre-se agora.
                </Text>
            </Pressable>
        </KeyboardAvoidingView>
    </SafeAreaView>)
}