import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import { Video } from "expo-av";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

function SaveScreen(props) {
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadVideo = async () => {
    const uri = props.route.params.video;
    const childPath = `post/${
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
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        setUploading(false);
        props.navigation.popToTop();
      });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", paddingVertical: 20 }}>
      <Video
        style={styles.videoContainer}
        source={{ uri: props.route.params.video }}
        useNativeControls
        resizeMode="contain"
        isLooping={true}
      />
      <TextInput
        style={styles.captionInput}
        placeholder="Write a Caption . . ."
        onChangeText={(caption) => setCaption(caption)}
      />

      {uploading ? (
        <ActivityIndicator
          size="large"
          color="#CE2029"
          style={{ margin: 20 }}
        />
      ) : (
        <View style={styles.uploadBtn}>
          <Text style={styles.uploadText} onPress={() => uploadVideo()}>
            Upload
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  videoContainer: {
    aspectRatio: 4 / 4,
  },
  captionInput: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 15,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#CE2029",
    padding: 10,
    marginTop: 10,
    marginHorizontal: 30,
  },
  uploadBtn: {
    width: 300,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
    backgroundColor: "#CE2029",
    paddingVertical: 5,
    borderRadius: 5,
  },
  uploadText: {
    color: "white",
    fontFamily: "Regular",
    fontSize: 15,
  },
});

export default SaveScreen;
