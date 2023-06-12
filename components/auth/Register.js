import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      repeatedPassword: "",
      falsePassword: false,
      isBand: false,
      type: [],
      emptyInput: false,
      isBand: false,
    };

    this.onNextPressed = this.onNextPressed.bind(this);
    this.render = this.render.bind(this);
    this.checkSingleArtist = this.checkSingleArtist.bind(this);
    this.checkBand = this.checkBand.bind(this);
  }

  checkSingleArtist() {
    this.setState({ isBand: false });
    const { type } = this.state;
    if (type.includes("Band")) {
      var array = [...type];
      var index = array.indexOf("Band");
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ type: array });
      }
      console.log("removed", type);
    }
  }

  checkBand() {
    this.setState({ isBand: true });
    const { type } = this.state;
    if (!type.includes("Band")) {
      this.setState({
        type: [...type, "Band"],
      });
      console.log("added", type);
    }
  }

  onNextPressed() {
    const { name, email, password, repeatedPassword, type } = this.state;
    const { navigation } = this.props;
    this.setState({ falsePassword: false });
    this.setState({ emptyInput: false });
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      repeatedPassword !== ""
    ) {
      if (password === repeatedPassword) {
        if (type.includes("Band")) {
          navigation.navigate("Genre", { name, email, password, type });
        } else {
          navigation.navigate("Type", { name, email, password });
        }
      } else {
        this.setState({ falsePassword: true });
      }
    } else {
      this.setState({ emptyInput: true });
    }
  }

  render() {
    const { type, falsePassword, emptyInput, isBand } = this.state;
    return (
      <KeyboardAvoidingView style={styles.screenContainer}>
        <Image
          source={require("../../assets/images/iMuse-logo.jpg")}
          style={styles.imageContainer}
        />

        <View style={styles.firstInputContainer}>
          <Ionicons name="person" size={20} color="#102F44" />
          <TextInput
            placeholder="Name"
            placeholderTextColor="#102F44"
            style={styles.textInput}
            onChangeText={(name) => this.setState({ name: name.trim() })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Entypo name="email" size={20} color="#102F44" />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#102F44"
            style={styles.textInput}
            onChangeText={(email) =>
              this.setState({ email: email.trim().toLowerCase() })
            }
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

        <View style={styles.inputContainer}>
          <Ionicons name="lock-open" size={20} color="#102F44" />
          <TextInput
            secureTextEntry
            placeholder="Repeat Password"
            placeholderTextColor="#102F44"
            style={styles.textInput}
            onChangeText={(repeatedPassword) =>
              this.setState({ repeatedPassword: repeatedPassword.trim() })
            }
          />
        </View>

        <View style={styles.styleContainer}>
          <View
            name="SA"
            style={isBand ? styles.typeButton : styles.typeButton2}
          >
            <Text
              style={isBand ? styles.typeText : styles.typeText2}
              onPress={() => this.checkSingleArtist()}
            >
              Single Artist
            </Text>
          </View>
          <View
            name="B"
            style={isBand ? styles.typeButton2 : styles.typeButton}
          >
            <Text
              style={isBand ? styles.typeText2 : styles.typeText}
              onPress={() => this.checkBand()}
            >
              Band
            </Text>
          </View>
        </View>

        <View style={styles.registerContainer}>
          <Text
            style={styles.registerText}
            onPress={() => this.onNextPressed()}
          >
            Next
          </Text>
        </View>

        {falsePassword ? (
          <View>
            <Text style={styles.error}>Passwords do not match</Text>
          </View>
        ) : null}
        {emptyInput ? (
          <View>
            <Text style={styles.error}>Please fill in the empty fields</Text>
          </View>
        ) : null}
      </KeyboardAvoidingView>
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
    alignSelf: "center",
  },
  error: {
    color: "red",
    fontFamily: "Regular",
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
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
    marginBottom: 10,
    marginTop: 10,
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
  registerContainer: {
    marginHorizontal: 55,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "#CE2029",
    paddingVertical: 10,
    borderRadius: 5,
  },
  registerText: {
    color: "#FFF",
    fontFamily: "Regular",
    shadowColor: "#A2E2E1",
  },
  styleContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  typeButton: {
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "#CE2029",
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#FFF",
    borderWidth: 2,
  },
  typeText: {
    color: "#FFF",
    fontFamily: "Regular",
  },
  typeButton2: {
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    backgroundColor: "#CE2029",
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: "#102F44",
    borderWidth: 3,
  },
  typeText2: {
    color: "#102F44",
    fontFamily: "Regular",
  },
});

export default function (props) {
  const navigation = useNavigation();

  return <RegisterScreen {...props} navigation={navigation} />;
}
