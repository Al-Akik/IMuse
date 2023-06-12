import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import { Video } from "expo-av";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [image, setImage] = useState(null);
  const [interestingGenres, setInterestingGenres] = useState([]);
  const [currentGenres, setCurrentGenres] = useState([]);
  const [found, setFound] = useState([]);
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  useEffect(() => {
    fetchProfilePicture();
    updateInterests();
    fetchUserPosts();
  }, [props.route.params.uid]);

  useEffect(() => {
    const { currentUser, posts } = props;

    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
      fetchUserPosts();
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following, props.currentUser]);

  const fetchUserPosts = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .orderBy("creation", "asc")
      .onSnapshot((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUserPosts(posts);
      });
  };

  const updateInterests = async () => {
    await firebase
      .firestore()
      .collection("users")
      .doc(props.route.params.uid)
      .get()
      .then((snapshot) => {
        snapshot.data().genre.map((item) => {
          setInterestingGenres(interestingGenres.push(item));
        });
      });
    await firebase
      .firestore()
      .collection("interests")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then(async (snapshot) => {
        snapshot.data().genres.map((item) => {
          setCurrentGenres(currentGenres.push(item));
        });

        currentGenres.map((item) => {
          if (interestingGenres.includes(item.key)) {
            item.value++;
            setFound(found.push(item.key));
          }
        });

        interestingGenres.map((item) => {
          if (!found.includes(item)) {
            setCurrentGenres(
              currentGenres.push({
                key: item,
                value: 1,
              })
            );
          }
        });
      });
    await firebase
      .firestore()
      .collection("interests")
      .doc(firebase.auth().currentUser.uid)
      .update({
        genres: currentGenres,
      });
    setInterestingGenres([]);
    setCurrentGenres([]);
    setFound([]);
  };

  const fetchProfilePicture = () => {
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot((snapshot) => {
          console.log("pic", snapshot.data().profileURL);
          if (snapshot.data().profileURL === "") {
            setImage(defaultProfilePic);
          } else {
            setImage(snapshot.data().profileURL);
          }
        });
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .onSnapshot((snapshot) => {
          console.log("pic", snapshot.data().profileURL);
          if (snapshot.data().profileURL === "") {
            setImage(defaultProfilePic);
          } else {
            setImage(snapshot.data().profileURL);
          }
        });
    }
  };

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return <View />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.btnsContainer}>
        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <View style={styles.followingBtn}>
                <Text style={styles.followingText} onPress={() => onUnfollow()}>
                  Following
                </Text>
              </View>
            ) : (
              <View style={styles.followBtn}>
                <Text style={styles.followText} onPress={() => onFollow()}>
                  Follow
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.logoutBtn}>
            <Text style={styles.logoutText} onPress={() => onLogout()}>
              Logout
            </Text>
          </View>
        )}
      </View>
      <View style={styles.profileHeader}>
        <View style={styles.imageContainer}>
          {image === null ? (
            <ActivityIndicator
              size="large"
              color="#B4FCFB"
              style={{ margin: 20 }}
            />
          ) : (
            <TouchableOpacity
              key={props.route.params.uid}
              disabled={
                props.route.params.uid === firebase.auth().currentUser.uid
                  ? false
                  : true
              }
              onPress={() => {
                props.navigation.navigate("ProfilePicture", {});
              }}
            >
              <Avatar rounded style={styles.avatar} source={{ uri: image }} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.containerInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.email}>{user.email}</Text>
          </View>
          <View style={styles.nameContainer}>
            <Text
              onPress={() => {
                user.type[0] !== "Band"
                  ? props.navigation.navigate("ModifyType")
                  : null;
              }}
              style={styles.type}
            >
              Types:{" "}
              {user.type.map((t, index) => (
                <Text key={index}>{t} </Text>
              ))}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text
              onPress={() => props.navigation.navigate("ModifyGenre", {})}
              style={styles.type}
            >
              Genres:{" "}
              {user.genre.map((t, index) => (
                <Text key={index}>{t} </Text>
              ))}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.horizontalLine}></View>

      <View style={styles.containerGallery}>
        <FlatList
          style={{ marginHorizontal: 10 }}
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item, index }) => (
            <View style={styles.containerVideo} key={index}>
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate("PostScreen", { item, user })
                }
              >
                <Video
                  source={{ uri: item.downloadURL }}
                  style={styles.video}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  profileHeader: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    padding: 10,
  },
  containerGallery: {
    flex: 1,
  },
  video: {
    flex: 1,
    aspectRatio: 9 / 16,
  },
  containerVideo: {
    flex: 1 / 3,
  },
  nameContainer: {
    marginLeft: 10,
  },
  name: {
    color: "black",
    fontFamily: "Bold",
    fontSize: 30,
  },
  email: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 15,
    marginTop: 5,
  },
  type: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 13,
    marginTop: 5,
  },
  logoutBtn: {
    alignSelf: "flex-end",
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginRight: 20,
    backgroundColor: "white",
    paddingVertical: 5,
    borderRadius: 5,
    borderColor: "coral",
    borderWidth: 2,
  },
  logoutText: {
    color: "coral",
    fontFamily: "Regular",
    fontSize: 15,
  },
  followingBtn: {
    alignSelf: "flex-end",
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginRight: 20,
    backgroundColor: "#98FB98",
    paddingVertical: 5,
    borderRadius: 5,
    borderColor: "#98FB98",
    borderWidth: 2,
  },
  followingText: {
    color: "#102F44",
    fontFamily: "Regular",
    fontSize: 15,
  },
  followBtn: {
    alignSelf: "flex-end",
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    marginRight: 20,
    backgroundColor: "white",
    paddingVertical: 5,
    borderRadius: 5,
    borderColor: "#98FB98",
    borderWidth: 2,
  },
  followText: {
    color: "#98FB98",
    fontFamily: "Regular",
    fontSize: 15,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    width: 130,
    alignSelf: "center",
  },
  image: {
    flex: 1,
    width: 90,
    height: 90,
    aspectRatio: 1,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "darkgrey",
    alignSelf: "center",
  },
  btnsContainer: {
    width: WIDTH,
    justifyContent: "flex-end",
    paddingLeft: 20,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "grey",
    width: WIDTH,
    marginVertical: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    alignSelf: "center",
    borderRadius: 250,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});
export default connect(mapStateToProps, null)(Profile);

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
