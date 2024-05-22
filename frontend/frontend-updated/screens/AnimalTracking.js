import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const AnimalTracking = () => {
    const navigation = useNavigation();

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant camera permission to use this feature.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            navigation.navigate('ImageSuccess', { imageUri: result.assets[0].uri });
        } else {
            console.log('Image capture canceled');
        }
    };

    const openGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'You need to grant media library permission to use this feature.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            // setImageUri(result.uri);
            navigation.navigate('ImageSuccess', { imageUri: result.assets[0].uri });
        } else {
            console.log('Image selection canceled');
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../assets/cam.png')}
            />
            <Text style={styles.topicText}>Animal Identify</Text>
            <Text style={styles.normalText}>Capture Footprint to Identify Animal</Text>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={openGallery} style={[styles.button, styles.galleryButton]}>
                    <Text style={styles.buttonText}>Select from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openCamera} style={[styles.button, styles.cameraButton]}>
                    <Text style={styles.buttonText}>Open Camera</Text>
                </TouchableOpacity>
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
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: 25,
        lineHeight: 30,
        textAlign: 'center',
        color: '#000',
        top: '55%',
    },
    image: {
        position: 'absolute',
        width: 200,
        height: 195,
        left: '25%',
        top: '25%',
    },
    normalText: {
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 20,
        lineHeight: 30,
        textAlign: 'center',
        color: '#000',
        top: '58%',
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    button: {
        width: '45%',
        height: 40,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    galleryButton: {
        backgroundColor: '#5FFF9F',
        top: '110%',
    },
    cameraButton: {
        backgroundColor: '#FF5F5F',
        top: '110%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AnimalTracking;
