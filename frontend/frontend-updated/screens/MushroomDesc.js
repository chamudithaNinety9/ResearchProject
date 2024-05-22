import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Svg, Path } from 'react-native-svg';

const MushroomDesc = ({ route, navigation }) => {
    const { imageUri, defectiveness, edibility } = route.params;
    const [capturedImageUri] = useState(imageUri);

    const [sound, setSound] = useState();
    const [isPlaying, setIsPlaying] = useState(false);
    const [waveData, setWaveData] = useState([]);

    const intervalRef = useRef(null);

    useEffect(() => {
        return sound ? () => sound.unloadAsync() : undefined;
    }, [sound]);

    useEffect(() => {
        if (sound) {
            sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        }
    }, [sound]);

    const onPlaybackStatusUpdate = (status) => {
        if (status.didJustFinish) {
            setIsPlaying(false);
            clearInterval(intervalRef.current);
        }
    };

    


    const generateWaveData = () => {
        const data = [];
        for (let i = 0; i < 100; i++) {
            data.push(Math.random());
        }
        setWaveData(data);
    };

    const handleHomeButton = () => {
        navigation.navigate('Home');
    };


    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: capturedImageUri }} />
            <Text style={styles.capText}>Here the suggested Mushroom species.</Text>

            <Text style={styles.type}>Edible or poisonous : {edibility} </Text>
            <Text style={styles.cname}>Common Name : {defectiveness}</Text>
            <TouchableOpacity style={styles.home} onPress={handleHomeButton}>
                <Text style={styles.homeText}>Home Page</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    image: {
        width: 250,
        height: 300,
        top: '5%',
    },
    capText: {
        top: '10%',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    buttonContainer: {
        position: 'absolute',
        left: '5%',
        top: '70%',
    },
    playButtonImage: {
        width: 45,
        height: 45,
        left: '10%',
        top: '10%'
    },
    soundWaveContainer: {
        position: 'absolute',
        width: 262,
        height: 49,
        borderRadius: 10,
        backgroundColor: 'rgba(144, 238, 144, 0.7)',
        left: '15%',
        top: '70%',
    },
    soundWavePosition: {
        left: '17.5%',
        top: '70.5%',
    },
    home: {
        top: '40%',
        backgroundColor: "#00D972",
        borderRadius: 10,
        height: 40,
        width: '50%',
        borderColor: 'black',
        borderWidth: 1,
    },
    homeText: {
        textAlign: 'center',
        top: '18%',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#FFFF'
    },
    type: {
        top: '18%',
        left: '-15%',
        fontSize: 15,
        fontWeight: '600'
    },
    cname: {
        top: '20%',
        left: '-10%',
        fontSize: 15,
        fontWeight: '600'
    },
});

export default MushroomDesc;
