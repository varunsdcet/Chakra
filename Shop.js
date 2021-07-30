import React, {useEffect,useState} from 'react';
import {Image, ImageBackground, StyleSheet, View,SafeAreaView,TouchableOpacity,Text,FlatList} from 'react-native';
import {StatusBarLight} from '../utils/CustomStatusBar';
import { AsyncStorageGetUser,AsyncStorageGettoken } from '../backend/Api';
import * as actions from '../redux/actions';
import LinearGradient from 'react-native-linear-gradient';
import store from '../redux/store';
import KeepAwake from 'react-native-keep-awake';
import {globalStyle, headerStyle} from '../styles/styles';
import {LoginOtpApi,EditPasseord,Changepassword,CheckWallet,RechargeWallet,WalletHist,FetchHomeWallet,PayableWallet,Category} from '../backend/Api';
const GLOBAL = require('./Global');
const Shop = ({navigation,route}) => {

  const [pujas,setPuja] =  useState([]);

  const renderItemTvs=({item}) => {
         console.log(JSON.stringify(item))
      return(
       <TouchableOpacity style = {{width:GLOBAL.apptype == "neel" ? "50%":"100%"}} onPress={() => navigation.navigate('Product',{
         item:item
       })}>
    <View>
    {GLOBAL.apptype == "neel" && (
      <View style = {{flexDirection:'row',width:'90%',margin:'5%',elevation:5,borderRadius:2,backgroundColor:'white',height:60}}>
      <Text style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',marginTop:16,textAlign:'center',width:'74%'}}>
        {item.name}

      </Text>

      <Image
              source={{uri:item.imageUrl}}
              style={{width:30,height:30,alignSelf:'center'}}
            />

      </View>
    )}
    {GLOBAL.apptype != "neel" && (
      <ImageBackground
      imageStyle={{ borderRadius: 6}}
              source={{uri:item.bgImageUrl}}
              style={{width:'97%',height:100,alignSelf:'center',margin:'1%',marginLeft:'5%',marginTop:5}}
            >

            <View style = {{flexDirection:'row',marginTop:15}}>
   <View style = {{width:'70%'}}>

   <Text style={{fontFamily:"Nunito-Bold",fontSize:16,color:'#263238',marginTop:12,textAlign:'left',marginLeft:12}}>
     {item.name}

   </Text>
   <Text style={{fontFamily:"Nunito-Regular",fontSize:16,color:'#263238',marginTop:2,textAlign:'left',marginLeft:12}}>
     Know More...

   </Text>
   </View>
   <Image
           source={{uri:item.imageUrl}}
           style={{width:60,height:60,resizeMode:'contain'}}
         />


            </View>

            </ImageBackground>
    )}

    </View>
    </TouchableOpacity>






  )
  }
  useEffect(() => {
    Category({phone:""})
           .then((data) => {
                // toggleLoading(false);
              // alert(JSON.stringify(data))
             if (data.status) {
setPuja(data.data)
    //            actions.Login(data.data);
    // actions.Token(data.token);
    // AsyncStorageSetUser(data.data);
    // AsyncStorageSettoken(data.token)


              // alert(JSON.stringify(data))
          //   navigation.navigate('Otp',{otp:+data.otp,status:true,mobile:+mobile})

             } else {
               alert(data.message)
            //   navigation.navigate('Otp',{otp:+data.otp,status:false,mobile:+mobile})
             }
           })
           .catch((error) => {
             //toggleLoading(false);
             console.log('error', error);
           });

  }, []);

  return (
    <SafeAreaView style={globalStyle.container_2}>
       <StatusBarLight />
       <LinearGradient
         style={headerStyle.view}
         colors={[GLOBAL.apptype =="neel"?GLOBAL.tfirstcolor:GLOBAL.bfirstcolor, GLOBAL.apptype=="neel"?GLOBAL.tsecondcolor:GLOBAL.bsecondcolor]}
         start={{x: 0, y: 0}}
         end={{x: 1, y: 0}}>
         <TouchableOpacity
           style={headerStyle.backTouch}
           onPress={navigation.goBack}>

           <Image
             source={BackImageSource(GLOBAL.apptype)}
             style={headerStyle.backImage}
           />
         </TouchableOpacity>
         <Text style={headerStyle.title}>Astro Shop</Text>

       </LinearGradient>
       <FlatList  style={{width:'100%',marginTop:3}}
 data={pujas}
numColumns={GLOBAL.apptype == "neel" ? 2:1}
 renderItem={renderItemTvs}
/>
       </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default Shop;

const BackImageSource=(type)=>{
  switch (type) {
    case 'neel':
    return require('../resources/whiteback.png')
        default:
    return require('../assets/icons/back.png')
    }
}
