import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  LinearGradient,
  TouchableOpacity,
} from "react-native";

export default function Landing({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const Ref = useRef();
  const { width } = Dimensions.get("window");
  const height = width;
  const [DEVICE_WIDTH, setDEVICE_WIDTH] = useState(Dimensions.get("window"));
  const images = [
    "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    "https://images.pexels.com/photos/7095824/pexels-photo-7095824.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    "https://images.pexels.com/photos/5217271/pexels-photo-5217271.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    "https://images.pexels.com/photos/8158965/pexels-photo-8158965.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    "https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    "https://images.pexels.com/photos/7520076/pexels-photo-7520076.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
  ];

  const calculateIndex = (event) => {
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const selectedIndex = Math.floor(contentOffset / viewSize);
    setSelectedIndex(selectedIndex);
  };

  return (
    <View style={styles.screencontainer}>
      <View style={{ marginTop: 50, width, height }}>
        <View style={styles.circleDiv}>
          {images.map((image, i) => (
            <View key={image} style={styles.whiteCircleup} />
          ))}
        </View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          horizontal
          ref={Ref}
          style={styles.imageContainer}
        >
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{
                width,
                height,
                resizeMode: "contain",
                alignContent: "center",
              }}
            />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.buttonLegend}>New to iMuse?</Text>

      <View style={styles.buttonContainer}>
        <Text
          style={styles.buttonText}
          onPress={() => navigation.navigate("Register")}
        >
          Sign Up
        </Text>
      </View>

      <Text style={styles.buttonLegend}>Already iMusing?</Text>
      <View style={styles.buttonContainer}>
        <Text
          style={styles.buttonText}
          onPress={() => navigation.navigate("Login")}
        >
          Sign In
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screencontainer: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    width: WIDTH,
    height: "60%",
    marginTop: 10,
    marginHorizontal: -1,
    borderRadius: 20,
  },
  titleContainer: {
    fontSize: 20,
    fontFamily: "Bold",
    alignSelf: "center",
    color: "white",
  },
  introContainer: {
    fontSize: 17,
    fontFamily: "Regular",
    marginHorizontal: 55,
    textAlign: "center",
    opacity: 0.9,
    color: "white",
    marginBottom: 5,
  },

  buttonText: {
    width: "100%",
    height: "100%",
    fontSize: 20,
    fontFamily: "Regular",
    textAlign: "center",
    color: "#fff",
    textAlignVertical: "center",
  },

  circleDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  whiteCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: "red",
  },
  whiteCircleup: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: "red",
  },

  buttonContainer: {
    width: "67%",
    height: "6%",
    marginHorizontal: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CE2029",
    borderRadius: 5,
    margin: 5,
  },
  buttonLegend: {
    width: "100%",
    fontSize: 15,
    fontFamily: "Bold",
    textAlign: "center",
    color: "#102F44",
    padding: 5,
    marginTop: 5,
  },
});

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;
