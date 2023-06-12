import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  ActivityIndicator,
} from "react-native";

import firebase from "firebase";
require("firebase/firestore");

import { Avatar } from "react-native-elements";

export default function Search(props) {
  const [users, setUsers] = useState([]);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [recommendation, setRecommendation] = useState(true);
  const [mount, setMount] = useState(true);
  const searchInput = useRef(null);
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  useEffect(() => {
    retrieveArtistGenre();
  }, [mount]);

  const retrieveArtistGenre = () => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        console.log("2", snapshot.data().genre);
        setRecommendation(true);
        snapshot.data().genre.length > 0 ? (
          firebase
            .firestore()
            .collection("users")
            .where("name", "!=", snapshot.data().name)
            .where("genre", "array-contains-any", snapshot.data().genre)
            .get()
            .then((snapshot) => {
              let recommendedUsers = snapshot.docs.map((doc) => {
                const data = doc.data();
                const id = doc.id;
                return { id, ...data };
              });
              setRecommendedUsers(recommendedUsers);
              console.log("f", recommendedUsers);
            })
        ) : (
          <ActivityIndicator
            size="small"
            color="#B4FCFB"
            style={{ margin: 10 }}
          />
        );
      });
  };

  const fetchUsers = (search) => {
    if (search === "") {
      setRecommendation(true);
      setUsers([]);
    } else {
      setRecommendation(false);
      firebase
        .firestore()
        .collection("users")
        .where("name", "==", search)
        .get()
        .then((snapshot) => {
          let users = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUsers(users);
        });
    }
  };

  return (
    <View style={styles.screenContainer}>
      <TextInput
        ref={searchInput}
        style={styles.textInput}
        placeholder="Type Here..."
        onChangeText={(search) => fetchUsers(search)}
      />
      {recommendation ? (
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Recommended for you</Text>
          </View>
          <FlatList
            style={{ marginTop: 20 }}
            numColumns={1}
            horizontal={false}
            data={recommendedUsers}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  borderColor: "black",
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 5,
                  marginHorizontal: 10,
                }}
                onPress={() =>
                  props.navigation.navigate("Profile", { uid: item.id })
                }
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
        </View>
      ) : (
        <View style={styles.container}>
          <View>
            <Text style={styles.title}>Search Results</Text>
          </View>
          <FlatList
            style={{ marginTop: 20 }}
            numColumns={1}
            horizontal={false}
            data={users}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  marginVertical: 10,
                  borderColor: "black",
                  borderRadius: 5,
                  borderWidth: 1,
                  padding: 5,
                  marginHorizontal: 10,
                }}
                onPress={() =>
                  props.navigation.navigate("Profile", { uid: item.id })
                }
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  profileName: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 15,
    marginLeft: 10,
    marginTop: 10,
  },
  textInput: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#CE2029",
    padding: 10,
    marginTop: 20,
    marginHorizontal: 10,
  },
  title: {
    color: "black",
    marginLeft: 10,
    marginTop: 20,
    fontSize: 20,
    fontFamily: "Regular",
  },
});
