//
// Used to start/end/cancel/modify a reservation. Opened from the reservations tab
//
import React, { Component } from 'react'
import { Text, View, Alert, Picker, ScrollView } from 'react-native'
import { Card, Button } from "react-native-elements";
import DatePicker from 'react-native-datepicker';
import { getUserKey } from '../asyncFunctions';
import moment from "moment";
import {styles} from '../styles.js';
import {getReservations} from '../asyncFunctions';


export default class ActiveRes extends Component {

  constructor(props){
    super(props)
    this.state = {
      alldata: null,
      resdata: null,
      bikeID: '',
      dStartButton: false,
      dEndButton: true,
      dCancelButton: false,
      dChangeButton: false,
      status: null,
      newTimeFrom: moment().format("YYYY-MM-DD HH:mm"),
    }
  }

// Will run when the page is opened
  async componentWillMount(){
    var i;
    // retrieves the array of reservations from  attached with user and stores
    this.setState({alldata: await getReservations()});
    // Gets the correct reservation from the array of all reservations
    for(i = 0; i < this.state.alldata.length; i++){
      if(this.state.alldata[i].resID === this.props.navigation.getParam('resID', 'NONE')){
        this.setState({resdata: this.state.alldata[i]});
      }
    };
    this.isStartTime();
  }

  // Checks if today and if so displays 'Today' and not the date, otherwise displays date
  isToday(){
    let tmpTimeFrom = this.state.resdata.timeFrom;
    if(moment(tmpTimeFrom).dayOfYear() == moment().dayOfYear() && moment(tmpTimeFrom).year() == moment().year()){
      return "Today"
    }else{
      return moment(tmpTimeFrom, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YY");
    }
  }

  // Checks start time and enables/disables buttons accordingly
  isStartTime(){
    var tmpTimeFrom = moment(this.state.resdata.timeFrom);
    var now = moment();
    console.log(tmpTimeFrom.diff(now,'minutes'));
    if((tmpTimeFrom.diff(now,'minutes') > -31) && (tmpTimeFrom.diff(now,'minutes') < 10) && (this.state.resdata.status == 'reserved')){
      // If reserved and ready to start
      this.setState({dStartButton: false});
      this.setState({status: 'Ready'});
    }else if((tmpTimeFrom.diff(now,'minutes') > -31) && (tmpTimeFrom.diff(now,'minutes') < 10) && (this.state.resdata.status == 'active')){
      // If active reservation
      this.setState({dStartButton: true});
      this.setState({dEndButton: false});
      this.setState({dCancelButton: true});
      this.setState({dChangeButton: true});
      this.setState({status: 'Active'});
    }else if((tmpTimeFrom.diff(now,'minutes') < -30)){
      // If the same day but missed the reservation
      this.setState({dStartButton: true});
      this.setState({status: 'Missed'});
      this.setState({dCancelButton: true});
      this.setState({dChangeButton: true});
    }else{
      // If upcoming reservation
      this.setState({dStartButton: true});
      this.setState({status: 'Upcoming'});
    }
  }

  // CHecks to make sure bike available on another day.
    async getBikeOnOtherDay(){
      return fetch("https://achleiveprow.tk/api/v1/docks/freereservations/"+this.state.resdata.pickupDock+"/"+moment(this.state.newTimeFrom).format("YYYY-MM-DD"))
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if(responseJson.status === 200){
            console.log("successfull bikeID retrieval");
            console.log(responseJson);
          if(responseJson.response.message === "No available bikes"){
            console.log("NO MORE BIKES TODAY");
            Alert.alert(
              'Unavailable',
              'No more bikes to book this day. Try another day.'
            );
            return;
          }
          this.setState({noMoreBikes: null,
                        bikeID: responseJson.response.bikeID })
          }
        })
        .catch((error) => {
          console.error(error);
        });
      }

// Starts reservation. Post request to API to change res status to 'active'
  async startReservation(){
    try {
      let userToken = await getUserKey()
      let response = await fetch(
        'https://achleiveprow.tk/api/v1/reservations/modify',{
        method: 'POST',
        headers: {
          Accept:
            'application/json',
            'Content-Type': 'application/json',
            'Authorization': userToken
        },
        body: JSON.stringify({
          "status": 'active',
          "resID": this.state.resdata.resID,
        }),
      });
      let content = await response.json();
      if(content.status !== 200){
        Alert.alert(
          'Error',
          'Problem starting reservation. Try again or contact customer services'
        );
      }else{
        this.setState({dStartButton: true});
        this.setState({status: 'Active'});
        this.setState({dEndButton: false});
        this.setState({dChangeButton: true});
        this.setState({dCancelButton: true});
      }
    }catch (e) {
      return console.log(e);
    }
  }
