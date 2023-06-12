import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

import { Feather } from "@expo/vector-icons";
import ModalPicker from "./ModalPicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function NewEventScreen(props) {
  const defaultProfilePic =
    "https://st3.depositphotos.com/23594922/31822/v/600/depositphotos_318221368-stock-illustration-missing-picture-page-for-website.jpg";
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [eventImage, setEventImage] = useState(defaultProfilePic);
  const [uploading, setUploading] = useState(false);
  const [chooseGenre, setChooseGenre] = useState("Select Genre");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState("Date and Time");
  const [error, setError] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        console.log(snapshot.data().name);
        setName(snapshot.data().name);
      });
  }, []);

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    console.log("No Permission");
    return <Text>No access to camera</Text>;
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    setDate(date);
    hideDatePicker();
  };

  const uploadImage = async (imageUri) => {
    const uri = imageUri;
    const childPath = `events/${
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
        setUploading(false);
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
      .collection("events")
      .add({
        creatorId: firebase.auth().currentUser.uid,
        eventImageUrl: downloadURL,
        genre: chooseGenre,
        dateAndTime: date.toString().slice(0, 28),
        price: price,
        name: name,
        location: location,
      })
      .then(function () {
        setUploading(false);
        props.navigation.goBack();
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(result);

    if (!result.cancelled) {
      setEventImage(result.uri);
    }
  };

  const changeModalVisibility = (bool) => {
    setIsModalVisible(bool);
  };

  const setData = (data) => {
    setChooseGenre(data);
  };

  if (hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const submitEvent = () => {
    if (
      eventImage === defaultProfilePic ||
      chooseGenre === "" ||
      date.toString() === "" ||
      price === ""
    ) {
      setError("Please fill in all the fields");
    } else {
      setError("");
      uploadImage(eventImage);
    }
  };

  return uploading ? (
    <View style={styles.screenContainer}>
      <View
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="grey" style={{ margin: 20 }} />
        </View>
      </View>
    </View>
  ) : (
    <ScrollView
      style={[
        styles.screenContainer,
        {
          opacity: isModalVisible ? 0.3 : 1,
          backgroundColor: isModalVisible ? "black" : "white",
        },
      ]}
    >
      <View>
        <View style={styles.imageContainer}>
          {eventImage === null ? (
            <View style={styles.loader}>
              <ActivityIndicator
                size="large"
                color="#B4FCFB"
                style={{ margin: 20 }}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => pickImage()}>
              <Image style={styles.image} source={{ uri: eventImage }} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={[styles.touchableOpacity, { marginTop: 10 }]}
          onPress={() => changeModalVisibility(true)}
        >
          <Text style={styles.text}>{chooseGenre}</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="fade"
          visible={isModalVisible}
          nRequestClose={() => changeModalVisibility(false)}
        >
          <ModalPicker
            changeModalVisibility={changeModalVisibility}
            setData={setData}
            type={GENRES}
          />
        </Modal>
      </View>
      <View>
        <View style={styles.touchableOpacity}>
          <Text style={styles.text} onPress={showDatePicker}>
            {date.toString().slice(0, 28)}
          </Text>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
          maximumDate={new Date(Date.now() + 12096e5)}
        />
      </View>
      <View>
        <TextInput
          keyboardType="default"
          placeholderTextColor="black"
          style={styles.touchableOpacity}
          placeholder="Location"
          maxLength={28}
          onChangeText={(text) => setLocation(text)}
        ></TextInput>
      </View>
      <View>
        <TextInput
          keyboardType="phone-pad"
          placeholderTextColor="black"
          style={styles.touchableOpacity}
          placeholder="Ticket in $"
          maxLength={4}
          onChangeText={(text) => setPrice(text)}
        ></TextInput>
      </View>
      <View style={styles.check}>
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>
        </View>
        <Feather
          name="check-square"
          size={30}
          color="green"
          style={{ alignSelf: "flex-end" }}
          onPress={() => submitEvent()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  button: {
    width: "90%",
    padding: 5,
    backgroundColor: "white",
    borderColor: "green",
    borderRadius: 5,
    borderWidth: 2,
    alignSelf: "flex-end",
    margin: 20,
  },
  buttonText: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    color: "green",
    fontFamily: "Regular",
    fontSize: 13,
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    width: WIDTH,
    alignSelf: "center",
  },
  imageContainer: {
    width: "90%",
    aspectRatio: 4 / 3,
    marginVertical: 10,
    alignSelf: "center",
    borderWidth: 3,
    borderRadius: 5,
    borderColor: "grey",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    alignSelf: "center",
    aspectRatio: 4 / 3,
  },
  loader: {
    alignSelf: "center",
  },
  text: {
    fontSize: 15,
    fontFamily: "Regular",
    color: "black",
    alignSelf: "center",
  },
  touchableOpacity: {
    width: "90%",
    padding: 5,
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    marginBottom: 10,
    alignSelf: "center",
    textAlign: "center",
    fontFamily: "Regular",
    fontSize: 15,
    color: "black",
  },
  check: {
    width: WIDTH,
    marginHorizontal: 20,
  },
  errorContainer: {
    alignSelf: "center",
  },
  error: {
    color: "red",
    fontSize: 12,
    fontFamily: "Regular",
  },
});

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
const GENRES = [
  "Rock",
  "Jazz",
  "EDM",
  "Hip-Hop",
  "Pop",
  "Indie",
  "Metal",
  "Oriental",
  "Commercial",
  "R&B",
];
