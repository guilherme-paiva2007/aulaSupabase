import supabase from "../../supabaseConfig.js";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Alert, Dimensions, KeyboardAvoidingView, View, Text, TextInput, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "../assets/style.js";

export default function Register() {
    const [ email, setEmail ] = useState("");
    const [ senha, setSenha ] = useState("");
    const [ nome, setNome ] = useState("");
    const [ imagemUri, setImagemUri ] = useState(null);

    const registerUser = async (email, senha, nome, imagemUri) => {
        await supabase.auth.signOut();

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password: senha
        });
        if (signUpError) {
            alert(signUpError.message);
            Alert.alert("Erro na autenticação", signUpError.message);
            return;
        }

        const userId = signUpData.user.id;
        let photoURL = null;

        if (imagemUri) {

            const fileName = imagemUri.substring(imagemUri.lastIndexOf("/") + 1);
            const fileType = "image/jpeg";
    
            const base64 = await FileSystem.readAsStringAsync(imagemUri, {
                encoding: FileSystem.EncodingType.Base64,
            });
    
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from("fotos-perfil")
                .upload(
                    `${userId}/profile-picture.jpg`,
                    {
                        uri: `data:${fileType};base64,${base64}`,
                        name: fileName,
                        type: fileType
                    },
                    {
                        contentType: fileType,
                        upsert: true
                    }
                );
        
            if (uploadError) {
                alert("Erro no upload", uploadError.message);
                Alert.alert(uploadError.message);
                return;
            }
            const { data: publicUrlData } = supabase.storage
                .from("fotos-perfil")
                .getPublicUrl(`${userId}/profile-picture.jpg`);
    
            photoURL = publicUrlData.publicUrl;
        }

        const { error: dbError } = await supabase
            .from("users")
            .insert([ { id: userId, nome, email, photoUrl: photoURL } ]);

        if (dbError) {
            alert(dbError.message);
            Alert.alert("Erro no banco de dados", dbError.message);
            return;
        }

        return signUpData.user;
    }

    const handleRegister = async () => {
        if (email && senha && nome) {
            const user = await registerUser(email, senha, nome, imagemUri);
            if (user) {
                Alert.alert("Seja bem-vindo(a)!", "Cadastro realizado com sucesso",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.reset({
                                index: 0,
                                routes: [{ name: 'BottomTabs' }],
                            }),
                        },
                    ]
                );
            }
        }
    }

    const pickImage = async () => {

    }

    const { width } = Dimensions.get("screen")
    return (
        <SafeAreaView
            style={[styles.main, styles.flexMain, ]}
        >
            <StatusBar style="light" />
            <KeyboardAvoidingView
                behavior="padding"
                style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            >
                <View
                    style={{
                        width: width * 0.7,
                        height: width * 0.7,
                        borderRadius: 500
                    }}
                >
                    <Pressable
                        onPress={pickImage}
                    >
                        <Image
                            width={width * 0.7}
                            height={width * 0.7}
                            source={imagemUri ? { uri: imagemUri } : require("../assets/profile.svg")}
                        />
                    </Pressable>
                </View>
                <View style={[styles.fieldContainer, { width: width * 0.95, }]}>
                    <Text style={styles.fieldLabel}>Nome</Text>
                    <TextInput
                        onChangeText={setNome}
                        value={nome}
                        style={[ styles.field ]}
                        cursorColor={"#ffffff"}
                    />
                </View>
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
                <Pressable
                    onPress={handleRegister}
                    style={[styles.button, !email || !senha || !nome ? { backgroundColor: "#bbb" } : {} ]}
                >
                    <Text style={[styles.buttonText]}>Registrar</Text>
                </Pressable>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );

}