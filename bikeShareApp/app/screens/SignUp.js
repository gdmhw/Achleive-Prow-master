//
// Allows users to sign up and then logs them in on succesful sign up
//
import React from "react";
import { View, ScrollView, Alert, KeyboardAvoidingView, Platform,
   TouchableWithoutFeedback, Keyboard } from "react-native";
import { Card, Button, Input, Image, Text } from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import { onSignIn } from "../auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from "moment";
import { setKey, getUserKey, validToken, sleep } from "../asyncFunctions"
import { styles } from "../styles";

export default class SignUp extends React.Component {

  constructor(props){
    super(props)
    // most do not need to be states as them being changed does not need to trigger a rerender
    this.fname = '';
    this.lname = '';
    this.email = '';
    this.dob = '';
    this.password = '';
    this.password2 = '';
    this.errorFlag = 'false';
    SignUp.type = 'user';
    this.state = {
      spinner: false,
      showedDOB: '',
      error: '',
      errorIcon: 'white'
    }
  }

// sanitise function. Will santise depending on your input
  sanitise(cases, input){
    switch(cases){
      case 'all': // Final check when user clicks sign up button
        this.sanitise('fname', this.fname);
        if (errorFlag === false)
          this.sanitise('lname', this.lname);
          if (errorFlag === false)
            this.sanitise('email', this.email);
            if (errorFlag === false)
              this.sanitise('dob', this.dob);
              if (errorFlag === false)
                this.sanitise('password', this.password);
                if (errorFlag === false)
                  this.sanitise('password2', this.password2)
                  if (errorFlag === false)
                    return true;
        break;
      case 'fname':
        reg = /.{1,50}/ ;
        this.fname = input;
        if (reg.test(input)) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Please input a First Name between 1-50 characters', errorIcon:'black'});}
        break;
      case 'lname':
        this.lname = input;
        reg = /.{1,50}/ ;
        if (reg.test(input)) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Please input a Last Name between 1-50 characters', errorIcon:'black'});}
        break;
      case 'email':
        this.email = input;
        // This regex is taken from https://emailregex.com
        reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (reg.test(input)) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Please input a valid email address', errorIcon:'black'});}
        break;
      case 'dob':
        reg = /.+/;
        // Reg just ensures something is chosen, will always be valid as set by DatePicker
        if (reg.test(input)) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Please select a dob', errorIcon:'black'});}
        break;
      case 'password':
      this.password = input;
        // ensures complexity of password. Ensures upper/lowcases and number.
        reg = /^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])[A-Za-z\d@$!%*#?&]{8,}$/
        if (reg.test(input)) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Password must be at least 8 characters and include an uppercase, lowercase and a number. No whitespace.', errorIcon:'black'});}
        break;
      case 'password2':
        // ensures passwords match
        this.password2 = input;
        if (this.password === input) {
          errorFlag = false;
        }else{
          errorFlag = true;
          this.setState({error: 'Passwords do not match', errorIcon:'black'});}
        break;
      case 'type':
        // should never not be the case
        if (SignUp.input !== 'user'){
          errorFlag = true;
        }
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

// Runs when sign up button pressed,
// Creates account for user and on success signs them in
  async signUp (){
    this.setState({spinner: true});
    // sanitises all input first
    if (this.sanitise('all', '')){
      try {
        let response = await fetch(
          'https://achleiveprow.tk/api/v1/accounts/create',{
          method: "POST",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',},
          body: JSON.stringify({
            fname: this.fname,
            lname: this.lname,
            email: this.email,
            dob: this.dob,
            password: this.password,
            type: SignUp.type,
          }),
        });
        let responseJson = await response.json();
        if (responseJson.status !== 409){
          await setKey(responseJson.response.token);
          console.log(responseJson.response.token);
          await sleep(500);
          this.setState({spinner:false});
          if(validToken(false)){
           this.props.navigation.navigate("SignedIn");
          }
        }else{
          throw "User already exists!";
        }
      }
      catch (e) {
        this.setState({error:'This account already exists, use another email address', errorIcon: 'black'});
        this.setState({spinner:false});
      }
    }else{
      this.setState({spinner:false});
    }
  }
  // Errors are Visible when error, invisible otherwise. No react native library function
  // for 'visible' so simply blended into background. Potentially third party available
  render() {
    return(
    <KeyboardAvoidingView
      behavior= "padding"
      style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={{flex:1, backgroundColor: '#318E6C',
      paddingVertical: 20,justifyContent: "flex-end"}}>
      <Spinner
            visible={this.state.spinner}
            textContent={'Logging in...'}
            textStyle={{color: 'black', fontSize: 30, fontWeight: 'bold'}}
      />
        <Text style={styles.h1}>Sign Up Today!</Text>
       <Card borderRadius={20} containerStyle={{marginBottom: 20, backgroundColor:"white", borderColor:"black"}} >
      <ScrollView>
       <Input
          label = "First Name"
          onChangeText={(text) => this.sanitise('fname', text)}
       />
       <Input
          label = "Last Name"
          onChangeText={(text) => this.sanitise('lname', text)}
       />
       <Input
          label = "Email Address"
          onChangeText={(text) => this.sanitise('email', text)}
       />
       <View style={{flexDirection: 'row', padding:10}}>
        <Text style={{padding:10}}>Date of Birth: </Text>
        <DatePicker
          date = {this.state.showedDOB}
          showIcon = {false}
          mode="date"
          placeholder="click to select"
          format="DD/MM/YYYY"
          minDate = {moment().subtract(120, 'years').format("DD/MM/YYYY")}
          maxDate = {moment().subtract(16, 'years').format("DD/MM/YYYY")}
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          onDateChange={(date) => {
            this.setState({showedDOB: date})
            this.dob = moment(date, "DD/MM/YYYY").format("YYYY-MM-DD")}
          }
        />
        </View>
      <Input
         label="Password"
         secureTextEntry = {true}
         onChangeText={(text) => {this.sanitise('password', text)}}
         rightIcon={
           <Icon
             name='lock'
             size={20}
             color='black'
           />
         }
      />

      <Input
        label = "Confirm Password"
        secureTextEntry = {true}
        onChangeText={(text) => {this.sanitise('password2', text)}}
        rightIcon={
          <Icon
            name='lock'
            size={20}
            color='black'
          />
        }
      />
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
       onPress={() => {this.signUp()}}
     />

       <Text style={styles.error}>{this.state.error}</Text>
       <Icon
         name = 'exclamation-triangle'
         size={20}
         color= {this.state.errorIcon}
         style={{alignSelf: 'center'}}
       />
      </ScrollView>
       </Card>
       <View style={{ flex : 1 }} />
      </View>
      </TouchableWithoutFeedback>
     </KeyboardAvoidingView>
  );
  }
}
