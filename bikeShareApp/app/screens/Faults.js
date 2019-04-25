import React, { Component } from 'react';
import {View, TextInput, Text, Alert, Platform,TouchableWithoutFeedback} from 'react-native';
import { Button} from "react-native-elements";
import { styles } from '../styles';
import DismissKeyboard from 'dismissKeyboard';


//Page which allows users to report a fault with one of the bikes

export default class Faults extends Component {

  
  constructor(props) {
    super(props);
    this.state = {
      text: null,
      bikeID: null,
      maxChars: 2000,
      textLeft: 2000
    };
  }

 
    
  render() {
    return (
      <TouchableWithoutFeedback onPress={()=>{DismissKeyboard()}}>
      <View style={{ flex:1, paddingTop: 10}}>
      
     
        
      <View style={{paddingVertical: 10}}>
      <Text style={styles.h1 }>What is wrong?</Text>
      </View>

      <Text style={styles.inputHeader}>Enter your bike number</Text>
      <View style={{paddingLeft: 10, paddingBottom: 10, paddingTop: 10}}>

       {/*Text input for bike number */}
      <TextInput 
        style={{paddingLeft: 5, padding: 5, borderWidth: 1, borderColor: 'grey', width: 50, fontSize: 18}}
        keyboardType = 'numeric'
        onChangeText = {(text)=> this.setState({bikeID: text})}
        value = {this.state.bikeID}
      /> 

      </View>

         {/*Text input for fault message. maximum 2000 characters */}
        <TextInput
          placeholder="Enter message here..."
          editable = {true}
          maxLength = {this.state.maxChars}
          style={{ height: 230,  alignItems: "center",
          justifyContent: "center",
          alignSelf: "center", 
          fontSize: 18, 
          backgroundColor: 'white',
          width:'95%', 
          borderWidth: 1,
          borderColor: 'grey',
          padding: 5 }}

          multiline = {true}
          onChangeText={(text) =>  {const textLength = text.length; 
                                    const sub = this.state.maxChars - textLength; 
                                    this.setState({textLeft: sub}); 
                                    this.setState({text: text});
                                  }}
          value={this.state.text}
        
        />

         {/*Tells user how many characters are left */}
        <Text style={{paddingLeft: 10, paddingTop: 5}}>{this.state.textLeft} characters left.</Text>


         {/*submit fault button */}

         <Button style={{paddingTop: 10, alignItems: "center",
          justifyContent: "center",
          alignSelf: "center"}}

          buttonStyle={{width: 300, marginVertical: 10, marginHorizontal: 20}}

            ViewComponent={require('expo').LinearGradient}
            linearGradientProps={{
              colors: ['#4bc196', '#318E6C'],
              start: [0, 0],
              end: [0, 1],
            }}
            title="Report Fault"
            onPress={async () => { 

              //if fault form doesnt have a bike number or doesnt have any text then tell user that these are required to submit a fault. 
              //else carry on with fault submit
              if(this.state.bikeID == null || this.state.text == null){

                Alert.alert(
                  'Error',
                  'You need to enter both a bike number and a message to send us a fault.',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
                return;
              }

              //fetch request with fault creation endpoint. takes bike number and message
              const url = "https://achleiveprow.tk/api/v1/bikes/id/"+this.state.bikeID+"/faults/create";
                console.log(this.state.userID);
                fetch(url, {
                  method: 'post',
                  headers: {
                  "Content-type": "application/json; charset=UTF-8",

                  },
                  body: JSON.stringify({
                    
                    "userNotes": this.state.text
                    })
              }).then(

                    (response) => {

                      response.json().then((data) => {
                          console.log('Request succeeded with JSON response', data);
                          //navigate back to previous page
                          this.props.navigation.navigate(this.props.nav);

                          //if response isnt as expected then alert to user that an error has occured
                          if (data.status !== 201) {
                            Alert.alert(
                              'Error',
                              'Sorry something went wrong and your fault could not be submitted to us. Please try again later.',
                              [
                                {text: 'OK', onPress: () => console.log('OK Pressed')},
                              ],
                              {cancelable: false},
                            );
                            console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                            return;
                        };

                        //alert to user that their fault has been successfully submitted 
                        Alert.alert(
                          'Fault submitted',
                          'Your fault has been successfully submitted. We are sorry for any inconvenience caused. The matter will be investigated.',
                          [
                            {text: 'OK'},
                          ],
                          {cancelable: false},
                        );
                        return;
                      });
                  }

                  //catches any error with fetch request
              ).catch(function(err) {
                  console.log('Fetch Error :-S', err);
                  throw err;
              });
             }}
          />  

      </View>
      </TouchableWithoutFeedback>
      
    )
  }
}

