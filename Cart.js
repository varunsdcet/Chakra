import React, {useEffect,useState} from 'react';
import {Image, ImageBackground, StyleSheet, View,SafeAreaView,TouchableOpacity,Text,FlatList,Dimensions} from 'react-native';
import {StatusBarLight} from '../utils/CustomStatusBar';
import { AsyncStorageGetUser,AsyncStorageGettoken } from '../backend/Api';
import * as actions from '../redux/actions';
const window = Dimensions.get('window');
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import store from '../redux/store';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import KeepAwake from 'react-native-keep-awake';
import {globalStyle, headerStyle} from '../styles/styles';
import {LoginOtpApi,EditPasseord,Changepassword,CheckWallet,RechargeWallet,WalletHist,FetchHomeWallet,PayableWallet,GetProduct,GetCart,EditCart,DeleteCart,RemoveCoupan} from '../backend/Api';
const GLOBAL = require('./Global');
const Cart = ({navigation,route}) => {

  const [pujas,setPuja] =  useState([]);
  const [coupan, setSCoupan] = useState('');
 const [coupanid, setSCoupanid] = useState('');
 const [adress,setAdress] = useState({})
 const [subtotal, setSubtotal] = useState('');
 const [discount, setDiscount] = useState('');
 const [delivery, setDelivery] = useState('');
 const [payable, setpayable] = useState('');


  const editcart = (item,index) =>{


    var gty =  parseInt(item.items) + 1

      EditCart({id: item.id,items:gty.toString()})
        .then((data) => {

          if (data.status) {
          //    var getcart = pujas[index]
          //    getcart.product = data.product
          //    pujas[index] = getcart
          //    //console.log('edit ',getcart.cart_data.qty)
          //   // alert(JSON.stringify(product))
          // //  setSelectedId(!selectedId)
          //    setPuja(pujas)
             getProduct()
             //
          } else {
          //  alert(data)
          }
        })
        .catch((error) => {
          console.log('error', error);
        });


  }


  const deleteq = (item,index) =>{




      DeleteCart({id: item.id})
        .then((data) => {

          if (data.status) {

          //    var getcart = pujas[index]
          //    getcart.product = data.product
          //    pujas[index] = getcart
          //    //console.log('edit ',getcart.cart_data.qty)
          //   // alert(JSON.stringify(product))
          // //  setSelectedId(!selectedId)
          //    setPuja(pujas)
             getProduct()
             //
          } else {
          //  alert(data)
          }
        })
        .catch((error) => {
          console.log('error', error);
        });


  }

  const pays = () =>{
  if (adress.length == 0){
    alert('Please add Adress')
    return
  }
  navigation.navigate('Payment')
}

  const editcarts = (item,index) =>{


    var gty =  parseInt(item.items) - 1

      EditCart({id: item.id,items:gty.toString()})
        .then((data) => {

          if (data.status) {
          //    var getcart = pujas[index]
          //    getcart.product = data.product
          //    pujas[index] = getcart
          //    //console.log('edit ',getcart.cart_data.qty)
          //   // alert(JSON.stringify(product))
          // //  setSelectedId(!selectedId)
          //    setPuja(pujas)
             getProduct()
             //
          } else {
          //  alert(data)
          }
        })
        .catch((error) => {
          console.log('error', error);
        });


  }

  const renderItemTvs=({item,index}) => {
         console.log(JSON.stringify(item))
         var items  = item
         var item = item.product
      return(
    <View style = {{elevation:5,backgroundColor:'white',margin:12,borderRadius:8}}>
      <View style ={{flexDirection:'row'}}>

 <Image style={{width:80,height:80,borderRadius:12,margin:10}} source={{ uri: item.imageUrl }} />

 <View>

 <Text style = {{color:'#000521',fontSize:16,fontFamily:'Nunito-Medium',marginTop:7,width:window.width -170}}>
              {item.name}

              </Text>

              <View style = {{flexDirection:'row',justifyContent:'space-between'}}>
              {item.discount == "0" && (
                <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:GLOBAL.apptype == "neel"?GLOBAL.tsecondcolor:GLOBAL.bfirstcolor,margin:1,marginLeft:1,textAlign:'center',marginTop:7}}>
                {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.mrp}` : `$ ${(parseFloat(item.mrp)/GLOBAL.currency).toFixed(2)}`}

                </Text>
              )}
              {item.discount != "0" && (
                <View style = {{flexDirection:'row'}}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:'black',margin:1,marginLeft:1,textDecorationLine: 'line-through', textDecorationStyle: 'solid',textAlign:'center',marginTop:7}}>
                {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.mrp}` : `$ ${(parseFloat(item.mrp)/GLOBAL.currency).toFixed(2)}`}
                  </Text>
                <Text numberOfLines={2} ellipsizeMode='tail' style={{fontFamily:"Nunito-Bold",fontSize:16,color:GLOBAL.apptype == "neel"?GLOBAL.tsecondcolor:GLOBAL.bfirstcolor,margin:1,marginLeft:4,marginTop:7}}>
                {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${item.selling_price}` : `$ ${(parseFloat(item.selling_price)/GLOBAL.currency).toFixed(2)}`}

                </Text>
                </View>
              )}


              <View style = {{flexDirection:'row' ,backgroundColor:GLOBAL.tfirstcolor,width:70,borderRadius:4,justifyContent:'space-between'}}>
              <TouchableOpacity onPress={() => editcarts(item,index)} >
                                  <Text style = {{color:'white',fontSize:18,fontFamily:'Nunito-SemiBold',marginTop:3,marginLeft:10}}>
                                    -

                                  </Text>
                                  </TouchableOpacity>
                                  <Text style = {{color:'white',fontSize:14,fontFamily:'Nunito-SemiBold',marginTop:6,textAlign:'center'}}>
                                    {items.items}

                                  </Text>
                                     <TouchableOpacity onPress={() => editcart(items,index)} >
                                  <Text style = {{color:'white',fontSize:18,fontFamily:'Nunito-SemiBold',marginTop:3,marginRight:10}}>
                                    +

                                  </Text>
                                  </TouchableOpacity>

              </View>


              </View>

 </View>

      </View>
  <TouchableOpacity style  = {{position:'absolute',top:4,right:10}} onPress={() => deleteq(items,index)} >
      <View >

    <Image style={{width:30,height:30,resizeMode:'contain'}}   source={require('../resources/delete.png')}/>
      </View>

      </TouchableOpacity>





  </View>



  )
  }

const getProduct = () =>{
  GetCart({category_id:""})
         .then((data) => {
              // toggleLoading(false);
          //   alert(data.coupon_code)
           if (data.status) {
setPuja(data.data)
setSCoupan(data.coupon_code)
 setSCoupanid(data.coupon_id)
 setSubtotal(data.subtotal)
setDiscount(data.coupon_discount)
setDelivery(data.delivery_charges)
setpayable(data.total)
setAdress(data.selected_address ? data.selected_address : '')

// setAdress(data.default_address)


           } else {
             alert(data.message)
          //   navigation.navigate('Otp',{otp:+data.otp,status:false,mobile:+mobile})
           }
         })
         .catch((error) => {
           //toggleLoading(false);
           console.log('error', error);
         });
}

const coupans = () =>{

  if (coupan == ""){
    navigation.navigate('Coupan')
  }else{
    RemoveCoupan({subcategory_id: "1"})
      .then((data) => {
        console.log(JSON.stringify(data))

        if (data.status) {
          setSCoupan('')
          getProduct()


        } else {
          alert(data.message)
        }
      })
      .catch((error) => {
        console.log('error', error);
      });

}
}

  useEffect(() => {
    console.log(RNLocalize.getTimeZone())
  //  alert(JSON.stringify(route.params))
  getProduct()
  const unsubscribe =   navigation.addListener('focus', () => {
             //  alert('dd')
            getProduct()
                // The screen is focused
                // Call any action
              });

  }, []);

  return (
    <SafeAreaView style={{}}>
       <StatusBarLight />
        <KeyboardAwareScrollView>
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
         <Text style={headerStyle.title}>Cart</Text>

       </LinearGradient>

       <FlatList  style={{width:'100%',marginTop:3,height:'auto'}}
 data={pujas}
numColumns={GLOBAL.apptype == "neel" ? 1:2}
 renderItem={renderItemTvs}
/>
<TouchableOpacity onPress={() => coupans()} >
                                      <View style = {{marginTop:10,width:'100%',backgroundColor:'white',elevation:5,marginBottom:6}}>

                                      <Text style = {{color:'#8D92A3',fontSize:14,fontFamily:'Nunito-SemiBold',margin:7}}>
                                PROMO CODE

                                      </Text>
                                      {coupan == "" && (
                                        <Text style = {{color:'#000521',fontSize:14,fontFamily:'Nunito-SemiBold',margin:7}}>
                                NO PROMO CODE

                                        </Text>
                                      )}

                                      {coupan != "" && (
                                        <View>
                                        <View style = {{flexDirection:'row'}}>

                                        <Text style = {{color:'#000521',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                         {coupan}

                                        </Text>


                                        </View>
                                        <Text style = {{color:'red',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                         Remove

                                        </Text>
                                        </View>
                                      )}

                                      </View>
                                      </TouchableOpacity>


                                      <View style = {{marginTop:10,width:'100%',backgroundColor:'white',elevation:5,marginBottom:6}}>

                                    <Text style = {{color:'#8D92A3',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                              PAYMENT DETAILS

                                    </Text>
                                  <View style = {{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                                  <Text style = {{color:'#000521',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                MRP Total

                                  </Text>
                                  <Text style = {{color:'#000521',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                              {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${subtotal}` : `$ ${(parseFloat(subtotal)/GLOBAL.currency).toFixed(2)}`}

                                  </Text>

                                  </View>

                                  <View style = {{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                                  <Text style = {{color:'#000521',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                Delivery Charges

                                  </Text>
                                  <Text style = {{color:'#000521',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${delivery}` : `$ ${(parseFloat(delivery)/GLOBAL.currency).toFixed(2)}`}

                                  </Text>

                                  </View>
                                  <View style = {{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>
                                  <Text style = {{color:'#000521',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                Additional Discount

                                  </Text>
                                  <Text style = {{color:'#000521',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${discount}` : `$ ${(parseFloat(discount)/GLOBAL.currency).toFixed(2)}`}

                                  </Text>

                                  </View>
                                  <View style = {{flexDirection:'row',justifyContent:'space-between',width:'100%'}}>


                                  <Text style = {{color:'#1E1F20',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                                Total Amount

                                  </Text>
                                  <Text style = {{color:'#1E1F20',fontSize:17,fontFamily:'Nunito-SemiBold',margin:7}}>
                            {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${payable}` : `$ ${(parseFloat(payable)/GLOBAL.currency).toFixed(2)}`}

                                  </Text>

                                  </View>

                                  </View>

                                  {adress.length != 0 && (
                                       <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:0,width:'100%',backgroundColor:'#DD247640',marginBottom:5}}>
       <View style = {{flexDirection:'row'}}>


                                       <View>

                                       <Text style = {{color:'#000000',fontSize:17,fontFamily:'AvenirLTStd-Heavy',margin:7,marginTop:12}}>
                                       Deliver to: {adress.name}

                                       </Text>
                                       <Text style = {{color:'#747A8D',fontSize:12,fontFamily:'AvenirLTStd-Heavy',margin:7,marginTop:1,width:300}}>
                                  {adress.flat}  {adress.location}

                                       </Text>
                                       <TouchableOpacity style = {{width:100,height:39,marginTop:5,borderRadius:12,backgroundColor:GLOBAL.tfirstcolor,marginRight:12}}onPress={() => navigation.navigate('ManageAddress',{
                                         getProduct
                                       }
                                     )} >
                                                                                          <View>
                                                                                          <Text style = {{color:'white',textAlign:'center',marginTop:6}}>
                                                                                          CHANGE
                                                                                          </Text>
                                                                                          </View>
                                                                                          </TouchableOpacity>

                                       </View>

                                       </View>


                                       </View>
                                     )}

                                     {adress.length == 0 && (
                                       <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:0,width:'100%',backgroundColor:'#DD247640',marginBottom:5}}>
       <View style = {{flexDirection:'row'}}>


                                       <View>

                                       <Text style = {{color:'#000000',fontSize:17,fontFamily:'AvenirLTStd-Heavy',margin:7,marginTop:12}}>
                                       No Address Found

                                       </Text>

                                       <TouchableOpacity style = {{width:100,height:37,marginTop:5,borderRadius:12,backgroundColor:'#DD2476',marginRight:12}}onPress={() => navigation.navigate('Add')} >
                                                                                          <View>
                                                                                          <Text style = {{color:'white',textAlign:'center',fontFamily:"Nunito-Bold",marginTop:8}}>
                                                                                          ADD
                                                                                          </Text>
                                                                                          </View>
                                                                                          </TouchableOpacity>

                                       </View>

                                       </View>


                                       </View>
                                     )}
                                     <View style = {{flexDirection:'row',justifyContent:'space-between',marginTop:0,width:'100%',backgroundColor:'white',marginBottom:0,height:50,borderWidth:1,borderColor:GLOBAL.tsecondcolor}}>
                                    <Text style = {{color:'#0C0423',fontSize:17,fontFamily:'AvenirLTStd-Heavy',margin:7,marginTop:12}}>
                                  TOTAL {RNLocalize.getTimeZone() == "Asia/Kolkata" ? `₹ ${payable}` : `$ ${(parseFloat(payable)/GLOBAL.currency).toFixed(2)}`}

                                    </Text>
                                    <TouchableOpacity style = {{width:100,height:39,marginTop:5,borderRadius:12,backgroundColor:GLOBAL.tsecondcolor,marginRight:12}}onPress={() => pays()} >
                                                                                       <View>
                                                                                       <Text style = {{color:'white',textAlign:'center',marginTop:8}}>
                                                                                       SUBMIT
                                                                                       </Text>
                                                                                       </View>
                                                                                       </TouchableOpacity>
    </View>
 </KeyboardAwareScrollView>
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

export default Cart;

const BackImageSource=(type)=>{
  switch (type) {
    case 'neel':
    return require('../resources/whiteback.png')
        default:
    return require('../assets/icons/back.png')
    }
}
