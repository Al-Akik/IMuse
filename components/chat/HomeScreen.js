import { HeaderTitle } from "@react-navigation/stack";
import React, { useLayoutEffect, useState, useEffect, Component } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { Button } from "react-native";
import { SafeAreaView } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Avatar } from "react-native-elements";
import CustomListItem from "./CustomListItem";
import firebase from "firebase";
import { AntDesign, SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";

const ChatMain = ({ navigation }) => {
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  const enterChat = (id, insight) => {
    navigation.navigate("Chat", {
      id,
      insight,
    });
  };

  const [chats, setChats] = useState([]);
  const [globalChats, setGlobalChats] = useState([]);
  const [image, setImage] = useState("");
  const [photo, setPhoto] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("privatechats")
      .where("user", "array-contains", firebase.auth().currentUser.email)
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
            /*name : doc.data().user[0]==firebase.auth().currentUser.email ? setUsers(doc.data().user[1]) : setUsers(doc.data().user[0])*/
          }))
        )
      );

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("globalchats")
      .onSnapshot((snapshot) =>
        setGlobalChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    firebase
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
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 10,
            }}
            onPress={() => navigation.navigate("AddChat")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="pencil" size={25} color="white" />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <Ionicons
          name="arrow-back-outline"
          size={25}
          color="white"
          onPress={() => {
            navigation.goBack();
          }}
          style={{ marginLeft: 20 }}
        />
      ),
    });
  }, []);

  return (
    <SafeAreaView>
      {chats.length === 0 ? (
        <View style={{ width: "100%", alignSelf: "center", marginTop: 70 }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Regular",
              color: "grey",
            }}
          >
            Why so anti-social!
          </Text>
          <FontAwesome5
            style={{ alignSelf: "center", marginTop: 5 }}
            name="sad-tear"
            size={24}
            color="grey"
          />
        </View>
      ) : (
        <ScrollView style={styles.container}>
          {chats.map(({ id, data: { user } }) => (
            <CustomListItem
              key={id}
              id={id}
              photoLink={defaultProfilePic}
              chatName={
                user[0] == firebase.auth().currentUser.email ? user[1] : user[0]
              }
              enterChat={enterChat}
            />
          ))}
          {globalChats.map(({ id, data: { chatName } }) => (
            <CustomListItem
              key={id}
              id={id}
              chatName={chatName}
              enterChat={enterChat}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
export default ChatMain;

const styles = StyleSheet.create({
  button: {
    width: 130,
    marginTop: 10,
  },

  container: {
    height: "100%",
  },
});
