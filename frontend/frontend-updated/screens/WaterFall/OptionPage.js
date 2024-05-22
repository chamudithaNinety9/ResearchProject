import React from 'react';
import { View,Text,TouchableOpacity, Image } from 'react-native';
import styles from './styles';

const OptionPage = ({navigation}) => {
    
  return (
    <View style={styles.screen}>
        <Text style={styles.titleTxt}>Select Water Source Find Mode</Text>
        <Image source={require('../../assets/waterfall1.png')} style={{width:300,height:200}} resizeMode='contain'/>
        <TouchableOpacity onPress={()=>navigation.navigate('Water')} style={[styles.Btn,{marginTop:'10%'}]}>
            <View style={[styles.BtnLeft,{backgroundColor:'#ff000080'}]}>
                <Image source={require('../../assets/offline.png')} style={{width:70,height:70}} resizeMode='contain'/>
            </View>
            <Text style={[styles.btnText,{color:'#ff000080'}]}>Offline</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('Map')} style={styles.Btn}>
            <View style={styles.BtnLeft}>
            <Image source={require('../../assets/online.png')} style={{width:70,height:70}} resizeMode='contain'/>
            </View>
            <Text style={styles.btnText}>Online</Text>
        </TouchableOpacity>

    </View>
  )
}

export default OptionPage;
