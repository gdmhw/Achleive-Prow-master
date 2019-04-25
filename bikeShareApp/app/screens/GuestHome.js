import React from "react";
import { ScrollView, Text, Linking, View, StyleSheet, Dimensions, Platform} from "react-native";
import { Card, Button, Icon} from "react-native-elements";
import { Constants, MapView, LinearGradient, } from 'expo';
import FreeBikes from './FreeBikes';   









export default class GuestHome extends React.Component {
  
  static navigationOptions = ({ navigation, screenProps }) => ({
    title: "",
    headerRight: <Button containerStyle={{height: 35, paddingRight: 5}} titleStyle={{fontSize: 15}} ViewComponent={require('expo').LinearGradient}
    linearGradientProps={{
        colors: ['black', 'black'],
        start: [0, 0],
        end: [0, 0],
    }} title="Report Fault" onPress={()=>{ navigation.navigate('GuestFaults') }} />,
  });

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

  async componentWillMount (){
    const url = "https://achleiveprow.tk/api/v1/docks";
    try {
            const response = await fetch(url);
            const content = await response.json();
            return ( this.setState({
              data: content.response
          },
            //console.log(this.state.data.length)
            this.freeBikes
            ));
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
        {this.state.data.map((marker) => (
        <MapView.Marker key={marker.dockID}
          coordinate={{latitude: parseFloat(marker.latitude),
                       longitude: parseFloat(marker.longitude)}}
          title={"Dock "+ String(marker.dockName)}
          onPress={() => { this.refs._scrollView.scrollTo({x:0 ,y:offset*(marker.dockID - 1), animated: true}) }}
        />
        ))}

        </MapView>


        <ScrollView ref="_scrollView" onContentSizeChange={(width, height) => {
          this.setState({scrollViewHeight: height, viewLength: this.state.data.length},() => {});}}
        >
        {this.state.data.map(({ dockName, dockID, capacity}) => (

        <Card borderRadius={20} containerStyle={{ backgroundColor: 'white'}}  ViewComponent={require('expo').LinearGradient}
        linearGradientProps={{
          colors: ['#4bc196', '#318E6C'],
          start: [0, 0],
          end: [0, 1],
        }}
        title={`${dockName}`} 
        key={dockID}>


         <FreeBikes dockID={dockID}/>
          
          
          
          
        



          <Button

            ViewComponent={require('expo').LinearGradient}
            linearGradientProps={{
                colors: ['#4bc196', '#318E6C'],
                start: [0, 0],
                end: [0, 1],
            }}
            title="Book a bike!"
            onPress={() => {navigate("GuestBookBike",{
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
