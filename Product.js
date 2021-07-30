import React, {useEffect,useState} from 'react';
import {Image, ImageBackground, StyleSheet, View,SafeAreaView,TouchableOpacity,Text,FlatList} from 'react-native';
import {StatusBarLight} from '../utils/CustomStatusBar';
import { AsyncStorageGetUser,AsyncStorageGettoken } from '../backend/Api';
import * as actions from '../redux/actions';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import store from '../redux/store';
import KeepAwake from 'react-native-keep-awake';
import {globalStyle, headerStyle} from '../styles/styles';
import {LoginOtpApi,EditPasseord,Changepassword,CheckWallet,RechargeWallet,WalletHist,FetchHomeWallet,PayableWallet,GetProduct} from '../backend/Api';
const GLOBAL = require('./Global');
const Product = ({navigation,route}) => {

  const [pujas,setPuja] =  useState([]);

  const renderItemTvs=({item}) => {
         console.log(JSON.stringify(item))
      return(
        <TouchableOpacity style = {{width:GLOBAL.apptype == "neel" ? "100%":"50%"}} onPress={() => navigation.navigate('ProductDetail',{
          item:item
        })}>
    <View >
    {GLOBAL.apptype == "neel" && (
      <View style = {{width:'90%',margin:'5%',elevation:5,borderRadius:2,backgroundColor:'white'}}>
      <Image
              source={{uri:item.imageUrl}}
              style={{width:'100%',height:160,alignSelf:'center'}}
            />
      <Text style={{fontFamily:"Nunito-Bold",fontSize:16,color:'#DD2476',marginTop:16,width:'94%',margin:1}}>
        {item.name}

      </Text>
      <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'#69707F',margin:1,width:'94%',marginLeft:10}}>
      {item.description}

      </Text>

      {item.discount == "0" && (
        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,width:'94%',marginLeft:10}}>
        {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.mrp}` : `$ ${(parseFloat(item.mrp)/GLOBAL.currency).toFixed(2)}`}

        </Text>
      )}

      {item.discount != "0" && (
        <View style = {{flexDirection:'row'}}>
        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:10,textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>
        {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.mrp}` : `$ ${(parseFloat(item.mrp)/GLOBAL.currency).toFixed(2)}`}
          </Text>
        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:10}}>
        {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.selling_price}` : `$ ${(parseFloat(item.selling_price)/GLOBAL.currency).toFixed(2)}`}

        </Text>
        </View>
      )}



      </View>
    )}
    {GLOBAL.apptype != "neel" && (
      <View>
      <View style = {{width:'90%',margin:'5%',elevation:5,borderRadius:2,backgroundColor:'white'}}>

        {item.discount != "0" && (
          <View style = {{backgroundColor:'#FCB69F',height:24,borderRadius:5,width:70,marginTop:6,marginLeft:'46%'}}>
          <Text style={{fontFamily:"Nunito-Regular",fontSize:12,color:'white',marginTop:4,textAlign:'center',margin:1}}>
        {item.discount_type == "flat"  ? "Flat" :""}{RNLocalize.getTimeZone() == "Asia/Kolkata" ? item.discount : item.discount_type == "flat"  ?  (parseFloat(item.discount)/parseFloat(GLOBAL.currency)).toFixed(2):item.discount} {item.discount_type == "percentage" ? "%" :""} Off

          </Text>
          </View>

        )}
        {item.discount == "0" && (
          <View style = {{backgroundColor:'white',height:24,borderRadius:5,width:60,marginTop:6,marginLeft:'46%'}}>

          </View>

        )}
      <Image
              source={{uri:item.imageUrl}}
              style={{width:'70%',height:160,alignSelf:'center',resizeMode:'contain',marginTop:9}}
            />







      </View>
      <Text style={{fontFamily:"Nunito-Medium",fontSize:16,color:'#263238',marginTop:3,width:'94%',margin:1}}>
        {item.name}

      </Text>
      {item.discount == "0" && (
        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,width:'94%',marginLeft:10}}>
        {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.mrp}` : `$ ${(parseFloat(item.mrp)/GLOBAL.currency).toFixed(2)}`}

        </Text>
      )}

      {item.discount != "0" && (
        <View style = {{flexDirection:'row'}}>
        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:10,textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}>
        {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.mrp}` : `$ ${(parseFloat(item.mrp)/GLOBAL.currency).toFixed(2)}`}
          </Text>
        <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:10}}>
        {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.selling_price}` : `$ ${(parseFloat(item.selling_price)/GLOBAL.currency).toFixed(2)}`}

        </Text>
        </View>
      )}
      </View>
    )}

    </View>
    </TouchableOpacity>






  )
  }
  useEffect(() => {
    console.log(RNLocalize.getTimeZone())
  //  alert(JSON.stringify(route.params))
    GetProduct({category_id:route.params.item.id})
           .then((data) => {
                // toggleLoading(false);
               console.log(JSON.stringify(data))
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
    <SafeAreaView style={{flex:1,backgroundColor:GLOBAL.apptype == "neel" ? "white":"#FEF7F5"}}>
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
         <Text style={headerStyle.title}>{route.params.item.name}</Text>

       </LinearGradient>
       <FlatList  style={{width:'100%',marginTop:3}}
 data={pujas}
numColumns={GLOBAL.apptype == "neel" ? 1:2}
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

export default Product;

const BackImageSource=(type)=>{
  switch (type) {
    case 'neel':
    return require('../resources/whiteback.png')
        default:
    return require('../assets/icons/back.png')
    }
}
