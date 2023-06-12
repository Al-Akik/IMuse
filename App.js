import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import React, { Component } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";
const store = createStore(rootReducer, applyMiddleware(thunk));
import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey://REPLACE WITH API KEY,
  authDomain: //REPLACE WITH AUTH DOMAIN,
  projectId: //REPLACE WITH PROJECT ID,
  storageBucket: //REPLACE WITH STORAGE BUCKET,
  messagingSenderId: //REPLACE WITH MESSAGE SENDER ID,
  appId:// REPLACE WITH APP ID,
  measurementId:// REPLACE WITH MEASUREMENT ID,
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import TypeScreen from "./components/auth/Type";
import GenreScreen from "./components/auth/Genre";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import CommentScreen from "./components/main/Comment";
import ChatMain from "./components/chat/HomeScreen";
import AddChatScreen from "./components/chat/AddChatScreen";
import ChatScreen from "./components/chat/ChatScreen";
import ListOfAppliers from "./components/main/ListOfAppliers";
import ProfilePicture from "./components/main/ProfilePicture";
import SearchScreen from "./components/main/Search";
import NewEventScreen from "./components/main/NewEvent";
import PostScreen from "./components/main/Post";
import ModifyTypeScreen from "./components/main/ModifyType";
import ModifyGenreScreen from "./components/main/ModifyGenre";

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
      isFontLoaded: false,
    };
  }

  async componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
    await Font.loadAsync({
      Bold: require("./assets/fonts/BalsamiqSans-Bold.ttf"),
      Italic: require("./assets/fonts/BalsamiqSans-Italic.ttf"),
      Regular: require("./assets/fonts/BalsamiqSans-Regular.ttf"),
    });
    this.setState({ isFontLoaded: true });
  }
  render() {
    const { loggedIn, loaded, isFontLoaded } = this.state;
    if (!loaded || !isFontLoaded) {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <AppLoading />
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                title: "Sign Up",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: "Sign In",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Type"
              component={TypeScreen}
              options={{
                title: "Artist Types",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Genre"
              component={GenreScreen}
              options={{
                title: "Genres",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Post"
              component={PostScreen}
              options={{
                title: "Post",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Main"
            screenOptions={{
              headerTintColor: "black",
              headerStyle: { backgroundColor: "white" },
            }}
          >
            <Stack.Screen
              name="Main"
              component={MainScreen}
              navigation={this.props.navigation}
              options={({ navigation }) => ({
                headerRight: (props) => (
                  <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons
                      name="magnify"
                      color="black"
                      size={24}
                      onPress={() => navigation.navigate("Search", {})}
                      style={{ marginRight: 20 }}
                    />
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={24}
                      color="black"
                      onPress={() => navigation.navigate("ChatMain", {})}
                      style={{ marginRight: 20 }}
                    />
                  </View>
                ),
              })}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
              options={{
                title: "Upload Video",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={this.props.navigation}
              options={{
                title: "Post Video",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Comment"
              component={CommentScreen}
              navigation={this.props.navigation}
              options={{
                title: "Comment",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="ChatMain"
              component={ChatMain}
              navigation={this.props.navigation}
              options={{
                title: "Chats",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />

            <Stack.Screen
              name="AddChat"
              component={AddChatScreen}
              navigation={this.props.navigation}
              options={{
                title: "Add Chat",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              navigation={this.props.navigation}
              options={{
                title: "Chat Screen",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="ListOfAplliers"
              component={ListOfAppliers}
              navigation={this.props.navigation}
              options={{
                title: "List Of Appliers",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="ProfilePicture"
              component={ProfilePicture}
              navigation={this.props.navigation}
              options={{
                title: "Profile Picture",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              navigation={this.props.navigation}
              options={{
                title: "Search",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="NewEvent"
              component={NewEventScreen}
              navigation={this.props.navigation}
              options={{
                title: "New Event",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="ModifyType"
              component={ModifyTypeScreen}
              navigation={this.props.navigation}
              options={{
                title: "Modify Type",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="ModifyGenre"
              component={ModifyGenreScreen}
              navigation={this.props.navigation}
              options={{
                title: "Modify Genre",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
            <Stack.Screen
              name="PostScreen"
              component={PostScreen}
              navigation={this.props.navigation}
              options={{
                title: "Post Genre",
                headerStyle: {
                  backgroundColor: "#CE2029",
                },
                headerTitleStyle: {
                  color: "white",
                  fontFamily: "Bold",
                },
                headerTintColor: "white",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
