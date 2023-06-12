import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, Dimensions } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import { Video } from "expo-av";
import { AntDesign } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";

function PostScreen(props) {
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  //firebase.firestore().collection("posts").doc(props.route.params.item.user.id);
  useEffect(() => {
    setPost(props.route.params.item);
    setUser(props.route.params.user);
    console.log(props.route.params.user);
  }, [props.route.params.item]);

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

  const onDelete = () => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .doc(post.id)
      .delete()
      .then(props.navigation.goBack);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        {user.email === firebase.auth().currentUser.email ? (
          <View style={styles.logoutBtn}>
            <Text style={styles.logoutText} onPress={() => onDelete()}>
              Delete
            </Text>
          </View>
        ) : (
          <View />
        )}

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
                  user.profileURL === "" ? defaultProfilePic : user.profileURL,
              }}
            />
            <Text style={styles.textContainer}>{user.name}</Text>
          </View>
          <Video
            style={{ flex: 1 }}
            source={{ uri: post.downloadURL }}
            useNativeControls
            resizeMode="contain"
            isLooping={true}
          />
          <View>
            <Text style={styles.comment}>{post.caption}</Text>
          </View>
          <View style={styles.flexRow}>
            {post.currentUserLike ? (
              <AntDesign
                style={styles.like}
                name="like1"
                size={24}
                color="#98FB98"
                onPress={() => onDislikePress(user.uid, post.id)}
              />
            ) : (
              <AntDesign
                style={styles.like}
                name="like1"
                size={24}
                color="grey"
                onPress={() => onLikePress(user.uid, post.id)}
              />
            )}
            <Foundation
              name="comment"
              size={24}
              color="grey"
              style={styles.like}
              onPress={() =>
                props.navigation.navigate("Comment", {
                  postId: post.id,
                  uid: user.uid,
                })
              }
            />
          </View>
        </View>
      </View>
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
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});
export default connect(mapStateToProps, null)(PostScreen);

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
