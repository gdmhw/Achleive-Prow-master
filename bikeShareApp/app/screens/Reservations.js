import React from "react";
import { View, StyleSheet, Dimensions, ScrollView} from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { LinearGradient } from 'expo';
import moment from "moment";
import { styles } from '../styles';
import { getUserKey, setReservations } from '../asyncFunctions';

export default class Reservations extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      screenHeight: Dimensions.get('window').height,
      scrollViewHeight: null,
      viewLength: null,
      data: null,
      dockNames: null,
      errorCode: null
    };
  }

  componentDidMount(){
    this.subs = [this.props.navigation.addListener('didFocus', () => this.componentDidFocus()),];
  }

  async componentDidFocus (){
    try {
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
            await setReservations(content.response);
            var finalList = [];
            var flc = 0;
            for(i = 0; i < content.response.length; i++){
              var tFrom = moment(content.response[i].timeFrom);
              if((content.response[i].status === 'reserved' || content.response[i].status === 'active')
                && ((moment(tFrom).dayOfYear() === moment().dayOfYear()) || (tFrom.diff(moment(), 'days') >= 1)) ) {
                finalList[flc] = content.response[i];
                flc++;
              }
            };
            let response2 = await fetch(
              'https://achleiveprow.tk/api/v1/docks',{
              method: 'GET',
              headers: {
                Accept:
                  'application/json',
                  'Content-Type': 'application/json'},
            });
            let content2 = await response2.json();
            return ( this.setState({
              data: finalList,
              dockNames: content2.response,
              errorCode: content.status
          }));

        }catch (e) {
            return console.log(e);
        }
    }

  render() {
    const {navigate} = this.props.navigation;
    if(this.state.data === null || this.state.data.length < 1){
        return (<View style={styles.container}><Text style={styles.h1}>You have no reservations</Text></View>)
    }else{
    {() => setReservations(this.state.data)}
    return (
      <View style={styles.container}>
        <Text style={styles.h1}>Your Reservations</Text>
        <View style={{alignItems: 'center'}}>
          <ScrollView style={{height:'85%'}} ref="_scrollView" onContentSizeChange={(width, height) => {
            this.setState({scrollViewHeight: (height), viewLength: this.state.data.length},() => {});}}
          >
          {this.state.data.map(({resID, pickupDock, timeFrom}) => (
                  <Card key={resID}>
                    <Text style={styles.h2}>Pick up from {this.state.dockNames[pickupDock-1].dockName}</Text>
                    <Text style={styles.h2}>Your booking is for</Text>
                    <Text style={styles.h1}>{moment(timeFrom, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YY")}</Text>
                    <Text style={styles.h2}><Text style={{fontWeight: 'bold', color:'black'}}>
                      {moment(timeFrom, "YYYY-MM-DD HH:mm:ss").format("HH:mm")}</Text></Text>
                    <Button
                      buttonStyle={{ marginTop: 20 }}
                      titleStyle={{ color:"black" }}
                      ViewComponent={require('expo').LinearGradient}
                      linearGradientProps={{
                        colors: ['#4bc196', '#318E6C'],
                        start: [0, 0],
                        end: [0, 1],
                      }}
                      title="Open Reservation"
                      onPress= {() =>
                        this.props.navigation.navigate("ActiveRes", {resID: resID})}
                    />
                  </Card>

            ))}
          </ScrollView>
          </View>
          <View style={{flex:1, justifyContent: 'flex-end'}}>
            <Button
              buttonStyle={{marginVertical: 10,width:'60%', alignSelf: 'center'}}
              titleStyle={{color:"black", fontSize: 20}}
              ViewComponent={require('expo').LinearGradient}
              linearGradientProps={{
                colors: ['#4bc196', '#318E6C'],
                start: [0, 0],
                end: [0, 1],
              }}
              title="Report a Fault"
              onPress= {() => this.props.navigation.navigate("Faults")}
            />
          </View>
        </View>
      );
    }
  }
}
