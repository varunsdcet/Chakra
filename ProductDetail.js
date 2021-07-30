import React, {useEffect,useState} from 'react';
import {Image, ImageBackground, StyleSheet, View,SafeAreaView,TouchableOpacity,Text,FlatList,Dimensions,ScrollView} from 'react-native';
import {StatusBarLight} from '../utils/CustomStatusBar';
import { AsyncStorageGetUser,AsyncStorageGettoken } from '../backend/Api';
import * as actions from '../redux/actions';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import HTML from "react-native-render-html";
import Carousel from 'react-native-snap-carousel';
import store from '../redux/store';
const window = Dimensions.get('window');
import KeepAwake from 'react-native-keep-awake';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {globalStyle, headerStyle} from '../styles/styles';
import {LoginOtpApi,EditPasseord,Changepassword,CheckWallet,RechargeWallet,WalletHist,FetchHomeWallet,PayableWallet,GetProduct,GetProductDetail,Wishlist,AddCart} from '../backend/Api';
const GLOBAL = require('./Global');
const ProductDetail = ({navigation,route}) => {

  const [quantity, setquantity] = useState('');
    const [cart, setcart] = useState('');
      const [cartid, setcartid] = useState('');
    const [bookmark, setbookmark] = useState('');
  const [top_banners,setBanner] =  useState([]);
  const [product, setProduct] = useState({});



  const increase = (() =>{
    var gty =  parseInt(quantity) + 1
    if (gty <= parseInt(route.params.item.stock)){
      editcart(gty)
      setquantity(gty)
      // if (route.params.type == 0){
      //   editcart(gty)
      // }else{
      //   editcart(gty)
      //   //route.params.editcart(route.params.item,route.params.index)
      // }

}else{
alert('Coming soon')
}


  })

  const editcart = (gty) =>{

    var gty =  parseInt(quantity) + 1
    if (gty <= parseInt(route.params.item.stock)){
      EditCart({cart_id: cartid,qty:gty.toString()})
        .then((data) => {

          if (data.status) {
//alert(JSON.stringify(data))
             //
//          } else {
          //  alert(JSON.stringify(data))
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    }else{
      alert('Stock not Available')
    }

  }
  const editcarts = (gty) =>{

    var gty =  parseInt(quantity) - 1
  //  alert(route.params.item.cart_data.cart_id)
    if (gty <= parseInt(route.params.item.stock)){
      EditCart({cart_id: cartid,qty:gty.toString()})
        .then((data) => {


          if (data.status) {

detail()
          } else {
          //  alert(data)
          }
        })
        .catch((error) => {
          console.log('error', error);
        });
    }else{
      alert('Stock not Available')
    }

  }
  const decrease = (() =>{

    var gty =  parseInt(quantity) - 1

    if (gty <= parseInt(route.params.item.stock)){

        editcarts(gty)
        setquantity(gty)
        // if (route.params.type == 0){
        //   editcart(gty)
        // }else{
        //   editcart(gty)
        //   //route.params.editcart(route.params.item,route.params.index)
        // }

}else{
alert('Coming soon')
}

  })

  const topBannerView = () => (
      <FlatList
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        data={top_banners}
        style={{flexGrow: 0, marginVertical: 10}}
        renderItem={({item}) => (


            <Image source={{uri:item.image}} style={{width:window.width,height:200,resizeMode:'contain'}} />

        )}
        keyExtractor={(item) => item.id.toString()}
      />
    );

const bookmarks = (() =>{
var k = {product_id: route.params.item.id,user_id:store.getState().user.id}

Wishlist({product_id: route.params.item.id,user_id:store.getState().user.id})
  .then((data) => {
    if (data.status) {
setbookmark(bookmark == "0" ? "1" :"0")
    } else {
      alert(data.message)
    }
  })
  .catch((error) => {
    console.log('error', error);
  });

})

const loginButtonPress = (() =>{
//console.log(route.params.index)
// if (route.params.type == 0){
//   logincart()
// }else{
//    route.params.logincart(route.params.item,route.params.index)
//     // logincart()
//   navigation.navigate('Cart')
// }

})

const logincart  = (item,index ) => {
  if (product.cart){
    navigation.navigate("Cart")
    return
  }
console.log("function call",index)
//  alert(index)
AddCart({product_id: route.params.item.id})
  .then((data) => {
    console.log(JSON.stringify(data))
    //  alert(JSON.stringify(data))
    if (data.status) {
detail()

    } else {
      alert(data)
    }
  })
  .catch((error) => {
    console.log('error', error);
  });

}
const detail = () =>{
  GetProductDetail({product_id: route.params.item.id})
    .then((data) => {

      if (data.status) {
      //  alert(JSON.stringify(data))
        //setcount(data.count)
        setBanner(data.data.gallery)
        setProduct(data.data)
        //alert(data.data.is_favourite)
        setbookmark(data.data.is_favourite)
// setquantity(data.product.cart_data.qty)
// setcart(data.product.cart_data.is_cart)
// setbookmark(data.product.is_wishlist)
// setcartid(data.product.cart_data.cart_id)
//
//
// setProduct(data.product)

        // alert(JSON.stringify(data))
        // setSelectedId(!selectedId)
        //  setProduct(product)
         //
      } else {
        alert(data)
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
}

  useEffect(() => {
    const unsubscribe =   navigation.addListener('focus', () => {
               //  alert('dd')
              detail()
                  // The screen is focused
                  // Call any action
                });



  }, []);

  return (
    <SafeAreaView style={{flex:1,backgroundColor:GLOBAL.apptype == "neel" ? "white":"#FEF7F5"}}>
       <StatusBarLight />
       <View>
<ScrollView>
       <View>

       <View style = {{backgroundColor:"#F6F6F6"}}>
     <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:30,marginLeft:14}}>

     <TouchableOpacity
       style={headerStyle.backTouch}
       onPress={navigation.goBack}>
     <Image
       source={BackImageSource("neel1")}
       style={headerStyle.backImage}
     />
     </TouchableOpacity>
     <TouchableOpacity onPress={() => navigation.navigate('Cart')} >
     <Image
       source={ require('../resources/shopping-cart.png')}
       style={{width:30,height:30,marginRight:30}}
     />
     </TouchableOpacity>
     </View>
     {topBannerView()}




        </View>

        {bookmark == "0" && (
         <TouchableOpacity onPress={() => bookmarks()} >
        <Image
          source={ require('../resources/heart1.png')}
          style={{width:60,height:60,marginLeft:window.width -70,marginTop:-30}}
        />
        </TouchableOpacity>
      )}
      {bookmark == "1" && (
       <TouchableOpacity onPress={() => bookmarks()} >
      <Image
        source={ require('../resources/heart.png')}
        style={{width:60,height:60,marginLeft:window.width -70,marginTop:-30}}
      />
      </TouchableOpacity>
    )}

        <View style = {{backgroundColor:"white"}}>

        <View style = {{flexDirection:'row',justifyContent:'space-between'}}>

        <Text style={{fontFamily:"Nunito-Medium",fontSize:22,marginTop:3,width:'94%',margin:1,color:"#313131"}}>
          {product.name}

        </Text>

        </View>
        <View style = {{width:window.width - 20 ,alignSelf:'center'}}>
         <HTML source={{ html: product.description }}  />
         </View>

        <View style = {{height:20,width:window.width,backgroundColor:"#FEF7F5"}} />

<View style = {{elevation:5,backgroundColor:'white',width:window.width}}>

<Text style={{fontFamily:"Nunito-Regular",fontSize:19,marginTop:3,width:'94%',margin:1,color:"#263238"}}>
  Product Details

</Text>

<View style = {{height:1,backgroundColor:"#00000010",width:window.width,marginTop:3,marginBottom:3}}/>

<View style = {{width:window.width - 20 ,alignSelf:'center'}}>
 <HTML source={{ html: product.measurement_details }}  />

</View>

</View>
<View style = {{height:20,width:window.width,backgroundColor:"#FEF7F5"}} />
<View style = {{elevation:5,backgroundColor:'white',width:window.width}}>

<Text style={{fontFamily:"Nunito-Regular",fontSize:19,marginTop:3,width:'94%',margin:1,color:"#263238"}}>
  Delivery and Returns

</Text>

<View style = {{height:1,backgroundColor:"#00000010",width:window.width,marginTop:3,marginBottom:3}}/>

<View style = {{width:window.width - 20 ,alignSelf:'center'}}>
 <HTML source={{ html: product.other_description }}  />

</View>

</View>




        </View>
           </View>
<View style = {{height:100}}/>

           </ScrollView>
           <View style = {{position:'absolute',bottom:0,height:60,width:window.width,backgroundColor:'#FEE9DE'}}>

           <View style = {{flexDirection:'row',justifyContent:'space-between',alignSelf:'center',width:window.width - 40}}>

           <View style = {{width:150,height:40,borderWidth:1,borderRadius:12,marginTop:9}}>
           {product.discount == "0" && (
             <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:10,textAlign:'center',marginTop:7}}>
             {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${product.mrp}` : `$ ${(parseFloat(product.mrp)/GLOBAL.currency).toFixed(2)}`}

             </Text>
           )}
           {product.discount != "0" && (
             <View style = {{flexDirection:'row'}}>
             <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:10,textDecorationLine: 'line-through', textDecorationStyle: 'solid',textAlign:'center',marginTop:7}}>
             {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${product.mrp}` : `$ ${(parseFloat(product.mrp)/GLOBAL.currency).toFixed(2)}`}
               </Text>
             <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:10,marginTop:7}}>
             {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${product.selling_price}` : `$ ${(parseFloat(product.selling_price)/GLOBAL.currency).toFixed(2)}`}

             </Text>
             </View>
           )}

           </View>
  <TouchableOpacity onPress={() => logincart()} >
           <LinearGradient
             style={{height:40,width:140,borderRadius:18,marginTop:8}}
             colors={[GLOBAL.apptype =="neel"?GLOBAL.tfirstcolor:GLOBAL.bfirstcolor, GLOBAL.apptype=="neel"?GLOBAL.tsecondcolor:GLOBAL.bsecondcolor]}
             start={{x: 0, y: 0}}
             end={{x: 1, y: 0}}>

             <Text style={{fontFamily:"Nunito-Regular",fontSize:19,marginTop:3,color:"white",textAlign:'center'}}>
             {product.cart ? "Go to Cart" :"Add to Cart"} 

             </Text>
             </LinearGradient>
             </TouchableOpacity>

           </View>

           </View>
           </View>

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

export default ProductDetail;

const BackImageSource=(type)=>{
  switch (type) {
    case 'neel':
    return require('../resources/whiteback.png')
        default:
    return require('../assets/icons/back.png')
    }
}
