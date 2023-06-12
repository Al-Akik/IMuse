import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");
import { Avatar } from "react-native-elements/dist/avatar/Avatar";

export default function ProfilePicture(props) {
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(defaultProfilePic);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfilePicture();

    hasGalleryPermission === null
      ? (async () => {
          const cameraStatus =
            await ImagePicker.requestCameraPermissionsAsync();
          setHasCameraPermission(cameraStatus.status === "granted");

          const galleryStatus =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasGalleryPermission(galleryStatus.status === "granted");
        })()
      : null;
  }, []);

  const fetchProfilePicture = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        console.log("pic", snapshot.data().profileURL);
        if (snapshot.data().profileURL === "") {
          setImage(defaultProfilePic);
        } else {
          setImage(snapshot.data().profileURL);
        }
      });
  };

  const uploadImage = async (imageUri) => {
    const uri = imageUri;
    const childPath = `profile/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`Transferred: ${snapshot.bytesTransferred}`);
      setUploading(true);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        profileURL: downloadURL,
      })
      .then(function () {
        setUploading(false);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      uploadImage(result.uri);
    }
  };

  const removeImage = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .update({
        profileURL: "",
      })
      .then(() => {
        setImage(defaultProfilePic);
      });
  };

  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.imageContainer}>
        {uploading || image === null ? (
          <View style={styles.loader}>
            <ActivityIndicator
              size="large"
              color="grey"
              style={{ margin: 20 }}
            />
          </View>
        ) : (
          <Avatar style={styles.image} source={{ uri: image }} />
        )}
      </View>
      <View style={styles.buttonsContainer}>
        <View style={styles.pickButton}>
          <Text style={styles.text} onPress={pickImage}>
            Pick photo from gallery
          </Text>
        </View>
        <View style={styles.pickButton}>
          <Text style={styles.text} onPress={removeImage}>
            Remove current photo
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  imageContainer: {
    width: "80%",
    height: 300,
    alignSelf: "center",
    margin: 30,
    backgroundColor: "white",
    borderRadius: 300,
    overflow: "hidden",
    borderColor: "grey",
    borderWidth: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    aspectRatio: 1,
    alignSelf: "center",
    borderRadius: 300,
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
  pickButton: {
    borderColor: "grey",
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: "white",
    textAlign: "center",
    width: "80%",
    height: 50,
    alignSelf: "center",
    padding: 10,
    marginVertical: 10,
  },
  text: {
    fontFamily: "Regular",
    fontSize: 15,
    height: "100%",
    alignSelf: "center",
  },
  loader: {
    flex: 1,
    margin: 30,
    marginTop: 80,
    padding: 8,
    aspectRatio: 1,
    height: 250,
    width: 250,
    alignSelf: "center",
  },
});

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
