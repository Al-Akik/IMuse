import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { MaterialIcons } from "@expo/vector-icons";

export default function ListOfAppliers(props, { navigation }) {
  const [appliers, setAppliers] = useState([]);
  const [loaded, setLoaded] = useState(null);
  const [chats, setChats] = useState("");

  useEffect(() => {
    fetchAppliers(props.route.params.rId);
  }, []);

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
          }))
        )
      );
    return unsubscribe;
  }, []);

  const createChat = (insight) => {
    firebase
      .firestore()
      .collection("privatechats")
      .where("user", "in", [
        [firebase.auth().currentUser.email, insight],
        [insight, firebase.auth().currentUser.email],
      ])
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          console.log("?", snapshot);
          snapshot.docs.map((doc) => {
            const id = doc.id;
            console.log("docId", id);
            console.log("Chat Already Exists");
            props.navigation.navigate("Chat", {
              id,
              insight,
            });
          });
        } else {
          firebase
            .firestore()
            .collection("privatechats")
            .add({
              chatName: insight,
              user: [firebase.auth().currentUser.email, insight],
            })
            .then((snapshot) => {
              const id = snapshot._.id;
              props.navigation.navigate("Chat", {
                id,
                insight,
              });
            })
            .catch((error) => alert(error));
        }
      });
  };

  const fetchAppliers = (rId) => {
    let array = [];
    console.log("id", rId);
    firebase
      .firestore()
      .collection("requests")
      .doc(rId)
      .collection("appliers")
      .get()
      .then((snapshot) => {
        let requestAppliers = snapshot.docs.map((doc) => {
          const id = doc.id;

          firebase
            .firestore()
            .collection("users")
            .doc(id)
            .get()
            .then((snapshot) => {
              const data = snapshot.data();
              console.log("snapshot", id, data);
              array.push({ id, ...data });
              console.log("requestAppliers", array);
              setAppliers(array);
              console.log("appliers", appliers);
            });
        });
      });
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.title}>
        <Text style={styles.titleTxt}>Appliers</Text>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={appliers}
          renderItem={({ item }) => {
            console.log("item", item);
            return (
              <View style={styles.applier}>
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate("Profile", { uid: item.id })
                  }
                >
                  <Text style={styles.profileName}>{item.name}</Text>
                </TouchableOpacity>
                <MaterialIcons
                  name="contact-mail"
                  size={24}
                  color="black"
                  style={styles.contactIcon}
                  onPress={() => createChat(item.email)}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    width: "100%",
    margin: 20,
  },
  titleTxt: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 20,
  },
  applier: {
    marginBottom: 20,
    marginHorizontal: 20,
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileName: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 15,
  },
  contactIcon: {
    alignSelf: "flex-end",
  },
});
