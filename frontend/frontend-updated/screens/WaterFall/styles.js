import { StyleSheet} from "react-native";

const styles = StyleSheet.create({
screen:{
    flex:1,
    alignItems:'center',
},
titleTxt:{
    fontSize:30,
    fontWeight:'bold',
    marginVertical:'5%',
    color:'green'
},
Btn:{
    width:'80%',
    height:'20%',
    backgroundColor:'#ffffff',
    padding:'3%',
    borderRadius:5,
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
},
btnText:{
    color:'limegreen',
    fontSize:30,
    marginRight:'20%'
},
BtnLeft:{
    width:'40%',
    height:'94%',
    backgroundColor:'limegreen',
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center'
}


});
export default styles;