import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import * as Permissions from "expo-permissions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

export default function AddScreen({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [video, setVideo] = useState(null);
  const [recording, setRecording] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");

      const audioStatus = await Permissions.askAsync(
        Permissions.AUDIO_RECORDING
      );
      setHasAudioPermission(audioStatus.status === "granted");
    })();
  }, []);

  const takeVideo = async () => {
    if (camera) {
      if (!recording) {
        setRecording(true);
        const data = await camera.recordAsync({
          quality: Camera.Constants.VideoQuality["1080p"],
          maxDuration: 20,
        });
        setVideo(data.uri);
      } else {
        setRecording(false);
        camera.stopRecording();
      }
    }
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [9, 11],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setVideo(result.uri);
    }
  };

  const discardVideo = async () => {
    setVideo(null);
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasAudioPermission === false) {
    return <Text>No access to audio</Text>;
  }
  if (!video) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.fixedRatio}
            type={type}
            ratio={"1080p"}
          >
            <View style={{ width: "100%", alignSelf: "center" }}>
              <MaterialIcons
                name="flip-camera-ios"
                size={30}
                color="white"
                style={styles.flipCamera}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              />
            </View>
            <View
              style={{ width: "100%", alignSelf: "center", marginTop: 350 }}
            >
              {recording ? (
                <MaterialCommunityIcons
                  style={styles.recordButton}
                  name="record-circle"
                  size={70}
                  color="coral"
                  onPress={() => takeVideo()}
                />
              ) : (
                <MaterialCommunityIcons
                  style={styles.recordButton}
                  name="record-circle-outline"
                  size={70}
                  color="white"
                  onPress={() => takeVideo()}
                />
              )}
            </View>
            <View style={{ width: "100%", alignSelf: "center" }}>
              <FontAwesome
                style={styles.gallery}
                name="picture-o"
                size={30}
                color="white"
                onPress={() => pickVideo()}
              />
            </View>
          </Camera>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          width: "100%",
          marginVertical: 30,
        }}
      >
        {video && (
          <Video
            style={styles.videoContainer}
            source={{ uri: video }}
            useNativeControls
            resizeMode="contain"
            isLooping={true}
          />
        )}
        <View style={styles.flex}>
          <AntDesign
            style={{ margin: 20 }}
            name="closecircle"
            size={50}
            color="coral"
            onPress={() => discardVideo()}
          />
          <AntDesign
            style={{ margin: 20 }}
            name="checkcircle"
            size={50}
            color="#98FB98"
            onPress={() => navigation.navigate("Save", { video })}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 9 / 11,
    alignSelf: "center",
  },
  videoContainer: {
    aspectRatio: 4 / 4,
  },
  recordButton: {
    alignSelf: "center",
    zIndex: 100,
  },
  flipCamera: {
    zIndex: 99,
    marginTop: 20,
    marginLeft: 40,
    alignSelf: "flex-start",
  },
  gallery: {
    marginLeft: 40,
    zIndex: 98,
  },
  flex: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
