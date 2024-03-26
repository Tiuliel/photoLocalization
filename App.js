import React, { useState, useEffect } from "react";
import { StyleSheet, View, Button, TextInput, Image } from "react-native";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [temPermissaoCamera, setTemPermissaoCamera] = useState(null);
  const [camera, setCamera] = useState(null);
  const [uriFoto, setUriFoto] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setTemPermissaoCamera(status === "granted");
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar a localização foi negada");
        return;
      }

      let localizacao = await Location.getCurrentPositionAsync({});
      setLocalizacao(localizacao);
    })();
  }, []);

  const tirarFoto = async () => {
    if (camera) {
      const dados = await camera.takePictureAsync();
      setUriFoto(dados.uri);
    }
  };

  return (
    <View style={estilos.container}>
      <Camera
        style={estilos.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      />
      <Button title="Tirar Foto" onPress={tirarFoto} />
      {uriFoto && (
        <Image source={{ uri: uriFoto }} style={estilos.previewFoto} />
      )}
      <TextInput
        style={estilos.titulo}
        placeholder="Digite o título"
        onChangeText={(text) => setTitulo(text)}
        value={titulo}
      />
      {localizacao && (
        <MapView
          style={estilos.map}
          initialRegion={{
            latitude: localizacao.coords.latitude,
            longitude: localizacao.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: localizacao.coords.latitude,
              longitude: localizacao.coords.longitude,
            }}
            title="Sua localização"
          />
        </MapView>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  camera: {
    width: "100%",
    height: "50%",
  },
  previewFoto: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  titulo: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  map: {
    marginTop: 20,
    width: "80%",
    height: "20%",
  },
});
