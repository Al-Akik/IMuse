import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Dimensions } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { Entypo } from "@expo/vector-icons";

function FeedScreen(props) {
  const [posts, setPosts] = useState([]);
  const [image, setImage] = useState(null);
  const [userName, setUserName] = useState("");
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  useEffect(() => {
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
    console.log(posts);
  }, [props.usersFollowingLoaded, props.feed]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("interests")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) {
          firebase
            .firestore()
            .collection("interests")
            .doc(firebase.auth().currentUser.uid)
            .set({
              genres: [],
            });
        }
      });
  }, []);

  useEffect(() => {
    firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setUserName(snapshot.data().name);
          if (snapshot.data().profileURL === "") {
            setImage(defaultProfilePic);
          } else {
            setImage(snapshot.data().profileURL);
          }
        }
      });
  }, []);

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };
  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };


  return (
    <View style={styles.container}>
      {posts.length === 0 ? (
        <View style={{ width: "100%", alignSelf: "center", marginTop: 70 }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Regular",
              color: "grey",
            }}
          >
            No current feed
          </Text>
          <Entypo
            style={{ alignSelf: "center", marginTop: 5 }}
            name="emoji-sad"
            size={24}
            color="grey"
          />
        </View>
      ) : (
        <View style={styles.containerGallery}>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <View style={styles.containerVideo}>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    justifyContent: "flex-start",
                  }}
                >
                  <Avatar
                    rounded
                    source={{
                      uri:
                      image
                    }}
                  />
                  <Text style={styles.textContainer}>
    {userName}
</Text>
                </View>
                <Video
                  style={{ flex: 1 }}
                  source={{ uri: item.downloadURL }}
                  useNativeControls
                  resizeMode="contain"
                  isLooping={true}
                />
                <View>
                  <Text style={styles.comment}>{item.caption}</Text>
                </View>
                <View style={styles.flexRow}>
                  {item.currentUserLike ? (
                    <AntDesign
                      style={styles.like}
                      name="like1"
                      size={24}
                      color="#98FB98"
                      onPress={() => onDislikePress(item.user.uid, item.id)}
                    />
                  ) : (
                    <AntDesign
                      style={styles.like}
                      name="like1"
                      size={24}
                      color="grey"
                      onPress={() => onLikePress(item.user.uid, item.id)}
                    />
                  )}
                  <Foundation
                    name="comment"
                    size={24}
                    color="grey"
                    style={styles.like}
                    onPress={() =>
                      props.navigation.navigate("Comment", {
                        postId: item.id,
                        uid: item.user.uid,
                      })
                    }
                  />
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  textContainer: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 20,
    marginLeft: 10,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    height: "100%",
  },
  containerVideo: {
    width: WIDTH,
    aspectRatio: 9 / 11,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  comment: {
    color: "black",
    fontFamily: "Regular",
    fontSize: 15,
    marginLeft: 20,
  },
  like: {
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 20,
  },
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});
export default connect(mapStateToProps, null)(FeedScreen);

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