// Ends reservation. Post request to API to change res status to 'ended'
  async endReservation(){
    try {
      let userToken = await getUserKey()
      let response = await fetch(
        'https://achleiveprow.tk/api/v1/reservations/modify',{
        method: 'POST',
        headers: {
          Accept:
            'application/json',
            'Content-Type': 'application/json',
            'Authorization': userToken
        },
        body: JSON.stringify({
          "status": 'ended',
          "resID": this.state.resdata.resID,
        }),
      });
      let content = await response.json();
      if(content.status !== 200){
        Alert.alert(
          'Error',
          'Problem ending reservation. Try again or contact customer services'
        );
      }else{
        this.setState({status: 'Ended'});
        this.setState({dEndButton: true});
        Alert.alert(
          'Session Ended',
          'Thank you for taking your journey with us. We hope to see you Wheelzie soon!',
          [ {text: 'Return Home', onPress: () =>{
            this.props.navigation.navigate("Home");}},
          ],
          {cancelable: false},
        );
      }
      console.log(response);
    }catch (e) {
      return console.log(e);
    }

  }

// Cancels reservation. Post request to API to change res status to 'cancelled'
  async cancelReservation(){
    try {
      let userToken = await getUserKey()
      let response = await fetch(
        'https://achleiveprow.tk/api/v1/reservations/modify',{
        method: 'POST',
        headers: {
          Accept:
            'application/json',
            'Content-Type': 'application/json',
            'Authorization': userToken
        },
        body: JSON.stringify({
          "status": 'cancelled',
          "resID": this.state.resdata.resID,
        }),
      });
      let content = await response.json();
      if(content.status !== 200){
        Alert.alert(
          'Error',
          'Problem cancelling reservation. Try again or contact customer services'
        );
      }else{
        this.setState({status: 'Cancelled'});
        this.setState({dEndButton: true});
        this.setState({dStartButton: true});
        this.setState({dCancelButton: true});
        this.props.navigation.navigate("Reservations");
      }
      console.log(response);
    }catch (e) {
      return console.log(e);
    }
  }

// Modifies reservation. Changes the time and/or date of the reservation
  async changeReservation(){
    try {
      let userToken = await getUserKey()
      let response = await fetch(
        'https://achleiveprow.tk/api/v1/reservations/modify',{
        method: 'POST',
        headers: {
          Accept:
            'application/json',
            'Content-Type': 'application/json',
            'Authorization': userToken
        },
        body: JSON.stringify({
          "timeFrom": this.state.newTimeFrom,
          "resID": this.state.resdata.resID,
        }),
      });
      let content = await response.json();
      if(content.status !== 200){
        Alert.alert(
          'Error',
          'Problem cancelling reservation. Try again or contact customer services'
        );
      }
      this.props.navigation.navigate("Reservations");
    }catch (e) {
      return console.log(e);
    }
  }


