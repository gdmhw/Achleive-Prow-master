//
// Main screen when user is not signed in.
// Allows users to sign in, sign up or continue as a guest
//
import React from "react";
import { View, Text, Image, Alert,
  TouchableWithoutFeedback, Keyboard, TouchableOpacity} from "react-native";
import { Card, Button, Input } from "react-native-elements";
import { onSignIn } from "../auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import { styles } from '../styles';
import {sleep, setKey } from '../asyncFunctions';

export default class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.email = '';
    this.password = '';
    this.errorFlag = false;
    this.state = {
      error: '',
      errorIcon: 'white',
      pressStatus: false
    };
  }

  // Sanitises input so only valid emails and passwords are used PRIOR to login request
  sanitise(cases, input){
    switch(cases){
      case 'both':
        this.sanitise('email', this.email);
        if (errorFlag === false){
          this.sanitise('password', this.password);
          if (errorFlag === false){
            return true;
          }
        }
        break;
      case 'email':
        this.email = input;
        // Not authors work - taken from https://emailregex.com
        reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (reg.test(input)) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Please input a valid email address', errorIcon:'black'});}
        break;
      case 'password':
        this.password = input;
        // This regex ensures uppercase, lowercase and number. Accepts some symbols too.
        reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])[A-Za-z\d@$!%*#?&]{8,}$/
        if (reg.test(input)) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Password must be at least 8 characters and include an uppercase, lowercase and a number. No whitespace.', errorIcon:'black'});}
        break;
      default: break;
    }
      if(errorFlag){
        return false;
      }else{
        this.setState({error:'',errorIcon:'white'})
        return true;
      }
    }

// Post request to sign user in
  async signIn(){
    this.setState({spinner: true});
    if (this.sanitise('both', '')){
      try{
        let response = await fetch(
          'https://achleiveprow.tk/api/v1/accounts/login',{
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',},
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });
        let responseJson = await response.json();
        // used to simulate a load - too short otherwise
        // and users are comforted by viewing the app 'sign them in'
          await sleep(500);
        if(responseJson.status === 200){
          await setKey(responseJson.response.token);
          this.props.navigation.navigate("Home");
        }else if(responseJson.status === 400){
          this.setState({error: 'Account with this email address does not exist.', errorIcon: 'black'});
          this.setState({spinner: false});
        }else if (responseJson.status === 403){
          this.setState({error: 'Password incorrect.', errorIcon: 'black'});
          this.setState({spinner: false});
        }
      }catch(e){
        this.setState({
          error:'Error signing in. Try again.',
          errorIcon: 'black'});
      }
    }else{
      this.setState({spinner: false});
    }
  }

// If token is a guest token will sign them into the guest version of the app
  async navGuest(){
    this.setState({spinner: true});
    try{
      let response = await fetch(
        'https://achleiveprow.tk/api/v1/accounts/guest',{
        method: "POST",
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',},
      });
      let responseJson = await response.json();
        await sleep(500);
      if(responseJson.status === 200){
        await setKey(responseJson.response.token);
        this.setState({spinner: false});
        this.props.navigation.navigate("GuestHome");
      }else{
        this.setState({error: 'Error signing in as guest. Try again', errorIcon: 'black'});
        this.setState({spinner: false});
      }
    }catch(e){
      this.setState({
        error:'Error signing in as guest. Try again.',
        errorIcon: 'black'});
    }
  }

// renders page components
// TouchableWithoutFeedback ensures if user taps screen outside a button/input field
// the keyboard will dismiss. Natural app behaviour.
  render() {
    const {navigation} = this.props
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex:1, paddingVertical: 20, backgroundColor: '#318E6C'}}>
      <Spinner
            visible={this.state.spinner}
            textContent={'Logging in...'}
            textStyle={{color: 'black', fontSize: 30, fontWeight: 'bold'}}
      />
      <Text style={styles.h1}>Welcome</Text>
       <View style={{flex:5, paddingTop: 10}}>
         <Card borderRadius={20} containerStyle={{backgroundColor:"white", paddingTop: 30, borderColor:"black"}} >

      <Input
         label="Email"
         onChangeText={(text) => this.sanitise('email', text)}
         rightIcon={
           <Icon
             name='user'
             size={20}
             color='black'
           />
         }
       />

       <Input
         label="Password"
         secureTextEntry = {true}
         onChangeText = {(text) => this.sanitise('password', text)}
         rightIcon={
           <Icon
             name='lock'
             size={20}
             color='black'
           />
         }
       />
         <View>
          <Text style={styles.error}>{this.state.error}</Text>
            <Icon
              name = 'exclamation-triangle'
              size={20}
              color= {this.state.errorIcon}
              style={{alignSelf: 'center'}}
            />
        </View>
           <Button
             buttonStyle={{marginBottom: 20}}
             titleStyle={{ color:"black" }}
             ViewComponent={require('expo').LinearGradient}
             linearGradientProps={{
               colors: ['#4bc196', '#318E6C'],
               start: [0, 0],
               end: [0, 1],
             }}
             title="Sign In"
             onPress={() => {
               this.signIn();
             }}
           />
           <Text  style={styles.h2}>Or</Text>
           <Button
             buttonStyle={{ marginTop: 20 }}
             titleStyle={{ color:"black" }}
             ViewComponent={require('expo').LinearGradient}
             linearGradientProps={{
               colors: ['#4bc196', '#318E6C'],
               start: [0, 0],
               end: [0, 1],
             }}
             title="Sign Up"
             onPress={() => navigation.navigate("SignUp")}
           />
         <View style={{paddingTop: 25}}>
          <Text  style={ this.state.pressStatus
                            ? {textAlign: 'center', color: '#318E6C', textDecorationLine: 'underline'}
                            : styles.h2}  onPress={() => this.navGuest()}>Continue as Guest</Text>
        </View>
         </Card>
         <Card borderRadius={20} containerStyle={{backgroundColor:"white", paddingTop: 10, borderColor:"black"}} >
         <View style={{flexDirection:'row', justifyContent:'center'}}>
            <TouchableOpacity onPress={() => navigation.navigate("PrivacyPolicy")}>
            <Text style={styles.link}>
              Privacy Policy</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("TermsOfService")}><Text style={styles.link} >Terms of Service</Text></TouchableOpacity>
          </View>
         </Card>
         </View>
         </View>
         </TouchableWithoutFeedback>
    );
  }
}
