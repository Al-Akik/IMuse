import React, { Component } from "react";
import { View, TextInput, StyleSheet, Image, Text, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import firebase from "firebase";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: "",
    };

    this.onSignIn = this.onSignIn.bind(this);
  }

  onSignIn() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result);
        this.setState({ error: "" });
      })
      .catch((error) => {
        console.log(error);
        if (error.code === "auth/network-request-failed") {
          this.setState({ error: "No internet connection" });
        } else if (error.code === "auth/wrong-password") {
          this.setState({ error: "Invalid Password" });
        } else if (error.code === "auth/user-not-found") {
          this.setState({
            error: "No user found\nKindly Sign up if you don't have an account",
          });
        } else if (error.code === "auth/invalid-email") {
          this.setState({ error: "Email is badly formatted" });
        }
      });
  }

  render() {
    return (
      <View style={styles.screenContainer}>
        <Image
          source={require("../../assets/images/iMuse-logo.jpg")}
          style={styles.imageContainer}
        />

        <View style={styles.firstInputContainer}>
          <Entypo name="email" size={20} color="#102F44" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#102F44"
            style={styles.textInput}
            onChangeText={(email) => this.setState({ email: email.trim() })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#102F44" />
          <TextInput
            secureTextEntry
            placeholder="Password"
            placeholderTextColor="#102F44"
            style={styles.textInput}
            onChangeText={(password) =>
              this.setState({ password: password.trim() })
            }
          />
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText} onPress={() => this.onSignIn()}>
            Sign In
          </Text>
        </View>
        <View>
          <Text style={styles.error}>{this.state.error}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    height: "100%",
  },
  imageContainer: {
    width: "80%",
    height: "20%",
    marginTop: 50,
    alignSelf: "center",
  },
  firstInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 55,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderTopColor: "#102F44",
    borderRightColor: "#102F44",
    borderBottomColor: "#102F44",
    borderLeftColor: "#102F44",
    paddingVertical: 5,
    marginTop: 50,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 55,
    borderWidth: 2,
    paddingHorizontal: 10,
    borderColor: "#102F44",
    borderRadius: 5,
    borderTopColor: "#102F44",
    borderRightColor: "#102F44",
    borderBottomColor: "#102F44",
    borderLeftColor: "#102F44",
    paddingVertical: 5,
    marginTop: 15,
    marginBottom: 10,
  },
  textInput: {
    textAlign: "center",
    width: "100%",
    paddingHorizontal: 10,
    color: "#102F44",
    fontSize: 15,
  },
  loginContainer: {
    marginHorizontal: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#CE2029",
    paddingVertical: 10,
    borderRadius: 5,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
  },
  loginText: {
    color: "#FFF",
    fontFamily: "Regular",
  },
  error: {
    color: "red",
    fontFamily: "Regular",
    fontSize: 15,
    textAlign: "center",
    marginTop: 15,
  },
});

export default Login;