// Displays loading while waiting for async etc
// Simply loads the page with components and calls appropriate functions when buttons clicked
  render() {
    const { navigation } = this.props;
    if(this.state.resdata === null){

      return (<View style={styles.container}><Text style={styles.h1}>Loading reservation...</Text></View>)
    }else{
      return (

          <View style={{ paddingVertical: 20 }}>
           <Card borderRadius={20} containerStyle={{marginBottom: 20, backgroundColor:"white", borderColor:"black"}} >
           <ScrollView>
           <Card borderRadius={20} containerStyle={{marginBottom: 10, backgroundColor:"white", borderColor:"black"}} >
            <Text style={styles.h1}>Status: {this.state.status}</Text>
            <Text style={styles.h1}>Bike Number: {this.state.resdata.bikeID}</Text>
           </Card>
            <Text style={styles.h2}>Your Reservation for</Text>
            <Text style={styles.h1}>{this.isToday()}</Text>
            <Text style={styles.h2}><Text style={{fontWeight: 'bold', color:'black'}}>
            {moment(this.state.resdata.timeFrom, "YYYY-MM-DD HH:mm:ss").format("HH:mm")}</Text></Text>
            <Text style={styles.genText}>You can activate your bike up to 10 minutes before your time slot and up to 30 minutes after you were booked to start</Text>
            <Text style={styles.genText}> NOTE: Your booking is cancelled 30 minutes after your chosen start time. If you're going to be late you can change the time of your reservation below. </Text>
            <Button
              buttonStyle={{ marginTop: 10 }}
              disabled={this.state.dStartButton}
              titleStyle={{ color:"black" }}
              ViewComponent={require('expo').LinearGradient}
              linearGradientProps={{
                colors: ['#4bc196', '#318E6C'],
                start: [0, 0],
                end: [0, 1],
              }}
              title= 'Start Reservation'
              onPress= {() => {this.startReservation()}}
            />
            <Button
              buttonStyle={{ marginTop: 10 }}
              disabled={this.state.dEndButton}
              titleStyle={{ color:"black" }}
              ViewComponent={require('expo').LinearGradient}
              linearGradientProps={{
                colors: ['#4bc196', '#318E6C'],
                start: [0, 0],
                end: [0, 1],
              }}
              title= 'End Reservation'
              onPress= {() => {Alert.alert(
                'Are you sure you want to end your reservation?',
                'If you click OK, the session will end and the bike lock will automatically engage. Please ensure you'
                + ' are safely stopped and parked before ending your session.',
                [ {text: 'Yes, End Session', onPress: () =>{
                  this.endReservation();}},
                  {text: 'No, Continue Session'},
                ],
                {cancelable: false},
              );}}
            />
            <Text style={styles.h2b}>Want to change something?</Text>
            <View style={{flexDirection:'row', justifyContent: 'space-around', alignItems: 'center'}}>
              <DatePicker
                style={{padding: 5}}
                showIcon = {false}
                date={this.state.newTimeFrom}
                mode="datetime"
                minDate={moment().format("YYYY-MM-DD HH:mm")}
                maxDate={moment().add(1, 'year').format("YYYY-MM-DD HH:mm")}
                placeholder="select time"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{dateInput: {marginRight: 10}}}
                onDateChange={(date) => {this.setState({newTimeFrom: date})}}
              />
              <Button
                buttonStyle={{ marginTop: 10 }}
                disabled={this.state.dChangeButton}
                titleStyle={{ color:"black" }}
                ViewComponent={require('expo').LinearGradient}
                linearGradientProps={{
                  colors: ['#4bc196', '#318E6C'],
                  start: [0, 0],
                  end: [0, 1],
                }}
                title= 'Change Date'
                onPress= { async () => {
                  if(moment(this.state.newTimeFrom).dayOfYear() != moment().dayOfYear() || moment(this.state.newTimeFrom).year() != moment().year()){
                    this.getBikeOnOtherDay()
                  }
                  Alert.alert(
                    'Are you sure?',
                    'Your reservation will be changed to '
                    + moment(this.state.newTimeFrom).format('HH:mm') + ' on '
                    + moment(this.state.newTimeFrom).format('DD/MM/YYYY'),
                    [ {text: 'Yes, Change Date', onPress: () =>{
                      this.changeReservation();}},
                      {text: 'No'},
                    ],
                    {cancelable: false},
                  );
                }}
              />
            </View>
              <Button
                buttonStyle={{ marginTop: 10 }}
                disabled={this.state.dCancelButton}
                titleStyle={{ color:"black" }}
                ViewComponent={require('expo').LinearGradient}
                linearGradientProps={{
                  colors: ['#4bc196', '#318E6C'],
                  start: [0, 0],
                  end: [0, 1],
                }}
                title= 'Cancel Reservation'
                onPress= {() => {Alert.alert(
                  'Are you sure you want to CANCEL reservation?',
                  'If you click OK, the reservation will be cancelled. ARE YOU SURE?',
                  [ {text: 'Yes, Cancel Reservation', onPress: () =>{
                    this.cancelReservation();}},
                    {text: 'No, Keep Reservation'},
                  ],
                  {cancelable: false},
                );}}
              />
            </ScrollView>
            </Card>
          </View>
      )
    }
  }
}
