import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

export default function EventsScreen(props) {
  const [events, setEvents] = useState([]);
  const [tmpInterests, setTmpInterests] = useState([]);
  const [interests, setInterests] = useState(["empty"]);

  useEffect(() => {
    fetchUserInterests();
  }, []);

  function compare(a, b) {
    if (a.value < b.value) {
      return 1;
    }
    if (a.value > b.value) {
      return -1;
    }
    return 0;
  }

  const fetchUserInterests = async () => {
    await firebase
      .firestore()
      .collection("interests")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        snapshot.data().genres.map((item) => {
          setTmpInterests(tmpInterests.push(item));
        });
        console.log("interests", tmpInterests);
        setTmpInterests(tmpInterests.sort(compare).slice(0, 5));
        tmpInterests.map((interest) => {
          setInterests(interests.push(interest.key));
        });
        console.log("interests", interests);
        fetchEvents();
        console.log("events2", events);
      });
  };

  const fetchEvents = async () => {
    await firebase
      .firestore()
      .collection("events")
      .where("genre", "in", interests)
      .onSnapshot((snapshot) => {
        let eventsArray = snapshot.docs.map((doc) => {
          const {
            creatorId,
            genre,
            price,
            eventImageUrl,
            dateAndTime,
            name,
            location,
          } = doc.data();
          const id = doc.id;
          return {
            id,
            genre,
            price,
            eventImageUrl,
            creatorId,
            dateAndTime,
            name,
            location,
          };
        });
        let array = [];
        for (let i = 0; i < eventsArray.length; i++) {
          array.push(eventsArray[i]);
          setEvents(events.push(eventsArray[i]));
        }
        console.log("array", array);
        setEvents(array);
        console.log("final", events);
      });
  };

  const deleteEvent = (eventId) => {
    firebase.firestore().collection("events").doc(eventId).delete();
  };

  return (
    <View style={styles.screenContainer}>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.title}>
          <Text style={styles.titleText}>Events you may be interested in</Text>
        </View>
        <AntDesign
          name="pluscircleo"
          size={24}
          color="green"
          style={styles.plusIcon}
          onPress={() => props.navigation.navigate("NewEvent", {})}
        />
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          style={styles.flatlist}
          numColumns={1}
          horizontal={true}
          data={events}
          renderItem={(item, index) => (
            <View style={styles.bigContainer}>
              <Text style={styles.name}>
                {item.item.name}{" "}
                {item.item.creatorId === firebase.auth().currentUser.uid ? (
                  <FontAwesome
                    style={{ alignSelf: "flex-end", marginRight: 5 }}
                    name="times"
                    size={20}
                    color="red"
                    onPress={() => deleteEvent(item.item.id)}
                  />
                ) : (
                  <View />
                )}
              </Text>

              <View style={styles.mainContainer} key={index}>
                <Image
                  style={styles.image}
                  source={{ uri: item.item.eventImageUrl }}
                />
                <Text style={styles.text}>{item.item.genre}</Text>
                <Text style={styles.text}>{item.item.dateAndTime}</Text>
                <Text style={styles.text}>{item.item.location}</Text>
                <Text style={styles.text}>{item.item.price} $</Text>
              </View>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  button: {
    width: 90,
    height: 30,
    paddingVertical: 5,
    backgroundColor: "white",
    borderColor: "green",
    borderRadius: 5,
    borderWidth: 2,
    alignSelf: "flex-end",
    marginLeft: 20,
    marginTop: 10,
  },
  buttonText: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    color: "green",
    fontFamily: "Regular",
    fontSize: 13,
  },
  title: {
    padding: 10,
    marginLeft: 10,
    marginTop: 10,
  },
  titleText: {
    color: "black",
    fontFamily: "Bold",
    fontSize: 15,
  },
  flatlist: {
    flex: 1,
    width: WIDTH,
    height: "100%",
    marginTop: 10,
  },
  bigContainer: {
    width: WIDTH,
    height: 350,
    marginHorizontal: 15,
    backgroundColor: "#102F44",
    borderRadius: 5,
  },
  mainContainer: {
    borderColor: "#102F44",
    borderRadius: 5,
    borderWidth: 3,
    width: WIDTH,
    height: 320,
    alignSelf: "center",
    backgroundColor: "white",
  },
  text: {
    width: "100%",
    textAlign: "center",
    color: "black",
    fontFamily: "Regular",
    fontSize: 13,
    marginVertical: 5,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    alignSelf: "center",
    aspectRatio: 4 / 3,
    flex: 1,
    borderRadius: 1,
  },
  name: {
    width: "100%",
    textAlign: "center",
    color: "white",
    fontFamily: "Bold",
    fontSize: 15,
    alignSelf: "center",
    margin: 3,
  },
  plusIcon: {
    margin: 20,
    alignSelf: "flex-end",
  },
});

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
