import React, { useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { TouchableOpacity } from "react-native";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";
import { StatusBar } from "react-native";
import { KeyboardAvoidingView } from "react-native";
import { Platform } from "react-native";
import { ScrollView } from "react-native";
import { TextInput } from "react-native";
import { Keyboard } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import firebase from "firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [photo, setPhoto] = useState([]);
  const [image, setImage] = useState([]);

  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  const sendMessage = () => {
    Keyboard.dismiss();

    firebase
      .firestore()
      .collection("privatechats")
      .doc(route.params.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: firebase.auth().currentUser.displayName,
        email: firebase.auth().currentUser.email,
        photoURL: firebase.auth().currentUser.photoURL,
      });
    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("privatechats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "==", firebase.auth().currentUser.email)
      .onSnapshot((snapshot) => {
        setPhoto(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    firebase
      .firestore()
      .collection("users")
      .where("email", "==", route.params.insight)
      .onSnapshot((snapshot) => {
        setImage(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerTitleAlign: "left",
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {photo.map(({ data: { profileURL } }) => (
            <Avatar rounded source={{ uri: route.params.photoLink }} />
          ))}
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.insight}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginLeft: 30,
          }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === firebase.auth().currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    {photo.map(({ data: { profileURL } }) => (
                      <Avatar
                        rounded
                        source={{
                          uri:
                            profileURL != "" ? profileURL : defaultProfilePic,
                        }}
                        position="absolute"
                        bottom={-15}
                        right={-5}
                        size={30}
                        containerStyle={{
                          position: "absolute",
                          bottom: -15,
                          right: -5,
                        }}
                      />
                    ))}
                    <Text style={styles.receiverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View style={styles.sender}>
                    {image.map(({ data: { profileURL } }) => (
                      <Avatar
                        rounded
                        source={{
                          uri:
                            profileURL != "" ? profileURL : defaultProfilePic,
                        }}
                        position="absolute"
                        bottom={-15}
                        right={-5}
                        size={30}
                        containerStyle={{
                          position: "absolute",
                          bottom: -15,
                          right: -5,
                        }}
                      />
                    ))}
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                placeholder="Write here..."
                style={styles.textInput}
              />
              <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
                <Ionicons name="send" size={24} color="#CE2029" />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    borderWidth: 1,
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },

  receiver: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },

  sender: {
    padding: 15,
    backgroundColor: "#CE2029",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },

  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 10,
    color: "white",
  },

  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 5,
  },

  receiverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 5,
  },
});
