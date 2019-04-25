// Terms of service page, accessed from sign in screen
import React from "react";
import { View, ScrollView } from "react-native";
import { Image, Text } from "react-native-elements";
import { styles } from "../styles";

export default class TermsOfService extends React.Component {

  render() {
    return(
      <View style={{flex:1, backgroundColor: '#318E6C', padding: 10}}>
        <ScrollView>
          <Text style={[styles.h1, {marginVertical: 20}]}>Terms Of Service</Text>
          <Text style={styles.para}>
            1. Terms
            By accessing the website at http://www.achleiveprow.tk, or downloading the app 'Wheelz' you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing our services. The materials contained in this website and mobile application are protected by applicable copyright and trademark law.
          </Text>
          <Text style={styles.para}>
          2. Use License
            Permission is granted to temporarily download one copy of the materials (information or software) on Wheelz's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            modify or copy the materials;
            use the materials for any commercial purpose, or for any public display (commercial or non-commercial);
            attempt to decompile or reverse engineer any software contained on Wheelz's website;
            remove any copyright or other proprietary notations from the materials; or
            transfer the materials to another person or "mirror" the materials on any other server.
            This license shall automatically terminate if you violate any of these restrictions and may be terminated by Wheelz at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
          </Text>
          <Text style={styles.para}>
          3. Disclaimer
            The materials on Wheelz's website are provided on an 'as is' basis. Wheelz makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            Further, Wheelz does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
          </Text>
          <Text style={styles.para}>
          4. Limitations
          In no event shall Wheelz or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Wheelz's website, even if Wheelz or a Wheelz authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
          </Text>
          <Text style={styles.para}>
            5. Accuracy of materials
            The materials appearing on Wheelz's website could include technical, typographical, or photographic errors. Wheelz does not warrant that any of the materials on its website are accurate, complete or current. Wheelz may make changes to the materials contained on its website at any time without notice. However Wheelz does not make any commitment to update the materials.
          </Text>
          <Text style={styles.para}>
          6. Links
            Wheelz has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Wheelz of the site. Use of any such linked website is at the user's own risk.
          </Text>
          <Text style={styles.para}>
            7. Modifications
            Wheelz may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
          </Text>
          <Text style={styles.para}>
            8. Governing Law
            These terms and conditions are governed by and construed in accordance with the laws of United Kingdom and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
          </Text>
      </ScrollView>
    </View>
  );
  }
}
