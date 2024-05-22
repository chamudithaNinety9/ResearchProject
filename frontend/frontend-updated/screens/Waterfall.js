import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Base_url } from '../common/baseUrl';

const CampTentBuild = ({ navigation }) => {
    const [flow, setFlow] = useState('');
    const [clarity, setClarity] = useState('');
    const [wildlife, setWildlife] = useState('');
    const [human, setHuman] = useState('');
    const [terrain, setTerrain] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const TentProcess = () => {
        if (
            flow === '' ||
            clarity === '' ||
            wildlife === '' ||
            human === '' ||
            terrain === ''
        ) {
            Alert.alert('Error', 'Please select values for all dropdowns.');
        } else {
            setIsLoading(true);

            const requestBody = {
                type: 1,
                waterflow: flow,
                waterclarity: clarity,
                wildlife: wildlife,
                humanfootprints: human,
                terraintype: terrain
            };

            // Make API request
            fetch(Base_url + '/bathSafety', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            })
                .then(response => {
                    // Handle response
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    setIsLoading(false);
                    Alert.alert('Safety Rating', `Percentage of Safe: ${data.Precentage_of_Safe}\nSafety Rating: ${data.Safety_Rating}`);
                    if (data.Safety_Rating === 'Good') {
                        navigation.navigate('GoodBath');
                    } else if (data.Safety_Rating === 'Fair') {
                        navigation.navigate('FairBath');
                    } else if (data.Safety_Rating === 'Poor') {
                        navigation.navigate('PoorBath');
                    } else if (data.Safety_Rating === 'Excellent') {
                        navigation.navigate('ExcellentBath');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Alert.alert('Error', 'Failed to process. Please try again later.');
                    setIsLoading(false);
                });
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>
                <Image
                    style={styles.homePic}
                    source={require('../assets/waterfall.png')}
                />
                <View style={styles.rectangle81}></View>
                <Text style={styles.waterfallText}>Waterfall</Text>
                <View style={styles.rectangle49}></View>

                <View style={styles.greenBox}>
                    <Text style={styles.question}>Water Flow</Text>
                    <Picker
                        selectedValue={flow}
                        style={styles.dropdown}
                        onValueChange={(itemValue, itemIndex) =>
                            setFlow(itemValue)
                        }>
                        <Picker.Item label="Select One" value="" />
                        <Picker.Item label="High" value="2" />
                        <Picker.Item label="Low" value="4" />
                        <Picker.Item label="Moderate" value="3" />
                        <Picker.Item label="Very High" value="1" />
                    </Picker>
                    <Text style={styles.question}>Water Clarity</Text>
                    <Picker
                        selectedValue={clarity}
                        style={styles.dropdown}
                        onValueChange={(itemValue, itemIndex) =>
                            setClarity(itemValue)
                        }>
                        <Picker.Item label="Select One" value="" />
                        <Picker.Item label="Clear" value="1" />
                        <Picker.Item label="Murky" value="2" />
                        <Picker.Item label=" Turbid" value="3" />
                    </Picker>
                    <Text style={styles.question}>Presence of Wildlife</Text>
                    <Picker
                        selectedValue={wildlife}
                        style={styles.dropdown}
                        onValueChange={(itemValue, itemIndex) =>
                            setWildlife(itemValue)
                        }>
                        <Picker.Item label="Select One" value="" />
                        <Picker.Item label="Yes" value="1" />
                        <Picker.Item label="No" value="0" />
                    </Picker>
                    <Text style={styles.question}>Human Footprints</Text>
                    <Picker
                        selectedValue={human}
                        style={styles.dropdown}
                        onValueChange={(itemValue, itemIndex) =>
                            setHuman(itemValue)
                        }>
                        <Picker.Item label="Select One" value="" />
                        <Picker.Item label="Few" value="3" />
                        <Picker.Item label="None" value="4" />
                        <Picker.Item label="Some" value="2" />
                        <Picker.Item label="Many" value="1" />
                    </Picker>
                    <Text style={styles.question}>Terrain Type</Text>
                    <Picker
                        selectedValue={terrain}
                        style={styles.dropdown}
                        onValueChange={(itemValue, itemIndex) =>
                            setTerrain(itemValue)
                        }>
                        <Picker.Item label="Select One" value="" />
                        <Picker.Item label="High" value="1" />
                        <Picker.Item label="Moderate" value="2" />
                        <Picker.Item label="Minimal" value="3" />
                        <Picker.Item label="Low" value="4" />
                    </Picker>
                </View>
                <TouchableOpacity style={styles.rectangle84} onPress={TentProcess}>
                    {isLoading && <ActivityIndicator size="large" color="#000" />}
                    <Text style={styles.processText}>Check</Text>
                </TouchableOpacity>
                <View style={styles.rectangle93}></View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        position: 'relative',
        width: 430,
        height: 900,
        backgroundColor: '#FFFFFF',
    },
    waterfallText: {
        position: 'absolute',
        width: 191,
        height: 24,
        left: '20%',
        top: '25%',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 24,
        textAlign: 'center',
        color: '#000000',
    },
    rectangle81: {
        position: 'absolute',
        width: 430,
        height: 165,
        left: 0,
        top: 0,
    },
    rectangle49: {
        position: 'absolute',
        width: 23,
        height: 23,
        left: 108,
        top: 887,
        backgroundColor: 'url(48)',
    },
    greenBox: {
        position: 'absolute',
        width: '85%',
        height: 'auto',
        left: '3%',
        top: '30%',
        backgroundColor: '#5FFF9F',
        borderRadius: 10,
        padding: 20,
    },
    dropdown: {
        height: '50%',
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#fafafa',
    },
    rectangle84: {
        position: 'absolute',
        width: 131,
        height: 37,
        left: '30%',
        top: 850,
        backgroundColor: '#5FFF9F',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 15,
    },
    processText: {
        position: 'absolute',
        width: 80,
        height: 24,
        left: '20%',
        top: '12%',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 24,
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.89)',
    },
    rectangle93: {
        position: 'absolute',
        width: 10,
        height: 10,
        left: 368,
        top: 285,
        backgroundColor: 'url(Inputs (22))',
    },

    homePic: {
        position: 'absolute',
        width: '100%',
        height: '20%',
        left: 0,
        top: '0%',
    },
    question: {
        fontSize: 15,
        marginBottom: 10,
    },
    dropdown: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fafafa',
    },
});

export default CampTentBuild;
