import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
} from "react-native";

import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";
import { Avatar } from "react-native-elements";

function Comment(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");
  const commentInput = useRef(null);
  const [userImage, setUserImage] = useState("");
  const [username, setUsername] = useState("");
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }

        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .onSnapshot((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        setUserImage(snapshot.data().profileURL);
        setUsername(snapshot.data().name);
      });
  }, []);

  const onCommentSend = () => {
    if (text.trim() === "") {
      console.log("empty comment");
    } else {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .add({
          creator: firebase.auth().currentUser.uid,
          text: text.trim(),
          userProfileURL: userImage,
          username: username,
        })
        .then(() => {
          commentInput.current.value = "";
        });
    }
  };

  const displayComments = (array) =>
    array.map((item) => (
      <View
        key={item.id}
        style={{ flexDirection: "row", padding: 10, width: "100%" }}
      >
        <Avatar
          rounded
          source={{
            uri:
              item.userProfileURL === ""
                ? defaultProfilePic
                : item.userProfileURL,
          }}
        />
        <Text style={[styles.comment, { fontFamily: "Bold" }]}>
          {item.username}
          {"\n"}
          <Text style={[styles.comment, { fontFamily: "Regular" }]}>
            {item.text}
          </Text>
        </Text>
      </View>
    ));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={90}
    >
      <ScrollView style={{ height: "80%" }}>
        {displayComments(comments)}
      </ScrollView>

      <View style={styles.inputDesign}>
        <TextInput
          maxLength={40}
          ref={commentInput}
          style={styles.textInput}
          placeholder="Comment here..."
          onChangeText={(text) => setText(text)}
        />
        <View style={styles.typeButton}>
          <Text
            style={styles.typeText}
            onPress={() => {
              onCommentSend();
            }}
          >
            Send
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    height: "100%",
  },
  textInput: {
    color: "#102F44",
    fontFamily: "Regular",
    fontSize: 20,
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    padding: 10,
  },

  typeButton: {
    width: 375,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CE2029",
    paddingVertical: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#CE2029",
    borderWidth: 2,
  },
  typeText: {
    color: "white",
    fontFamily: "Regular",
  },
  comment: {
    color: "#102F44",
    fontSize: 15,
    marginLeft: 10,
  },
});

export default connect(mapStateToProps, mapDispatchProps)(Comment);
