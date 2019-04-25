
import React, { Component } from 'react'
import { Text, View, Alert, Picker } from 'react-native'
import { Card, Button, CheckBox } from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import {setReservations, getUserKey} from '../asyncFunctions';
import moment from "moment";
import { styles } from '../styles.js';

//allows signedOut users to book a bike
//very similar to BookBike except no bike gear reservations
//look at BookBikes for comments

export default class GuestBookBike extends Component {

  constructor(props){
    super(props)
    this.state = {timeFrom: null,
                  userID: null, //get username from local storage
                  destination: null,
                  status: "reserved",
                  resID: null,
                  standard: false,
                  mountain: false,
                  road: false,
                  selectedBike: null,
                  noMoreBikes: null,
                  noBikeType: null
                  }
  }

  componentWillMount() {
    this.setState({destination : this.props.navigation.getParam('dockID', -1)}, async () => {


  return fetch('https://achleiveprow.tk/api/v1/docks/getbike/'+this.props.navigation.getParam('dockID', -1))
    .then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status === 200){
        console.log("successfull bikeID retrieval");
      if(responseJson.response.message === "No available bikes"){

        this.props.navigation.navigate("GuestHome");
        Alert.alert(
          'Error',
          'Bikes are fully booked for this dock. Please try another dock.',
          [
            {text: 'OK'},
          ],
          {cancelable: false},
        );

        return;
      }
      //this.setState({bikeID: responseJson.response.bikeID })

      }
    })
    .catch((error) => {
      console.error(error);
    });

  });

  }

  async fetchAndStore(resID){
    try{
      let response = await fetch(
        'https://achleiveprow.tk/api/v1/reservations/all/',{
        method: 'GET',
        headers: {
          Accept:
            'application/json',
            'Content-Type': 'application/json',
            'Authorization': await getUserKey()},
      });
      let content = await response.json();
      console.log("\n\n\nCONTENT\n\n\n",content);
      await setReservations(content.response);
  }catch (e) {
    return console.log(e);
  }
}


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


  async getBikeOnOtherDay(){

    return fetch("https://achleiveprow.tk/api/v1/docks/freereservations/"+this.props.navigation.getParam('dockID', -1)+"/"+moment(this.state.timeFrom).format("YYYY-MM-DD"))
                .then((response) => response.json())
                .then((responseJson) => {
                  console.log(responseJson);
                  if(responseJson.status === 200){
                    console.log("successfull bikeID retrieval");
                    console.log("freeBikes: "+responseJson.response[0].freeReservations);
                  if(responseJson.response[0].freeReservations === 0){

                    console.log("NO MORE BIKES TODAY");
                    this.setState({noMoreBikes: "No bikes available on "+moment(this.state.timeFrom).format("YYYY-MM-DD")});
            
                    return;
                  }
                  this.setState({noMoreBikes: null})
            
                  }
                })
                .catch((error) => {
                  console.error(error);
                });

    }

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

  render() {
    const { navigation } = this.props;
    const dockID = navigation.getParam('dockID', -1);
    const dockName= navigation.getParam('dockName', 'error');

    return (
        <View style={{ paddingVertical: 20 }}>
        <Card titleStyle={styles.h1} title={`${dockName}`}>
        <Text style={styles.inputHeader}>Time From</Text>

        <DatePicker
          style={{padding: 20}}
          date={this.state.timeFrom}
          mode="datetime"
          minDate={moment().format("YYYY-MM-DD HH:mm")}
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
          onDateChange={(date) => {this.setState({timeFrom: date}, () => {


            if(moment(this.state.timeFrom).dayOfYear() != moment().dayOfYear() || moment(this.state.timeFrom).year() != moment().year()){

              
             // console.log("NOT THE SAME DAY");
              this.getBikeOnOtherDay()

            }else{


              
              //console.log("SAME DAY TODAY");
              this.getBikeOnDay();

            }

            console.log(this.state.timeFrom)})}}
      />

<Text style={{color: "red"}}>{this.state.noMoreBikes}</Text>


<View style={{paddingTop: 5, width: '50%'}}>

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

      </View>



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

                const url = "https://achleiveprow.tk/api/v1/reservations/create";

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
                          //console.log('Request succeeded with JSON response', data);
                          navigation.navigate("GuestHome");
                          if (data.status !== 201) {

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






                        Alert.alert(
                          'Booking Recieved!',
                          '\n Booking number: #'+ data.response.resID+
                          ' \nFrom '+ this.state.timeFrom+
                          '\nAt '+ dockName,

                          [
                            {text: 'OK', onPress: async () =>
                            {await this.fetchAndStore(data.response.resID)
                            //this.props.navigation.navigate("ActiveRes", {resID: data.response.resID})
                          }},
                          ],
                          {cancelable: false},
                        );
                        return;
                      });
                  }
              ).catch(function(err) {
                  console.log('Fetch Error :-S', err);
                  throw err;
              });
            }}
          />
        </Card>
      </View>
    )
  }
}
