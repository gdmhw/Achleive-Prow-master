// Privacy Policy, accessed from sign in screen
import React from "react";
import { View, ScrollView } from "react-native";
import { Image, Text } from "react-native-elements";
import { styles } from "../styles";

export default class PrivacyPolicy extends React.Component {

  render() {
    return(
      <View style={{flex:1, backgroundColor: '#318E6C', padding: 10}}>
        <ScrollView>
          <Text style={[styles.h1, {marginVertical: 20}]}>Privacy Policy</Text>
          <Text style={styles.para}>
            Your privacy is important to us. It is Wheelz's policy to respect your privacy regarding any information we may collect from you across our website, http://www.achleiveprow.tk, and other sites or applications we own and operate.
          </Text>
          <Text style={styles.para}>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorised access, disclosure, copying, use or modification.
          </Text>
          <Text style={styles.para}>
            We don’t share any personally identifying information publicly or with third-parties, except when required to by law.
            Our website and mobile application may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.
          </Text>
          <Text style={styles.para}>
            You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.
            Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.
          </Text>
          <Text style={styles.para}>
            This policy is effective as of 1 March 2019.
          </Text>
      </ScrollView>
    </View>
  );
  }
}
