import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { Svg, Path } from 'react-native-svg';

const AnimalSound = ({ route, navigation }) => {
    const { imageUri, defectiveness } = route.params;
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

    const toggleSound = async () => {
        try {
            if (sound) {
                if (isPlaying) {
                    await sound.pauseAsync();
                    clearInterval(intervalRef.current);
                } else {
                    await sound.setPositionAsync(0);
                    await sound.playAsync();
                    generateWaveData();
                    intervalRef.current = setInterval(generateWaveData, 100);
                }
                setIsPlaying(!isPlaying);
            } else {
                let soundFilePath;
                if (defectiveness === 'fox') {
                    soundFilePath = require('../assets/sounds/fox/fox.mp3');
                } else if (defectiveness === 'wildboar') {
                    soundFilePath = require('../assets/sounds/fox/wild.mp3');
                } else if (defectiveness === 'leopard') {
                    soundFilePath = require('../assets/sounds/lepoad/Leopard.mp3');
                }
                const { sound } = await Audio.Sound.createAsync(soundFilePath);
                setSound(sound);
                await sound.playAsync();
                generateWaveData();
                intervalRef.current = setInterval(generateWaveData, 100);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Failed to play/pause the sound', error);
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

    const renderWave = () => {
        if (isPlaying) {
            const pathData = waveData.map((amplitude, index) => {
                const x = index * 3;
                const y = amplitude * 40;
                return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
            }).join(' ');

            return (
                <Svg height="100" width="100%">
                    <Path d={pathData} fill="none" stroke="black" strokeWidth="2" />
                </Svg>
            );
        } else {
            return null;
        }
    };

    const playButtonImage = isPlaying ? require('../assets/pause.png') : require('../assets/play.png');

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={{ uri: capturedImageUri }} />
            <Text style={styles.capText}>Please confirm that the footprint belongs to a {defectiveness} by listening to the animal sound.</Text>

            <TouchableOpacity onPress={toggleSound} style={styles.buttonContainer}>
                <Image source={playButtonImage} style={styles.playButtonImage} />
            </TouchableOpacity>

            <View style={[styles.soundWaveContainer, styles.soundWavePosition]}>
                {renderWave()}
            </View>
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
        fontSize: 18,
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
        top:'40%',
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
});

export default AnimalSound;
