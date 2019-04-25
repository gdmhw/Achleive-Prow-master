import React, { Component } from 'react'
import { Text, View } from 'react-native'

//renders two lines of text when passed in a dockID as a prop
//the bike capacity of the dock
//the number of free bikes at that dock

export default class FreeBikes extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        capacity: null,
        freeBikes: null
      
      };
    }
  
    async componentWillMount(){
  
      const url = "https://achleiveprow.tk/api/v1/docks/freebikes/"+this.props.dockID;
      try {
          const response = await fetch(url);
          const content = await response.json();
          return (
            content.response.map(({capacity, freeBikes}) => (
            this.setState({capacity: capacity, freeBikes: freeBikes }, console.log(content))
            ))
            
          )
            
                    
      }
      catch (e) {
      return (console.log(e))
      };  
  }
  
    render() {
      return (
        <View style={{paddingBottom: 5}}>
          <Text>Capacity: {this.state.capacity}</Text>
          <Text>Free Bikes: {this.state.freeBikes}</Text>
        </View>
      )
    }
  }
