import React, { Component } from 'react'
import { Text, View, Alert, Picker, ScrollView } from 'react-native'
import { Card, Button, CheckBox } from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import { getUserKey } from '../asyncFunctions';
import moment from "moment";
import { styles } from '../styles.js';


//This page lets a logged in user book a bike. 

export default class BookBike extends Component {

  constructor(props){
    super(props)
    this.state = {timeFrom: null,
                  userID: null,
                  bikeID: null,
                  destination: null,
                  status: "reserved",
                  resID: null,
                  helmet: false,
                  pump: false,
                  kneeGuard: false,
                  elbowPads: false,
                  waterBottle: false,
                  standard: false,
                  mountain: false,
                  road: false,
                  selectedBike: null,
                  noMoreBikes: null,
                  noBikeType: null
                  }
  }


  //gets user information and stores user ID in state

  async getUserId(){
    try{
      let response = await fetch(
        'https://achleiveprow.tk/api/v1/accounts/',{
        method: 'GET',
        headers: {
          Accept:
            'application/json',
            'Content-Type': 'application/json',
            'Authorization': await getUserKey()},
      });
      let content = await response.json();
      console.log(content);
      this.setState({userID: content.response[0].userID});
    }catch(e){

    }
  }

  //sends selected bike gear to database where it is stored

  async sendGear(){

    const url = "https://achleiveprow.tk/api/v1/reservations/id/"+this.state.resID+"/gear/create";

    fetch(url, {
      method: 'post',
      headers: {
        Accept:
          'application/json',
          'Content-Type': 'application/json',
          'Authorization': await getUserKey()
        }
    ,
      body: JSON.stringify({
        "helmet": this.state.helmet ? 1 : 0, 
        "pump": this.state.pump ? 1: 0, 
        "kneeGuard": this.state.kneeGuard ? 1: 0, 
        "elbowPads": this.state.elbowPads ? 1: 0, 
        "waterBottle": this.state.waterBottle ? 1: 0})
  }).then(

        (response) => {

          response.json().then((data) => {
              console.log('Request succeeded with JSON response', data);

              
              if (data.status !== 201) {
                Alert.alert(
                  'Error',
                  'Something went wrong and your booking could not be made.',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ],
                  {cancelable: false},
                );
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            };

            
            return;
            
          });
      }
  ).catch(function(err) {
      console.log('Fetch Error :-S', err);
      throw err;
  });
  }


// checks whether there are available bikes today and returns an alert to user saying there are no free bikes if there isnt. 

  async getBikeOnDay(){

    return fetch("https://achleiveprow.tk/api/v1/docks/getbike/"+this.props.navigation.getParam('dockID', -1)+"/"+this.state.selectedBike)
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson);
                  console.log(this.state.selectedBike);
                  if(responseJson.status === 200){
                   
                    
                  if(responseJson.response.bikeID === undefined){

                    console.log("NO MORE BIKES TODAY");
                    this.setState({noMoreBikes: "No "+this.state.selectedBike+" bikes available today."});
            
                    return;
                  }

                  console.log("successfull bikeID retrieval");
                  console.log(responseJson.response.bikeID);
                  this.setState({noMoreBikes: null, bikeID: responseJson.response.bikeID})
                  return;
            
                  }
                })
                .catch((error) => {
                  console.error(error);
                });

    }

