import React, { useState, useLayoutEffect, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Input, Button, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "firebase";

const AddChatScreen = ({ navigation }) => {
  /*const [email, setEmail] = useState("");*/
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [photo, setPhoto] = useState([]);
  const searchInput = useRef(null);

  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add New Chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

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
    return unsubscribe;
  }, []);

  const createChat = (email) => {
    firebase
      .firestore()
      .collection("privatechats")
      .where("user", "in", [
        [firebase.auth().currentUser.email, email],
        [email, firebase.auth().currentUser.email],
      ])
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          console.log("Chat Already Exists", snapshot);
          const id = snapshot.docs[0]._.id;
          const insight = email;
          navigation.navigate("Chat", { id, insight });
        } else {
          firebase
            .firestore()
            .collection("privatechats")
            .add({
              chatName: email,
              user: [firebase.auth().currentUser.email, email],
            })
            .then((snapshot) => {
              const id = snapshot._.id;
              const insight = email;
              navigation.navigate("Chat", { id, insight });
            })
            .catch((error) => alert(error));
        }
      });
  };

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("name", "==", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          if (id === firebase.auth().currentUser.uid) {
            return {};
          } else {
            return { id, ...data };
          }
        });
        setUsers(users);
      });
  };

  const createGlobalChat = async () => {
    await firebase
      .firestore()
      .collection("globalchats")
      .add({
        chatName: email,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={searchInput}
        style={styles.textInput}
        placeholder="Type Here..."
        onChangeText={(search) => fetchUsers(search)}
      />

      {
        <FlatList
          style={{ marginVertical: 30, marginHorizontal: 10 }}
          numColumns={1}
          horizontal={false}
          data={users}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                createChat(item.email);
              }}
              style={{
                flexDirection: "row",
                marginVertical: 10,
                borderColor: "black",
                borderRadius: 5,
                borderWidth: 1,
                padding: 5,
                width: "100%",
              }}
            >
              <Avatar
                rounded
                source={{
                  uri:
                    item.profileURL === ""
                      ? defaultProfilePic
                      : item.profileURL,
                }}
              />
              <Text style={styles.profileName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      }
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
  textInput: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#CE2029",
    padding: 10,
    marginTop: 20,
    marginHorizontal: 10,
  },
  profileName: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 23,
    marginLeft: 15,
    alignSelf: "center",
  },
});
