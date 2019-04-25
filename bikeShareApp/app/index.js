import React from "react";
import { Platform, StatusBar, TouchableOpacity, Text} from "react-native";
import { Image, Button } from "react-native-elements";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";
import {styles} from "./styles";
import SignUp from "./screens/SignUp";
import SignIn from "./screens/SignIn";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Reservations from "./screens/Reservations";
import BookBike from "./screens/BookBike";
import GuestHome from './screens/GuestHome';
import GuestBookBike from './screens/GuestBookBike';
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsOfService from './screens/TermsOfService';
import Faults from './screens/Faults';
import ActiveRes from './screens/ActiveRes';
import { isSignedIn } from "./auth";
import { validToken } from './asyncFunctions';


//this is where the app comes together. The apps navigation is implemented in this component which allows a user to move around the app.
export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  async componentDidMount() {
    await validToken(true)
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred."));
  }

  render() {
    const { signedIn, checkedSignIn } = this.state;

    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    const Ap = createAppContainer(createRootNavigator(signedIn));
    return <Ap />;
  }
}

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  backgroundColor: "#318E6C",
  borderBottoWidth: 0,
  borderColor: "#318E6C",
  fontSize: '30px'

};

const titleStyle = {
  fontSize: 30,
  color:"black",
  textAlign: 'center',
 flex: 1
}

//this creates a stack navigator with all the pages a signed out user can reach
const SignedOut = createStackNavigator({
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      headerTitle: <TouchableOpacity style={{alignItems: 'center'}} activeOpacity = {0.5}>
      <Image style={{flex:1, alignSelf: 'center', tintColor: "black"}}
        source={require('./images/logo.png')}
        resizeMode= "contain"
      />
    </TouchableOpacity>,
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle,
    }
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      headerTitle: <TouchableOpacity style={{alignItems: 'center'}} activeOpacity = {0.5}>
                      <Image style={{flex:1, alignSelf: 'center', tintColor: "black"}}
                        source={require('./images/logo.png')}
                        resizeMode= "contain"
                      />
                    </TouchableOpacity>,
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle,
    }
  },
  GuestHome: {
    screen: GuestHome,
    navigationOptions: {
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle
    }

  },
  GuestBookBike: {
    screen: GuestBookBike,
    navigationOptions: {
      headerTitle: <TouchableOpacity style={{alignItems: 'center'}} activeOpacity = {0.5}>
      <Image style={{flex:1, alignSelf: 'center', tintColor: "black"}}
        source={require('./images/logo.png')}
        resizeMode= "contain"
      />
    </TouchableOpacity>,
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle
    }
  },
  PrivacyPolicy: {
    screen: PrivacyPolicy,
    navigationOptions: {
      headerTitle: <TouchableOpacity style={{alignItems: 'center'}} activeOpacity = {0.5}>
      <Image style={{flex:1, alignSelf: 'center', tintColor: "black"}}
        source={require('./images/logo.png')}
        resizeMode= "contain"
      />
    </TouchableOpacity>,
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle
    }
  },
  TermsOfService: {
    screen: TermsOfService,
    navigationOptions: {
      headerTitle: <TouchableOpacity style={{alignItems: 'center'}} activeOpacity = {0.5}>
      <Image style={{flex:1, alignSelf: 'center', tintColor: "black"}}
        source={require('./images/logo.png')}
        resizeMode= "contain"
      />
    </TouchableOpacity>,
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle
    }
  },
  GuestFaults: {
    screen: props=> <Faults {...props }  nav="GuestHome"/>,
    navigationOptions: {
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle
    }
  },
},
{
  initialRouteName: "SignIn",

});

//this creates a bottom tab navigator with all the pages a signed in user can reach from the bottom tab navigation
const SignedIn = createBottomTabNavigator(
  {
    Reservations: {
      screen: Reservations,
      navigationOptions: {
        tabBarLabel: "Reservations",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="history" size={30} color={tintColor} />
        )
      }
    },
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: "Home",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="home" size={30} color={tintColor} />
        )
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor }) => (
          <FontAwesome name="user" size={30} color={tintColor} />
        )
      }
    }

  },
  {
    initialRouteName: "Home",
    tabBarOptions: {
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "white"

      },
      activeTintColor:'#318E6C',
      inactiveTintColor:"grey"
    }
  }
);



//this creates a stack navigator with all the pages a signed in user can reach (including the tab navigator above) with initial screen taking the signed in user ot the bottom tab navigator.
const SignedInMain = createStackNavigator({
  BookBike: {
    screen: BookBike,
    navigationOptions: {
      headerTitle: <TouchableOpacity style={{alignItems: 'center'}} activeOpacity = {0.5}>
      <Image style={{flex:1, alignSelf: 'center', tintColor: "black"}}
        source={require('./images/logo.png')}
        resizeMode= "contain"
      />
    </TouchableOpacity>,
      headerStyle,
      headerTintColor: 'black'
    }
  },
  Faults: {
    screen: props => <Faults {...props}  nav="Reservations"/>,
    navigationOptions: {
      headerStyle,
      headerTintColor: 'black',
      headerTitleStyle: titleStyle
    }
  },

  ActiveRes: {
    screen: ActiveRes,
    navigationOptions: {
      headerTitle: <TouchableOpacity style={{alignItems: 'center'}} activeOpacity = {0.5}>
      <Image style={{flex:1, alignSelf: 'center', tintColor: "black"}}
        source={require('./images/logo.png')}
        resizeMode= "contain"
      />
    </TouchableOpacity>,
      headerStyle,
      headerTintColor: 'black'
    }
  },
  SignedIn: {
    screen: SignedIn,
    navigationOptions: {
      header: null,
      headerMode: 'none'
    }
  }
},
{
  initialRouteName: "SignedIn",
});

const createRootNavigator = (signedIn) => {
  var path;
  if(signedIn === 'user')
    path = "SignedIn"
  else
    path = "SignedOut"
  return createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedInMain
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: path
    }
  );
}