// checks whether there are available bikes on another day and returns an alert to user saying there are no free bikes if there isnt. 
    async getBikeOnOtherDay(){

      return fetch("https://achleiveprow.tk/api/v1/docks/freereservations/"+this.props.navigation.getParam('dockID', -1)+"/"+moment(this.state.timeFrom).format("YYYY-MM-DD"))
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.status === 200){
                      
                     
                    if(responseJson.response[0].freeReservations === 0){
  
                      console.log("NO MORE BIKES TODAY");
                      this.setState({noMoreBikes: "No bikes available at "+this.dockName+" on "+moment(this.state.timeFrom).format("YYYY-MM-DD") });
              
                      return;
                    }
                    console.log("freeBikes: "+responseJson.response[0].freeReservations);
                    this.setState({noMoreBikes: null});
                    return;
              
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
  
      }

  // checks whether there are available bikes of the same bike type the user has entered. Lets the user know if there isnt.

      async getBikeType(){

        return fetch("https://achleiveprow.tk/api/v1/docks/freebikes/"+this.state.destination+"/"+this.state.selectedBike)
                  .then((response) => response.json())
                  .then((responseJson) => {
                    console.log(responseJson);
                    if(responseJson.status === 200){
                      console.log("successfull bike type retrieval");
                      console.log("bike type: "+this.state.selectedBike);
                    if(responseJson.response[0].freeBikes === 0){
  
                      console.log("NO BIKES OF SELECTED TYPE AT DOCK: "+ this.state.destination);
                      this.setState({noBikeType: "No "+this.state.selectedBike+" bikes available at "+ this.props.navigation.getParam('dockName', 'error')});
              
                      return;
                    }
                    this.setState({noBikeType: null})
              
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });

      }



//on load this function is called first. Stores user ID in state. stores chosen bike dock in state.

async componentWillMount() {
    await this.getUserId();
    console.log(this.state.userID);
    this.setState({destination : this.props.navigation.getParam('dockID', -1)});
  }

  render() {
    const { navigation } = this.props;
    const dockID = this.props.navigation.getParam('dockID', -1);
    const dockName= this.props.navigation.getParam('dockName', 'error');

    return (

        <ScrollView>
        <View style={{ paddingVertical: 5, flex: 1}}>
        <Card titleStyle={styles.h1} title={`${dockName}`}>
        <Text style={styles.inputHeader}>Time From </Text>
        
        {/*Allows user to pick date and time of their booking */}
        <DatePicker
          style={{padding: 20}}
          date={this.state.timeFrom}
          mode="datetime"
          minDate={moment().format("YYYY-MM-DD HH:mm")}
          maxDate={moment().add(1, 'year').format("YYYY-MM-DD HH:mm")}
          placeholder="select time"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36
          }

        }}

          //on change checks whether there is available bikes on selected date and tells user.
          onDateChange={(date) => {this.setState({timeFrom: date}, 

            async () => {

              if(this.getBikeType != null){

                if(moment(this.state.timeFrom).dayOfYear() != moment().dayOfYear() || moment(this.state.timeFrom).year() != moment().year()){

                
                  //console.log("NOT THE SAME DAY");
                  this.getBikeOnOtherDay()
                  
                }else{
  
                  //console.log("SAME DAY TODAY");
                  this.getBikeOnDay();
  
                }

              }

              
            }
              
            
           )}}
      />

{/*Displays message if no bike available on selected day */}
<Text style={{color: "red", paddingLeft: 10}}>{this.state.noMoreBikes}</Text>




<View style={{paddingTop: 5, width: '50%'}}>

{/*form for user to enter the bike type they want (checkboxs) */}

<Text style={styles.inputHeader}>Bike Type?</Text>

<CheckBox
      title="Standard"
      checkedColor='#4bc196'

          
          onPress={() =>  {
            
            this.state.standard ? 
            this.setState({selectedBike: null, standard: false, noBikeType: null})
              : 
            this.setState({selectedBike: "standard", road: false, mountain: false, standard: true}, this.getBikeType); 
            }}
          checked={this.state.standard}  
      />

      
      <CheckBox
      title="Mountain"
      checkedColor='#4bc196'

          
          onPress={() =>  {
            
            this.state.mountain ? 
            this.setState({selectedBike: null, mountain: false, noBikeType: null})
              : 
            this.setState({selectedBike: "mountain", road: false, mountain: true, standard: false}, this.getBikeType); 
            }}
          checked={this.state.mountain}  
      />

      <CheckBox
      title="Road"
      checkedColor='#4bc196'

          
          onPress={() => {
            
            this.state.road ? 
            this.setState({selectedBike: null, road: false, noBikeType: null})
              : 
            this.setState({selectedBike: "road", road: true, mountain: false, standard: false}, this.getBikeType); 
            }}
          checked={this.state.road}  
      />
      
<View style={{paddingLeft: 10, paddingBottom: 10}}>
<Text style={{color: "red"}}>{this.state.noBikeType}</Text>
</View>


{/*Form that allows only logged in users to select the bike gear they want (if they want any). GuestBookBike doesnt have this feature */}

