import React, {Component} from "react";
import { View , AsyncStorage} from "react-native";
import { Card, Button, Text } from "react-native-elements";
import { onSignOut } from "../auth";
import { setKey } from "../asyncFunctions";
import Icon from 'react-native-vector-icons/FontAwesome';
import { getUserKey } from '../asyncFunctions';

//page where a user can log out
export default class Profile extends Component {

  constructor(props){
    super(props)
    this.state = {name: null}
  }

// on load gets user name and stores it in state
  async componentWillMount (){

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
      this.setState({name: content.response[0].fname+" "+content.response[0].lname});
    }catch(e){
      console.log(e);
    }
    
  }



  render() {
    return (
      <View style={{ paddingTop: 50}}>
      {/*title displays users name*/}
    <Card title={this.state.name}>
      <View
        style={{
          
          alignItems: "center",
          justifyContent: "center",
          
          
          alignSelf: "center",
          marginBottom: 20
        }}
      >
        
        <Icon
           name='user'
           size={50}
           color='black'
         />
      </View>
      <Button
        ViewComponent={require('expo').LinearGradient}
        linearGradientProps={{
          colors: ['#4bc196', '#318E6C'],
          start: [0, 0],
          end: [0, 1],
        }}
        title="Sign Out"
        onPress={() => {setKey('null').then(this.props.navigation.navigate("SignedOut"))}}
      />
    </Card>
  </View>
    )
  }
}
