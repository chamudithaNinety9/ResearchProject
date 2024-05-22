import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PoorBathReport = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.topicText}>Report</Text>
            <View style={styles.greenBox}>
                <Text style={styles.topic}>“Two children drown in Belihul-Oya”
                    [Monday, May 8, 2023   01.00 pm - Daily News]</Text>
                <Text style={styles.details}>Two children have drowned while bathing in Vadua Wala area in Belihul-Oya, Mathurata. According to the police, the deceased are Ayesh Induvara (12) and Priyangika Satsarani (13) who were residents of Katayapatana, Mathurata.
                    These two children are cousins. Police said that these two children along with another 21-year-old relative went to the Morapaya temple on the day of the incident. The police said that the three of them went to the Belihul-Oya near the temple to have a bath.
                </Text>
                <Text style={styles.details}>----------------------------------------------------------------------------
                </Text>
                <Text></Text>
                <Text style={styles.topic}>“Tragedy of three Sabaragamuwa students, who disappeared in Belihul Oya”
                    [November 12, 2018 - Gossip Lanka News]</Text>
                <Text style={styles.details}>Three Sabaragamuwa University students who were drowned after falling into the Balangoda, Belihul Oya Pahantudawa ella passed away in the afternoon day before yesterday (10) after being admitted to Balangoda Basic Hospital.

                    Balasunderam Ajith of 25 years and who was in his third year was in their group and was fortunate enough to save his life. This is how he explained the incident: "The seven of us are studying at Sabaragamuwa University in the Geology Faculty. The seven of us lodge in the same room. All of us
                    are residents of Jaffna. As last 10th was a holiday we thought of going and seeing Belihul Oya Pahanthudawa Ella. As such, we set off in a bus plying across Balangoda, Galagama, Landuyaya and reached close to Pahanthudawa Ella around 9 in the morning.</Text>
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

export default PoorBathReport;
