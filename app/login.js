import React, { useEffect, useState } from "react";
import { View, TextInput, Button } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter, Redirect, useNavigation } from "expo-router";
import { styles } from "../styles/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ngrokURL } from "../constants/config";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedin, setIsloggedin] = useState(false);
  const [respnotok, setRespnotok] = useState(false);
  const [userData, setUserData] = useState("");

  const EncryptandStore = async () => {
    try {
      await SecureStore.setItemAsync("username", username);
      await SecureStore.setItemAsync("password", password);
      // await SecureStore.setItemAsync("user_data", JSON.stringify(userData));
    } catch (error) {}
  };

  const storeData = async (value) => {
    try {
      console.log("store data ko mila,", value);
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("UsernameData", jsonValue);
      console.log("data stored! in local storage");
    } catch (e) {
      // saving error
    }
  };

  const VerifyCredentials = async () => {
    try {
      const Usernameresponse = async () => {
        try {
          const response = await fetch(
            // fetch username to check that the credentials are correct
            `${ngrokURL}/userProfile?username=${username}&password=${password}`
          );
          if (response.ok) {
            // they are correct
            const data = await response.json();
            console.log("data", data);
            setUserData(data);
            EncryptandStore(); // save to secure store
            setIsloggedin(true); // redirect to home page
          } else {
            console.log("Response not OK");
            setRespnotok(true);
          }
        } catch (error) {
          console.log(error);
        }
      };

      await Usernameresponse();
    } catch (error) {
      console.log(error);
    }
  };

  // respnotok
  //   ? alert("Incorrect Username or Password")
  //   : (onPress = () => {
  //       setRespnotok(false);
  //     });

  return loggedin ? (
    <Redirect href="/homepage" />
  ) : (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <Button title="Login" onPress={VerifyCredentials} />
    </View>
  );
};

export default LoginScreen;
