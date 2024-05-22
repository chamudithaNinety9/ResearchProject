import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableNativeFeedback, TouchableOpacity, Modal, TextInput, ScrollView, ToastAndroid, ActivityIndicator } from 'react-native'; // Added ActivityIndicator
import { modalStyles } from '../css/modalStyles';
import { getAuth, updateProfile as updateAuthProfile, updateEmail as updateAuthEmail } from 'firebase/auth';
import { getDownloadURL, ref, getStorage, uploadBytes } from 'firebase/storage';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { app, db } from './firebase';
import 'firebase/database';
import { Calendar } from 'react-native-calendars';
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";

const MyProfile = ({ navigation }) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState(null);
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [emails, setEmail] = useState(null);
    const [contact, setContact] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [updatingProfile, setUpdatingProfile] = useState(false);

    useEffect(() => {
        fetchUserData();
    }, []);

    const openModal = () => {
        setModalVisible(true);
        fetchUserData();
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const home = () => {
        navigation.navigate('Home');
        closeModal();
    };

    const Profile = () => {
        closeModal();
    };

    const OpenGuid = () => {
        navigation.navigate('Guidance');
        closeModal();
    };

    const OpenCalender = () => {
        openCalModal();
        closeModal();
    };

    const openCalModal = () => {
        setCalendarVisible(true);
    };

    const closeCalModal = () => {
        setCalendarVisible(false);
    };

    const handleImageUpload = async () => {
        if (Constants.platform.android) {
            const { status } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Sorry, we need media library permissions to make this work!");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                setImageUri(result.assets[0].uri);
                setProfileImageUrl(result.assets[0].uri);
            } else {
                console.log("Image selection canceled");
            }
        }
    };

    const fetchUserData = async () => {
        const user = getAuth().currentUser;

        if (user) {
            setUsername(user.displayName);
            setEmail(user.email);

            const storage = getStorage(app);
            const storageRef = ref(storage, `user_images/${user.uid}.jpeg`);

            getDownloadURL(storageRef)
                .then((url) => {
                    setProfileImageUrl(url);
                })
                .catch(() => {
                    const value = 'Not available profile picture.';
                    ToastAndroid.showWithGravityAndOffset(
                        value,
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                });
            setUserData(user);

            const userRef = doc(db, "users", user.uid);

            try {
                const docSnapshot = await getDoc(userRef);

                if (docSnapshot.exists()) {
                    setContact(docSnapshot.data().contactNumber);
                } else {
                    console.log("Username not found in Firestore for the user.");
                }
            } catch (error) {
                console.error("Error fetching user document:", error);
            }
        }
    };

    const updateProfile = async () => {
        setUpdatingProfile(true); 

        const user = getAuth().currentUser;
        if (!username || !emails || !contact) {
            const value = 'Please fill out all required fields.';
            ToastAndroid.showWithGravityAndOffset(
                value,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );
            setUpdatingProfile(false);
            return;
        }

        if (user) {
            const userRef = doc(db, "users", user.uid);

            try {
                await updateAuthProfile(user, { displayName: username });
                console.log("Firebase Authentication display name updated successfully!");
                await updateAuthEmail(user, emails);
                console.log("Email updated successfully. Verification email sent.");


                await setDoc(userRef, {
                    email: emails,
                    contactNumber: contact,
                }, { merge: true });

                console.log("Profile updated successfully!");
                const value = 'Profile updated successfully!';
                ToastAndroid.showWithGravityAndOffset(
                    value,
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );

                const dataToUpdate = {};

                if (imageUri) {
                    const storage = getStorage(app);
                    const storageRef = ref(storage, `user_images/${user.uid}.jpeg`);

                    const response = await fetch(imageUri);
                    const blob = await response.blob();
                    await uploadBytes(storageRef, blob);

                    const imageUrl = await getDownloadURL(storageRef);
                    dataToUpdate.profileImageUrl = imageUrl;
                }

            } catch (error) {
                console.error("Error updating email:", error);
                if (error.code === 'auth/email-already-in-use'){
                    const value = 'This Email already registered!';
                    ToastAndroid.showWithGravityAndOffset(
                        value,
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }else{
                    const value = 'Update failed!';
                    ToastAndroid.showWithGravityAndOffset(
                        value,
                        ToastAndroid.SHORT,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
            }
        }

        setUpdatingProfile(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.topic}>My Profile</Text>
            <View style={styles.greenBox} />

            <View style={styles.rectangle42} />
            <TouchableNativeFeedback onPress={openModal}>
                <Image
                    style={styles.rectangle43}
                    source={require('../assets/tripleLine.png')}
                />
            </TouchableNativeFeedback>
            <Text style={styles.name}>{username}</Text>
            <Image source={{ uri: profileImageUrl }} style={styles.proImage} />
            <View style={styles.whiteRing} />
            <TouchableOpacity onPress={handleImageUpload}>
                <Image
                    source={require("../assets/camVector.png")}
                    style={styles.camera}
                />
            </TouchableOpacity>

            <Text style={styles.uname}>Name</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    onChangeText={(text) => setUsername(text)}
                    value={username}
                />
            </View>
            <Text style={styles.email}>Email</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    onChangeText={(text) => setEmail(text)}
                    value={emails}
                />
            </View>
            <Text style={styles.email}>Phone Number</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Contact"
                    onChangeText={(Number) => setContact(Number)}
                    value={contact}
                    keyboardType="number-pad"
                />
            </View>

            <TouchableOpacity
                style={styles.updateButton}
                onPress={updateProfile}
            >
                <Text style={styles.updateButtonText}>Update Profile</Text>
            </TouchableOpacity>
            {updatingProfile && (
                <View style={styles.progressContainer}>
                    <ActivityIndicator size="large" color="#00D972" />
                    <Text style={styles.progressText}>Updating Profile...</Text>
                </View>
            )}

            <Modal visible={isCalendarVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <TouchableNativeFeedback onPress={closeCalModal}>
                        <Image
                            source={require('../assets/close.png')}
                            style={{ width: 24, height: 24, left: '30%' }}
                        />
                    </TouchableNativeFeedback>
                    <Calendar />
                </View>
            </Modal>

            {isModalVisible && (
                <View style={modalStyles.modal}>
                    <View style={modalStyles.profileContainer}>
                        {profileImageUrl ? (
                            <Image source={{ uri: profileImageUrl }} style={styles.profileImage} />
                        ) : (
                            <Image source={require('../assets/users.png')} style={styles.image} />
                        )}
                        <Text style={modalStyles.profileName}>{userData.displayName}</Text>

                    </View>
                    <TouchableOpacity style={modalStyles.home} onPress={home}>
                        <Image
                            source={require('../assets/homes.png')}
                            style={modalStyles.homes}
                        />
                        <Text style={modalStyles.homeText}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={modalStyles.profile} onPress={Profile}>
                        <Image
                            source={require('../assets/profiles.png')}
                            style={styles.homes}
                        />
                        <Text style={modalStyles.homeText}>My Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={modalStyles.setting} onPress={OpenCalender}>
                        <Image
                            source={require('../assets/calendar.png')}
                            style={styles.homes}
                        />
                        <Text style={modalStyles.homeText}>Calendar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.guidance} onPress={OpenGuid}>
                        <Image
                            source={require('../assets/guidance.png')}
                            style={styles.homes}
                        />
                        <Text style={styles.homeText}>Tent Setup Guidance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.guidance} onPress={closeModal}>
                        <Image
                            source={require('../assets/closeB.png')}
                            style={{ width: 24, height: 24, left: '195%', top: '-1570%' }}
                        />
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 430,
        height: 932,
        backgroundColor: '#FFFFFF',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 25,
        left: '30%',
        top: '10%',
    },
    rectangle43: {
        width: 20,
        height: 15,
        left: '3%',
        top: '3%',
    },
    rectangle42: {
        position: 'absolute',
        width: 430,
        height: 40,
        left: 0,
        top: 50,
        backgroundColor: '#5FFF9F',
    },
    greenBox: {
        position: 'absolute',
        width: 430,
        height: 150,
        top: '15%',
        backgroundColor: 'rgba(95, 255, 159, 0.5)',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        top: 10,
    },
    proImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 6,
        borderColor: '#ffff',
        top: '12%',
        left: '12%'
    },
    whiteRing: {
        borderWidth: 6,
        borderColor: '#5FFF9F',
        borderRadius: 64,
        justifyContent: 'center',
        alignItems: 'center',
        width: 128,
        height: 128,
        left: '11.1%',
        bottom: '1.3%'
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        top: 10,
    },
    homes: {
        position: 'absolute',
        left: 10,
        top: 0,
        width: 24,
        height: 24,
    },
    profile: {
        top: 25,
        width: 120,
        left: '5%',
        justifyContent: 'center',
    },
    guidance: {
        top: 60,
        width: 120,
        left: '5%',
        justifyContent: 'center',
    },
    homeText: {
        fontWeight: 'bold',
        fontSize: 20,
        left: '40%',
        textAlign: 'left'
    },
    setting: {
        top: 45,
        width: 120,
        left: '5%',
        justifyContent: 'center',
    },
    name: {
        top: '20%',
        left: '45%',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.5)'
    },
    uname: {
        left: '10%',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.5)'
    },
    email: {
        left: '10%',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.5)'
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        marginBottom: 20,
        width: '75%',
        top: '0%',
        left: '10%'
    },
    input: {
        height: 40,
        paddingHorizontal: 10,
        width: '100%',
    },
    camera: {
        top: '-600%',
        left: '33%',
    },
    updateButton: {
        left: '25%',
        backgroundColor: "#00D972",
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: "center",
        marginVertical: 20,
        width: '40%',
    },
    updateButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    progressContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    progressText: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFF',
    },
});

export default MyProfile;
