import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Base_url } from "../common/baseUrl";

const ImageSuccessful = ({ route, navigation }) => {
  const { imageUri } = route.params;
  const [capturedImageUri, setCapturedImageUri] = useState(imageUri);
  const [isLoading, setIsLoading] = useState(false);

  const nextPredict = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", {
      uri: capturedImageUri,
      type: "image/jpeg",
      name: "image.jpg",
    });

    try {
      const response = await fetch(Base_url + "/mushroom", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === "success") {
          Alert.alert(
            "Success",
            `Defectiveness: ${data.defectiveness}\nEdibility: ${data.edibility}`,
            [
              {
                text: "OK",
                onPress: () => {
                  if (capturedImageUri !== imageUri) {
                    navigation.navigate("MushroomDesc", {
                      imageUri: capturedImageUri,
                      defectiveness: data.defectiveness,
                      edibility: data.edibility,
                    });
                  } else {
                    navigation.navigate("MushroomDesc", {
                      imageUri,
                      defectiveness: data.defectiveness,
                      edibility: data.edibility,
                    });
                  }
                },
              },
            ]
          );
        } else {
          // Handle unsuccessful response
          Alert.alert("Error", "Failed to process the image.");
        }
      } else {
        // Handle non-200 response
        Alert.alert(
          "Error",
          "The submitted image is not related to mushrooms."
        );
      }
    } catch (error) {
      // Handle network errors
      console.error("Error:", error);
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const capAgain = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to grant camera permission to use this feature."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setCapturedImageUri(result.assets[0].uri);
    } else {
      console.log("Image capture canceled");
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: capturedImageUri }} />
      {isLoading && <ActivityIndicator size="large" color="#3FFF9A" />}
      <Image style={styles.correct} source={require("../assets/success.png")} />
      <Text style={styles.capText}>Successfully captured Image</Text>
      <TouchableOpacity onPress={nextPredict} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={capAgain} style={styles.captureButton}>
        <Text style={styles.captureButtonText}>Capture Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  image: {
    width: 250,
    height: 300,
  },
  correct: {
    top: "4%",
  },
  capText: {
    top: "5%",
    fontSize: 20,
  },
  nextButton: {
    top: "10%",
    width: 200,
    height: 45,
    backgroundColor: "#5FFF9F",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "bold",
  },
  captureButton: {
    top: "13%",
    width: 200,
    height: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 20,
  },
  captureButtonText: {
    color: "#000",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "bold",
  },
});

export default ImageSuccessful;
