import React, { useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, StyleSheet, Button, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import supabase from '../../supabaseConfig';

const screenWidth = Dimensions.get("window").width;
const numColumns = 2;
const imageSize = screenWidth / numColumns;

export default function GaleriaScreen({ navigation }) {
    const [imagens, setImagens] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchImagens = async () => {
        setLoading(true);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("Erro ao obter usuário:", userError?.message);
            setLoading(false);
            return;
        }

        const userId = user.id;

        try {
            const { data, error } = await supabase.storage
                .from("fotos-perfil")
                .list(`${userId}/galeria`, { limit: 100 });

            if (error) {
                console.error("Erro ao listar imagens:", error.message);
                setLoading(false);
                return;
            }

            const urls = await Promise.all(
                data
                    .filter((item) => item.name)
                    .map(async (item) => {
                        const { data: urlData, error: urlError } = await supabase.storage
                            .from("fotos-perfil")
                            .getPublicUrl(`${userId}/galeria/${item.name}`);

                        if (urlError) {
                            console.error("Erro ao obter URL:", urlError.message);
                            return null;
                        }

                        return {
                            name: item.name,
                            url: urlData.publicUrl,
                        };
                    })
            );

            setImagens(urls.filter((img) => img !== null));
        } catch (err) {
            console.error("Erro inesperado:", err);
        }

        setLoading(false);
    };

    // Recarrega sempre que a tela voltar ao foco
    useFocusEffect(
        useCallback(() => {
            fetchImagens();
        }, [])
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Galeria</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : (
                <FlatList
                    numColumns={numColumns}
                    data={imagens}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <Image source={{ uri: item.url }} style={styles.image} />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}

            <Button
                title="Subir imagens"
                onPress={() => navigation.navigate("AddImage")}
                color="#007bff"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 16,
        backgroundColor: '#333',
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
        color: '#fff',
    },
    list: {
        paddingBottom: 20,
    },
    image: {
        width: imageSize - 28,
        height: imageSize - 28,
        margin: 6,
        borderRadius: 12,
        resizeMode: "cover",
        backgroundColor: "#444",
    },
});3