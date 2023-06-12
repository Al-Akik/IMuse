import React, { Component } from "react";
import { View, StyleSheet, Image, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

import firebase from "firebase";
import "firebase/firestore";

export class GenreScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genre: [],
      genres: [
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
      ],
      emptyInput: false,
      error: "",
    };

    this.addGenre = this.addGenre.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
  }

  addGenre(item) {
    const { genre } = this.state;
    console.log(item);
    this.setState({ emptyInput: false });
    if (genre.includes(item)) {
      this.setState({ error: "" });
      var array = [...genre];
      var index = array.indexOf(item);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ genre: array });
      }
      console.log("removed", genre);
    } else {
      if (genre.length < 3) {
        this.setState({ error: "" });
        this.setState({
          genre: [...genre, item],
        });
        console.log("added", genre);
      } else {
        this.setState({ error: "You can only choose 3 genres" });
      }
    }
  }

  onSignUp() {
    const { genre } = this.state;
    const { name, email, password, type } = this.props.route.params;
    if (genre.length !== 0) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((result) => {
          firebase
            .firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
              name,
              email,
              type,
              genre,
              profileURL: "",
            });
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      this.setState({ emptyInput: true });
    }
  }

  render() {
    const { genres, genre, emptyInput } = this.state;
    return (
      <View style={styles.screenContainer}>
        <Image
          source={require("../../assets/images/iMuse-logo.jpg")}
          style={styles.imageContainer}
        />
        <FlatList
          style={styles.flatlist}
          numColumns={1}
          horizontal={false}
          data={genres}
          renderItem={(item) => (
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={
                  genre.includes(item.item)
                    ? styles.typeButton2
                    : styles.typeButton
                }
                key={item.index}
              >
                <Text
                  key={item.index}
                  style={
                    genre.includes(item.item)
                      ? styles.typeText2
                      : styles.typeText
                  }
                  onPress={() => {
                    this.addGenre(item.item);
                  }}
                >
                  {item.item}
                </Text>
              </View>
            </View>
          )}
        />
        <View style={styles.registerContainer}>
          <Text style={styles.registerText} onPress={() => this.onSignUp()}>
            Sign Up
          </Text>
        </View>
        <View style={{ height: 30 }}>
          <Text style={styles.artistTypes}>
            {emptyInput ? "You should specify a genre" : null}
            {this.state.error === "" ? null : this.state.error}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    height: "100%",
    flex: 1,
  },
  imageContainer: {
    width: "80%",
    height: "20%",
    alignSelf: "center",
  },
  registerContainer: {
    width: 300,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#CE2029",
    paddingVertical: 10,
    borderRadius: 5,
  },
  registerText: {
    color: "white",
    fontFamily: "Regular",
    shadowColor: "#A2E2E1",
  },
  flatlist: {
    alignSelf: "center",
    height: "70%",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  artistTypes: {
    color: "#CE2029",
    fontFamily: "Regular",
    fontSize: 13,
    textAlign: "center",
    marginTop: 5,
  },
  typeButton: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#102F44",
    borderWidth: 3,
  },
  typeButton2: {
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "#CE2029",
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#CE2029",
    borderWidth: 3,
  },
  typeText: {
    color: "#102F44",
    fontFamily: "Regular",
  },
  typeText2: {
    color: "white",
    fontFamily: "Regular",
  },
});

export default function (props) {
  const navigation = useNavigation();

  return <GenreScreen {...props} navigation={navigation} />;
}
