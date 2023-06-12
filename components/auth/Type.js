import React, { Component } from "react";
import { View, StyleSheet, Image, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

export class TypeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: [],
      types: [
        "Singer",
        "Producer",
        "Guitarist",
        "Pianist",
        "Violinist",
        "Cello Player",
        "Flute Player",
      ],
      emptyInput: false,
      error: "",
    };

    this.addType = this.addType.bind(this);
    this.onNextPressed = this.onNextPressed.bind(this);
  }

  addType(item) {
    const { type } = this.state;
    console.log(item);
    this.setState({ emptyInput: false });
    if (type.includes(item)) {
      this.setState({ error: "" });
      var array = [...type];
      var index = array.indexOf(item);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ type: array });
      }
      console.log("removed", type);
    } else {
      if (type.length < 3) {
        this.setState({ error: "" });
        this.setState({
          type: [...type, item],
        });
        console.log("added", type);
      } else {
        this.setState({ error: "You can only choose 3 types" });
      }
    }
  }

  onNextPressed() {
    const { type } = this.state;
    const { navigation } = this.props;
    const { name, email, password } = this.props.route.params;
    if (type.length !== 0) {
      navigation.navigate("Genre", { name, email, password, type });
    } else {
      this.setState({ emptyInput: true });
    }
  }

  render() {
    const { types, type, emptyInput } = this.state;
    console.log(this.props);
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
          data={types}
          renderItem={(item, index) => (
            <View style={{ flex: 1, flexDirection: "row" }} key={index}>
              <View
                style={
                  type.includes(item.item)
                    ? styles.typeButton2
                    : styles.typeButton
                }
                key={item.index}
              >
                <Text
                  key={item.index}
                  style={
                    type.includes(item.item)
                      ? styles.typeText2
                      : styles.typeText
                  }
                  onPress={() => {
                    this.addType(item.item);
                  }}
                >
                  {item.item}
                </Text>
              </View>
            </View>
          )}
        />
        <View style={styles.registerContainer}>
          <Text
            style={styles.registerText}
            onPress={() => this.onNextPressed()}
          >
            Next
          </Text>
        </View>

        <View style={{ height: 30 }}>
          <Text style={styles.artistTypes}>
            {emptyInput ? "You should specify a type" : null}
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
  const name = props.name;
  return <TypeScreen {...props} navigation={navigation} />;
}
