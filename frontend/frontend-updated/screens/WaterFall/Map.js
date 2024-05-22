import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import styles from './styles';

const Map = () => {
  const mapRef = useRef(null);

  const markers = [
    {
      coordinate: { latitude: 7.4374, longitude: 80.7593 },
      title: "Seven Falls",
      description: "9RWQ+8V3, Hunnasgiriya - Meemure Road"
    },
    {
      coordinate: { latitude: 7.4668, longitude: 80.8065 },
      title: "Sliding Rock",
      description: "CVP5+97W Heen Ganga, Meemure"
    },
    {
      coordinate: { latitude: 7.4685, longitude: 80.7966 },
      title: "Meemure Lakegala",
      description: "FR6V+274, Udadumbara"
    },
    {
      coordinate: { latitude: 7.4575, longitude: 80.8121 },
      title: "Meemure Fall",
      description: "CRVV+8CP, Meemure"
    }
  ];

  return (
    <View style={styles1.container}>
        <Text style={{ fontSize:22,marginLeft:20, color:'green',margin:10, fontWeight:'600'}}>Recommended bathing places in Meemure</Text>
      <GooglePlacesAutocomplete
        placeholder="Search"
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          const { lat, lng } = details.geometry.location;
          mapRef.current.animateToRegion({
            latitude: lat,
            longitude: lng,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }}
        query={{
          key: 'YOUR_GOOGLE_MAPS_API_KEY',
          language: 'en',
        }}
        styles={{
          container: {
            flex: 0,
            position: 'absolute',
            width: '80%',
            zIndex: 1,
            marginTop: '15%',
            alignSelf: 'center',
          },
          listView: {
            backgroundColor: 'white',
          }
        }}
      />
      <MapView
        ref={mapRef}
        style={{ Width: '90%', height: '100%'}}
        initialRegion={{
          latitude: 7.4713, // Latitude of Meemure
          longitude: 80.8122, // Longitude of Meemure
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  }
});

export default Map;
