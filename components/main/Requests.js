import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import ModalPicker from "./ModalPicker";

export default function RequestsScreen(props, { navigation }) {
  const [band, setBand] = useState();
  const [addRequest, setAddRequest] = useState(false);
  const [description, setDescription] = useState("");
  const [requests, setRequests] = useState([]);
  const [userType, setUserType] = useState([]);
  const [userGenre, setUserGenre] = useState([]);
  const [requestsIds, setRequestsIds] = useState([]);
  const descriptionInput = useRef(null);
  const [chooseGenre, setChooseGenre] = useState("");
  const [chooseType, setChooseType] = useState("");
  const [isModalVisibleGenre, setIsModalVisibleGenre] = useState(false);
  const [isModalVisibleType, setIsModalVisibleType] = useState(false);
  const [name, setName] = useState("");
  const [onlyValidRequests, setOnlyValidRequests] = useState([]);

  useEffect(() => {
    checkIfBand();
  }, [band]);

  useEffect(() => {
    fetchRequestsIds();
  }, []);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        setName(snapshot.data().name);
      });
  }, []);

  const fetchRequestsIds = () => {
    firebase
      .firestore()
      .collection("applications")
      .doc(firebase.auth().currentUser.uid)
      .collection("requestsIds")
      .onSnapshot((snapshot) => {
        let requests = snapshot.docs.map((doc) => {
          const id = doc.id;
          return id.toString();
        });
        setRequestsIds(requests);
      });
  };

  const checkIfBand = () => {
    const { uid } = props.route.params;
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        let array = snapshot.data().type;
        let array2 = snapshot.data().genre;
        setUserType(array);
        setUserGenre(array2);
        if (array[0] === "Band") {
          setBand(true);
        } else {
          setBand(false);
        }
        if (userType.length > 0) {
          fetchBandRequests();
        }
      });
  };

  const saveRequestData = () => {
    const today = new Date();
    firebase
      .firestore()
      .collection("requests")
      .add({
        creatorId: firebase.auth().currentUser.uid,
        type: chooseType,
        genre: chooseGenre,
        description,
        creation: today.toString().slice(0, 28),
        name: name,
      })
      .then(() => {
        setChooseType("");
        setChooseGenre("");
        setDescription("");
        descriptionInput.current.value = "";
        setAddRequest(false);
        fetchBandRequests();
      });
  };

  const fetchBandRequests = () => {
    band
      ? firebase
          .firestore()
          .collection("requests")
          .where("creatorId", "==", firebase.auth().currentUser.uid)
          .orderBy("creation", "desc")
          .get()
          .then((snapshot) => {
            let bandRequests = snapshot.docs.map((doc) => {
              const { type, genre, description, creation, creatorId, name } =
                doc.data();
              const id = doc.id;
              return {
                id,
                type,
                genre,
                description,
                creation,
                creatorId,
                name,
              };
            });
            let array = [];
            for (let i = 0; i < bandRequests.length; i++) {
              array.push(bandRequests[i]);
            }
            setRequests(array);
          })
      : firebase
          .firestore()
          .collection("requests")
          .where("type", "in", userType)
          .get()
          .then((snapshot) => {
            let bandRequests = snapshot.docs.map((doc) => {
              const { type, genre, description, creation, creatorId, name } =
                doc.data();
              const id = doc.id;
              if (userGenre.includes(genre.toString())) {
                return {
                  id,
                  type,
                  genre,
                  description,
                  creation,
                  creatorId,
                  name,
                  empty: false,
                };
              } else {
                return { empty: true };
              }
            });
            console.log("bandRequests", bandRequests);
            setRequests(bandRequests);
            let array = [];
            bandRequests.map((item) => {
              if (!item.empty) {
                array.push(item);
              }
            });
            setOnlyValidRequests(array);
            console.log("blabla", onlyValidRequests);
          });
  };

  const deleteRequest = (requestId) => {
    firebase
      .firestore()
      .collection("requests")
      .doc(requestId)
      .delete()
      .then(fetchBandRequests());
  };

  const applyToRequest = (requestId) => {
    firebase
      .firestore()
      .collection("requests")
      .doc(requestId)
      .collection("appliers")
      .doc(firebase.auth().currentUser.uid)
      .set({})
      .then(fetchBandRequests());
    firebase
      .firestore()
      .collection("applications")
      .doc(firebase.auth().currentUser.uid)
      .collection("requestsIds")
      .doc(requestId)
      .set({});
  };

  const cancelRequest = (requestId) => {
    firebase
      .firestore()
      .collection("requests")
      .doc(requestId)
      .collection("appliers")
      .doc(firebase.auth().currentUser.uid)
      .delete()
      .then(fetchBandRequests());
    firebase
      .firestore()
      .collection("applications")
      .doc(firebase.auth().currentUser.uid)
      .collection("requestsIds")
      .doc(requestId)
      .delete();
  };

  const changeModalVisibilityGenre = (bool) => {
    setIsModalVisibleGenre(bool);
  };
  const changeModalVisibilityType = (bool) => {
    setIsModalVisibleType(bool);
  };

  const setDataGenre = (data) => {
    setChooseGenre(data);
  };

  const setDataType = (data) => {
    setChooseType(data);
  };

  if (band) {
    return (
      <ScrollView
        style={{
          flex: 1,
          opacity: isModalVisibleGenre || isModalVisibleType ? 0.3 : 1,
          backgroundColor:
            isModalVisibleGenre || isModalVisibleType ? "black" : "white",
        }}
      >
        {addRequest ? (
          <View>
            <AntDesign
              name="minuscircleo"
              size={24}
              color="red"
              style={styles.plusIcon}
              onPress={() => setAddRequest(false)}
            />
            <View style={styles.addRequest}>
              <View>
                <TouchableOpacity
                  style={[styles.inputContainer, { marginBottom: 10 }]}
                  onPress={() => changeModalVisibilityType(true)}
                >
                  <Text style={styles.textInput}>
                    {chooseType === "" ? "Select a type..." : chooseType}
                  </Text>
                </TouchableOpacity>
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={isModalVisibleType}
                  nRequestClose={() => changeModalVisibilityType(false)}
                >
                  <ModalPicker
                    changeModalVisibility={changeModalVisibilityType}
                    setData={setDataType}
                    type={TYPES}
                  />
                </Modal>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.inputContainer}
                  onPress={() => changeModalVisibilityGenre(true)}
                >
                  <Text style={styles.textInput}>
                    {chooseGenre === "" ? "Select a genre..." : chooseGenre}
                  </Text>
                </TouchableOpacity>
                <Modal
                  transparent={true}
                  animationType="fade"
                  visible={isModalVisibleGenre}
                  nRequestClose={() => changeModalVisibilityGenre(false)}
                >
                  <ModalPicker
                    changeModalVisibility={changeModalVisibilityGenre}
                    setData={setDataGenre}
                    type={GENRES}
                  />
                </Modal>
              </View>
              <View style={{ marginVertical: 5 }} />
              <View style={styles.inputContainer}>
                <TextInput
                  ref={descriptionInput}
                  placeholder="Description"
                  placeholderTextColor="grey"
                  style={styles.textInput}
                  multiline={true}
                  maxLength={70}
                  numberOfLines={2}
                  onChangeText={(description) => setDescription(description)}
                />
              </View>
              <View style={{ marginVertical: 5 }} />
              <View style={styles.submitContainer}>
                <Text
                  style={styles.submitText}
                  onPress={() => saveRequestData()}
                >
                  Submit
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <AntDesign
            name="pluscircleo"
            size={24}
            color="green"
            style={styles.plusIcon}
            onPress={() => setAddRequest(true)}
          />
        )}

        <View>
          <Text style={styles.title}>My band's openings</Text>
        </View>
        <View style={{ flex: 1 }}>
          {requests.length === 0 ? (
            <View style={{ width: "100%", alignSelf: "center", marginTop: 70 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Regular",
                  color: "grey",
                }}
              >
                No current openings
              </Text>
              <Entypo
                style={{ alignSelf: "center", marginTop: 5 }}
                name="emoji-sad"
                size={24}
                color="grey"
              />
            </View>
          ) : (
            <FlatList
              style={styles.flatlist}
              horizontal={true}
              data={requests}
              renderItem={({ item, index }) => (
                <View style={styles.requests}>
                  <View
                    key={index}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                      <Feather
                        style={{ alignSelf: "center", marginRight: 15 }}
                        name="list"
                        size={24}
                        color="black"
                        onPress={() => {
                          let rId = item.id;
                          props.navigation.navigate("ListOfAplliers", { rId });
                        }}
                      />
                      <FontAwesome
                        style={{ alignSelf: "center" }}
                        name="times"
                        size={24}
                        color="black"
                        onPress={() => deleteRequest(item.id)}
                      />
                    </View>
                  </View>
                  <Text style={styles.text}>{item.type}</Text>
                  <Text style={styles.text}>{item.genre}</Text>
                  <Text style={styles.text}>
                    Released on:{"\n"}
                    {item.creation}
                  </Text>
                  <Text style={styles.text}>{item.description}</Text>
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>
    );
  } else {
    return (
      <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
        <View style={{ width: "100%", alignSelf: "center" }}>
          <Text style={[styles.title, { marginTop: 40, textAlign: "center" }]}>
            Openings for you
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {
            (console.log(onlyValidRequests),
            onlyValidRequests.length === 0 ? (
              <View
                style={{ width: "100%", alignSelf: "center", marginTop: 70 }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontFamily: "Regular",
                    color: "grey",
                  }}
                >
                  No current openings
                </Text>
                <Entypo
                  style={{ alignSelf: "center", marginTop: 5 }}
                  name="emoji-sad"
                  size={24}
                  color="grey"
                />
              </View>
            ) : (
              <FlatList
                style={styles.flatlist}
                horizontal={true}
                data={onlyValidRequests}
                renderItem={({ item, index }) => (
                  <View style={[styles.requests, { height: 300 }]} key={index}>
                    <View style={{ height: 220 }}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.text}>{item.type}</Text>
                      <Text style={styles.text}>{item.genre}</Text>
                      <Text style={styles.text}>
                        Released on:{"\n"}
                        {item.creation}
                      </Text>
                      <Text style={styles.text}>{item.description}</Text>
                    </View>

                    {requestsIds.includes(item.id) ? (
                      <View style={styles.cancelContainer}>
                        <TouchableOpacity
                          onPress={() => cancelRequest(item.id)}
                        >
                          <Text style={styles.submitText}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.submitContainer}>
                        <TouchableOpacity
                          onPress={() => applyToRequest(item.id)}
                        >
                          <Text style={styles.submitText}>Apply</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              />
            ))
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  plusIcon: {
    margin: 20,
    alignSelf: "flex-end",
  },
  title: {
    alignSelf: "center",
    color: "black",
    marginTop: 20,
    fontSize: 20,
    fontFamily: "Regular",
    marginBottom: 20,
  },
  textInput: {
    fontSize: 15,
    fontFamily: "Regular",
    color: "black",
    alignSelf: "center",
  },
  addRequest: {
    width: WIDTH,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    marginHorizontal: 20,
  },
  requests: {
    width: 300,
    height: 250,
    backgroundColor: "transparent",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 40,
    marginHorizontal: 10,
    padding: 15,
  },
  inputContainer: {
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
  },
  textInput: {
    width: "100%",
    color: "black",
    fontSize: 15,
    fontFamily: "Regular",
    padding: 5,
  },
  submitContainer: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#55acee",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  cancelContainer: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "red",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  submitText: {
    width: "100%",
    color: "white",
    fontFamily: "Regular",
  },
  text: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 15,
    marginVertical: 5,
  },
  name: {
    color: "black",
    fontFamily: "Bold",
    fontSize: 20,
    alignSelf: "flex-start",
  },
  flatlist: {
    width: WIDTH,
    marginHorizontal: 10,
    display: "flex",
    flex: 1,
  },
});

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const TYPES = [
  "Singer",
  "Producer",
  "Guitarist",
  "Pianist",
  "Violinist",
  "Cello Player",
  "Flute Player",
];

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
