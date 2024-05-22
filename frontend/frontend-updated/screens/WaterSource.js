import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const CampTentBuild = ({ navigation }) => {
    const [pick, setPick] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [animations] = useState([
        new Animated.Value(-430),
        new Animated.Value(-430),
        new Animated.Value(-430),
    ]);

    useEffect(() => {
        const id = setInterval(() => {
            if (pick === '' || pick === 'default') {
                switchImage();
            } else {
                renderSelectedImage(pick);
            }
        }, 2000);
        setIntervalId(id);
        return () => clearInterval(id);
    }, [pick]);

    useEffect(() => {
        animateImages();
    }, [selectedImageIndex]);

    const PressNext = () => {
        if(pick === 'default' || pick === ''){
            Alert.alert('Warning','Please Select an Option');
        }
        else if (pick === 'waterfall') {
            navigation.navigate('Waterfall');
        } else if (pick === 'lake') {
            navigation.navigate('Lake');
        } else if (pick === 'river') {
            navigation.navigate('River');
        }
    };

    const switchImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % 3);
    };

    const renderSelectedImage = (itemValue) => {
        switch (itemValue) {
            case 'waterfall':
                setSelectedImageIndex(0);
                break;
            case 'river':
                setSelectedImageIndex(1);
                break;
            case 'lake':
                setSelectedImageIndex(2);
                break;
            case 'default':
                setSelectedImageIndex(2);
                break;
            default:
                break;
        }
    };

    const animateImages = () => {
        animations.forEach((animation, index) => {
            Animated.timing(animation, {
                toValue: index === selectedImageIndex ? 0 : -430,
                duration: 500,
                useNativeDriver: false,
            }).start();
        });
    };

    return (
        <View style={styles.container}>
            <Animated.Image
                style={[styles.homePic, { left: animations[0] }]}
                source={require('../assets/waterfall.png')}
            />
            <Animated.Image
                style={[styles.homePic, { left: animations[1] }]}
                source={require('../assets/river.png')}
            />
            <Animated.Image
                style={[styles.homePic, { left: animations[2] }]}
                source={require('../assets/lake.png')}
            />
            <View style={styles.rectangle81}></View>
            <Text style={styles.campingTentBuild}>Water-source for bathing</Text>
            <Text style={styles.selectLocationText}>Select Water-source Type</Text>
            <View style={styles.rectangle49}></View>

            <Text style={styles.question}>Select Water-source here</Text>
            <Picker
                selectedValue={pick}
                style={styles.dropdown}
                onValueChange={(itemValue, itemIndex) => {
                    clearInterval(intervalId);
                    console.log('Selected value:', itemValue);
                    setPick(itemValue);
                }}>
                <Picker.Item label="Pick an option" value="default" />
                <Picker.Item label="Waterfall" value="waterfall" />
                <Picker.Item label="River" value="river" />
                <Picker.Item label="Lake" value="lake" />
            </Picker>

            <TouchableOpacity style={styles.nextButton} onPress={PressNext}>
                <Text style={styles.nextText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 430,
        height: 1350,
        backgroundColor: '#FFFFFF',
    },
    campingTentBuild: {
        position: 'absolute',
        width: 250,
        height: 24,
        left: '2.5%',
        top: '16%',
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
    selectLocationText: {
        marginBottom: 10,
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 19,
        left: '25%',
        color: '#653030',
        top: '20%'
    },
    nextButton: {
        position: 'absolute',
        width: 131,
        height: 37,
        left: '30%',
        top: '40%',
        backgroundColor: '#5FFF9F',
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 15,
    },
    nextText: {
        position: 'absolute',
        width: 80,
        height: 24,
        left: '20%',
        top: '15%',
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
        height: '15%',
        left: 0,
        top: '0%',
    },
    question: {
        top: '25%',
        fontSize: 15,
        marginBottom: 10,
        left: '10%',
    },
    dropdown: {
        top: '26%',
        height: 50,
        width: '80%',
        marginBottom: 20,
        backgroundColor: '#ADD8',
        left: '5%',
        borderRadius: 10,
        borderWidth: 2,
    },
});

export default CampTentBuild;
