// Stylesheet added to ensure consistency of styles

import { StyleSheet } from "react-native";
import { Constants } from 'expo';

export const styles = StyleSheet.create({
  h1:{
    textAlign: 'center',
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  h2:{
    textAlign: 'center',
    color: '#318E6C',
    fontSize: 20,
  },
  h2b:{
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
    marginVertical: 10,
  },
  h3:{
    textAlign: 'center',
    color: '#318E6C',
    fontSize: 13,
  },
  inputHeader:{
    paddingLeft: 10,
    fontSize: 20
  },
  para:{
    marginVertical: 8,
  },
  genText:{
    fontSize: 15,
    marginVertical: 9,
    textAlign: 'center',
  },
  error:{
    color: 'red',
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingRight:20,
  },
  link:{
    color: 'darkblue',
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    fontSize: 10,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
  },
});
