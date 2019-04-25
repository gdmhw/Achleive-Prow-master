import React from "react";
import { ScrollView, Text, Linking, View, StyleSheet, Dimensions} from "react-native";
import { Card, Button } from "react-native-elements";
import { Constants, MapView, LinearGradient } from 'expo';
import FreeBikes from './FreeBikes';   


//Home page for logged in users
//this is where a user can select a bike dock where they want to book a bike
//shows the user a map of bike dock locations in edinburgh

export default class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mapRegion: {
        latitude: 55.9533,
        longitude: -3.1883,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      currentMarker: 1,
      screenHeight: Dimensions.get('window').height,
      scrollViewHeight: null,
      viewLength: null,
      data: null


    };
  }

  //On load fetch the list of bike docks from the database and store them in state
  //
  async componentWillMount (){
    const url = "https://achleiveprow.tk/api/v1/docks";
    try {
            const response = await fetch(url);
            const content = await response.json();
            return ( this.setState({
              data: content.response
          },() => {

            }));
        }
        catch (e) {
            return console.log(e);
        }
      }



  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };


  render() {
    const {navigate} = this.props.navigation;

    const offset= this.state.scrollViewHeight/this.state.viewLength;


    if(this.state.data === null){
      return (<View><Text>Data did not load in correctly</Text></View>)
  }


    return (

      <View style={{flex:1, backgroundColor:"#EFEFEF"}}>

        <MapView
          style={styles.container}
          region={this.state.mapRegion}
        >

        {//adds markers to the map for each bike dock stored in state. On click of the marker scrolls the scroll view to the selected bike dock 
          this.state.data.map((marker) => (
        <MapView.Marker key={marker.dockID}
          coordinate={{latitude: parseFloat(marker.latitude),
                       longitude: parseFloat(marker.longitude)}}
          title={String(marker.dockName)}
          onPress={() => { this.refs._scrollView.scrollTo({x:0 ,y:offset*(marker.dockID - 1), animated: true}) }}
        />
        ))}

        </MapView>


        <ScrollView ref="_scrollView" onContentSizeChange={(width, height) => {
          this.setState({scrollViewHeight: height, viewLength: this.state.data.length},() => {});}}
        >
        {// add card for each bike dock with a button which takes the user to a reservation page for that bike dock
          this.state.data.map(({ dockName, dockID, capacity}) => (

        <Card borderRadius={20} containerStyle={{ backgroundColor: 'white'}}  ViewComponent={require('expo').LinearGradient}
        linearGradientProps={{
          colors: ['#4bc196', '#318E6C'],
          start: [0, 0],
          end: [0, 1],
        }}title={`${dockName}`} key={dockID}>

        <FreeBikes dockID={dockID}/>

          <Button

            ViewComponent={require('expo').LinearGradient}
            linearGradientProps={{
              colors: ['#4bc196', '#318E6C'],
              start: [0, 0],
              end: [0, 1],
            }}
            title="Book a bike!"
            onPress={() => {navigate("BookBike",{
              dockID: dockID,
              dockName: dockName
            })}}
          />


        </Card>
      ))}
    </ScrollView>

      </View>



    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    height: '50%',
    backgroundColor: '#ecf0f1',
  },
});
