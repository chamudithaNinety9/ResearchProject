import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FairBathReport = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.topicText}>Report</Text>
            <View style={styles.greenBox}>
                <Text style={styles.topic}>“Mother of four takes fatal leap at Devon Falls”
                    [April 22, 2023   07:55 pm - Ada Derana]</Text>
                <Text style={styles.details}>A mother of four took a fatal leap at Devon Falls today (22 April) over an alleged family dispute, Police revealed.</Text>
                <Text></Text>

                <Text>Accordingly, the Dimbula Pathana Police revealed that the deceased had arrived at the police station with two of her four children, and lodged a complaint with regards to a family dispute that had occurred.</Text>
                <Text></Text>
                <Text>She had later visited Devon Falls with one of the children, and had asked for the child to bring her a bottle of water. She had then jumped to her death when the child left the area, the Dimbula Pathana Police said.</Text>
                <Text></Text>
                    <Text>Dimbula Pathana Police initiated a search operation to recover the body of the deceased after her child ran back to the station claiming that his mother had jumped off the waterfall, the Police said, adding that further investigations into the incident are underway.</Text>
                <Text style={styles.details}>----------------------------------------------------------------------------
                </Text>
                <Text></Text>
                <Text style={styles.details}>Although this place is fair for bathing, like any natural area with bodies of water, there can be risks associated with bathing, such as slippery rocks, strong currents, and other hazards.</Text> 
                <Text></Text>
                <Text>It's essential for visitors to exercise caution and adhere to safety guidelines when enjoying outdoor activities in such environments.
                    If you're planning to visit any similar area, it's advisable to check for local advisories, follow posted signs, and take necessary precautions to ensure your safety and the safety of others.</Text>

                    <Text></Text>
                    <Text>Additionally, being aware of weather conditions and water levels can help mitigate risks associated with outdoor activities.</Text>
                <Text></Text>
                </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    topicText: {
        marginBottom: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'center',
        color: '#653030',
        top: '2%',
    },
    image: {
        position: 'absolute',
        width: 168,
        height: 150,
        left: '35%',
        top: '35%',
    },
    greenBox: {
        position: 'absolute',
        width: '95%',
        height: '88%',
        left: '2.5%',
        top: '8%',
        backgroundColor: '#5FFF9F',
        borderRadius: 10,
        padding: 20,
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 15,
        bottom: '1.2%',
    },
});

export default FairBathReport;