<Text style={styles.inputHeader}>Bike Gear?</Text>
      <CheckBox
      title="Helmet"
      
      checkedColor='#4bc196'
          
          onPress={() => {
            this.state.helmet ? this.setState({helmet: false}) : this.setState({helmet: true}); 
            }}
          checked={this.state.helmet}  
      /> 


      <CheckBox
      title="Pump"
      checkedColor='#4bc196'
          
          onPress={() => {
            this.state.pump ? this.setState({pump: false}) : this.setState({pump: true}); 
            }}
          checked={this.state.pump}  
      />


      <CheckBox
      title="Knee Guard"
      checkedColor='#4bc196'
          
          onPress={() => {
            this.state.kneeGuard ? this.setState({kneeGuard: false}) : this.setState({kneeGuard: true}); 
            }}
          checked={this.state.kneeGuard}  
      />

      
      <CheckBox
      title="Elbow Pad"
      checkedColor='#4bc196'
          
          onPress={() => {
            this.state.elbowPads ? this.setState({elbowPads: false}) : this.setState({elbowPads: true}); 
            }}
          checked={this.state.elbowPads}  
      />

      <CheckBox
      title="Water Bottle"
      checkedColor='#4bc196'

          onPress={() => {
            this.state.waterBottle ? this.setState({waterBottle: false}) : this.setState({waterBottle: true}); 
            }}
          checked={this.state.waterBottle}  
      />


      </View>

          



 {/*Button which submits form. Cotains error checking. does not send data to database if fields are missing such as date time and bike type  */}
          <Button
            buttonStyle={{ marginTop: 20 }}
            ViewComponent={require('expo').LinearGradient}
            linearGradientProps={{
              colors: ['#4bc196', '#318E6C'],
              start: [0, 0],
              end: [0, 1],
            }}
            title="Book!"
            onPress={
              async () => {


                if(this.state.selectedBike === null){

                  Alert.alert(
                    'No bike type selected',
                    'Please select a bike type to book a bike.',

                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
                  return;
                }


                if(this.state.noBikeType != null){

                  Alert.alert(
                    'No '+this.state.selectedBike+' bikes available',
                    'Please select another bike type.',

                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
                  return;
                  
                }

              

                if(this.state.timeFrom === null){
                   Alert.alert(
                          'No date and time selected',
                          'Please select a date and time to book a bike.',

                          [
                            {text: 'OK'},
                          ],
                          {cancelable: false},
                        );
                        return;

                }
                

                if(this.state.noMoreBikes != null){
                  Alert.alert(
                    'No available bikes',
                    '\n No available bikes for the date you have picked. Please pick another date',

                    [
                      {text: 'OK'},
                    ],
                    {cancelable: false},
                  );
                  return;
                }

                if(moment(this.state.timeFrom).dayOfYear() != moment().dayOfYear() || moment(this.state.timeFrom).year() != moment().year()){

                
                  //console.log("NOT THE SAME DAY");
                  this.getBikeOnOtherDay()
                  
                }else{
  
                  //console.log("SAME DAY TODAY");
                  this.getBikeOnDay();
  
                }


                
                
                //endpoint for creating a reservation. Posts state data - bikeID userID timeFrom pickupDock and status 
                const url = "https://achleiveprow.tk/api/v1/reservations/create";
                console.log(this.state.userID);
                fetch(url, {
                  method: 'post',
                  headers: {
                  "Content-type": "application/json; charset=UTF-8",

                  },
                  body: JSON.stringify({
                    "bikeID": this.state.bikeID,
                    "userID": this.state.userID,
                    "timeFrom": this.state.timeFrom,
                    "pickupDock": this.state.destination,
                    "status": this.state.status,})
              }).then(

                    (response) => {

                      response.json().then((data) => {
                          console.log('Request succeeded with JSON response', data);
                          navigation.navigate("Home");

                          //If not expected return 
                          if (data.status !== 201) {

                              //If 400 then this means bike dock is fully reserved for chosen day. 

                            if(data.status === 400){

                              Alert.alert(
                                'Sorry fully booked',
                                 data.response.message,
                                [
                                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                                ],
                                {cancelable: false},
                              );
                              return;

                            }

                            //Else unknown error from frontend. Tell user an error has occurred 
                            Alert.alert(
                              'Error',
                              'Something went wrong and your booking could not be made.',
                              [
                                {text: 'OK', onPress: () => console.log('OK Pressed')},
                              ],
                              {cancelable: false},
                            );
                            console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                            return;
                        };

                         //else if reservation was successful store reservation ID in state 


                      this.setState({resID: data.response.resID}, console.log(this.state.resID));

                        //reserves bike gear after main reservation successfull as reservation ID is required

                        this.sendGear();

                        Alert.alert(
                          'Booking Received!',
                          '\n Booking number: #'+ data.response.resID+
                          ' \nFrom '+ this.state.timeFrom+

                          '\nAt '+ dockName,

                          [ {text: 'Take me to my reservations', onPress: () => navigation.navigate("Reservations")},
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
        </Card>
      </View>
      </ScrollView>
    )
  }
}
