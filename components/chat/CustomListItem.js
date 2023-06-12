import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";

const CustomListItem = ({ id, chatName, enterChat, photoLink }) => {
  const [photo, setPhoto] = useState([]);
  const defaultProfilePic =
    "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("users")
      .where("email", "==", chatName)
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

  return (
    <ListItem
      key={id}
      bottomDivider
      onPress={() => enterChat(id, chatName, photoLink)}
    >
      {photo.map(({ data: { profileURL }, index }) => (
        <Avatar
          key={index}
          id={index}
          rounded
          source={{
            uri: profileURL != "" ? profileURL : defaultProfilePic,
          }}
        />
      ))}
      <ListItem.Content>
        <ListItem.Title style={{ fontFamily: "Bold", marginTop: 10 }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle
          numberOfLines={1}
          ellipsizeMode="tail"
        ></ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
