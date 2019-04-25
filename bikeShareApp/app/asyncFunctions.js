//
// Contains a list of functions relating to AsyncStorage and its use
//
import { AsyncStorage, Alert } from "react-native";

// Sets the user key or 'token'.
// Allows an app to remember the user and not require a login every DB request
// and even when the app is closed and opened again.
export async function setKey(key){
  try{
    await AsyncStorage.setItem("userKey", key);
  }catch (e){
    Alert.alert(
      "Error",
      "Could not set key. Following error message:\n\n" + e,);
  }
}

// Retrieves and returns Keys/Tokens
export async function getUserKey(){
  try{
    userKey = await AsyncStorage.getItem('userKey');
    if (userKey !== 'null'){
      return userKey;
    }else{
      return false;
    }
  }catch(e){
    Alert.alert(
      "Error",
      "Could not get user key. Following error message:\n" + e,);
  }
}

// Checks if a valid token/key
export async function validToken(startup){
  try{
    let tempKey = await getUserKey();
    if (tempKey === false)
      return false;
    let response = await fetch(
      'https://achleiveprow.tk/api/v1/accounts/checktoken',{
      method: 'GET',
      headers: {
        Accept:
          'application/json',
          'Content-Type': 'application/json',
          'Authorization': tempKey},
    });
    let responseJson = await response.json();
    console.log(responseJson);
    if(responseJson.response.type === "guest"){
      return 'guest';
    }
    if (responseJson.status === 200){
      return 'user';
    }else if (responseJson.status === 401){
      if (startup === true){
        Alert.alert(
          'Error',
          'Login expired. You have signed out. Please sign back in.',);
      }
      await setKey('null');
      return false;
    }
  }catch(e){
    Alert.alert(
      'Error',
      'Coud not verify login. You have been signed out'
    );
    await setKey('null');
  }
}

// Stores an array of reservations, parsed from JSON into a string,
// to be accessed later
export async function setReservations(data){
  try{
    await AsyncStorage.setItem("reservations", JSON.stringify(data));
  }catch (e){
    Alert.alert(
      "Error",
      "Could not set reservations. Following error message:\n" + e,);
  }
}

// Retrieves the array of reservations and parses into JSON
export async function getReservations(){
  try{
    reservations = await AsyncStorage.getItem('reservations');
    if (reservations !== null){
      return JSON.parse(reservations);
    }else{
      return false;
    }
  }catch(e){
    Alert.alert(
      "Error",
      "Could not get reservation. Following error message:\n" + e,);
  }
}

// Helper function
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
