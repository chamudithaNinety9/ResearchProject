import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const GoodBathReport = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.topicText}>Report</Text>
            <View style={styles.greenBox}>
                <Text style={styles.topic}>“Bathers Enjoy Safe Experience at Sembuwatta Lake”
                    [Monday, May 8, 2023   01.00 pm - Daily News]</Text>
                <Text style={styles.details}>Bathing enthusiasts at Sembuwatta Lake experienced a safe and enjoyable time during their visit. No accidents, injuries, or fatalities were reported.
                    The water clarity was excellent, the flow was moderate, and the terrain around the lake was easily accessible.</Text>
                <Text style={styles.details}>----------------------------------------------------------------------------
                </Text>
                <Text></Text>
                <Text style={styles.details}>However, like any natural area with bodies of water, there can be risks associated with bathing, such as slippery rocks, strong currents, and other hazards. It's essential for visitors to exercise caution and adhere to safety guidelines when enjoying outdoor activities in such environments.</Text>
                <Text></Text>
                <Text>If you're planning to visit any similar area, it's advisable to check for local advisories, follow posted signs, and take necessary precautions to ensure your safety and the safety of others. Additionally, being aware of weather conditions and water levels can help mitigate risks associated with outdoor activities.</Text>
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
        height: '85%',
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

export default GoodBathReport;
