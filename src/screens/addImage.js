import React, { useState } from "react";
import { View, Button, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import supabase from '../../supabaseConfig';

const UploadFoto = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);

  const escolherImagem = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Permita o acesso à galeria para trocar a foto."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        const selectedUri = result.assets[0].uri;
        setImageUri(selectedUri);
        await uploadImage(selectedUri);
      }
    } catch (error) {
      console.error("Erro ao selecionar imagem:", error);
      Alert.alert("Erro", "Não foi possível selecionar a imagem.");
    }
  };

  const uploadImage = async (uri) => {
    if (!uri) {
      Alert.alert("Erro", "Nenhuma imagem selecionada.");
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      const user = authData?.user;

      if (authError || !user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const timestamp = new Date().getTime();
      let fileExt = uri.split(".").pop().toLowerCase();
      if (!fileExt || fileExt.length > 4) fileExt = "jpg";

      const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
      if (!validExtensions.includes(fileExt)) fileExt = "jpg";

      const filename = `${user.id}+${timestamp}.${fileExt}`;
      const filePath = `${user.id}/galeria/${filename}`;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from("fotos-perfil")
        .upload(filePath, fileBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("fotos-perfil")
        .getPublicUrl(filePath);

      const finalUrl = `${urlData.publicUrl}?t=${timestamp}`;

      Alert.alert("Sucesso", "Imagem enviada com sucesso!");
      console.log("URL pública da imagem:", finalUrl);
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      Alert.alert("Erro", error.message || "Falha ao enviar imagem.");
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Selecionar e Enviar Imagem" onPress={escolherImagem} color="#007bff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: '#333'
  },
});

export default UploadFoto;