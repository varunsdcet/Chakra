import React, {useEffect,useState} from 'react';
import {Image, ImageBackground, StyleSheet, View,SafeAreaView,TouchableOpacity,Text,FlatList,Dimensions} from 'react-native';
import {StatusBarLight} from '../utils/CustomStatusBar';
import { AsyncStorageGetUser,AsyncStorageGettoken } from '../backend/Api';
import * as actions from '../redux/actions';
const window = Dimensions.get('window');
var randomString = require('random-string');
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import * as RNLocalize from "react-native-localize";
import LinearGradient from 'react-native-linear-gradient';
import store from '../redux/store';
import KeepAwake from 'react-native-keep-awake';
import {globalStyle, headerStyle} from '../styles/styles';
import {LoginOtpApi,EditPasseord,Changepassword,CheckWallet,RechargeWallet,WalletHist,FetchHomeWallet,PayableWallet,GetProduct,GetCart,EditCart,DeleteCart,RemoveCoupan,Checkout} from '../backend/Api';
const GLOBAL = require('./Global');
const Payment = ({navigation,route}) => {
  const [paymentState, setPaymentState] = useState(0);
const [loading, setLoading] = useState(false);
  const onRadioPress = (value) => {

if (value == 0){
getProduct('25',"online")
}else if (value == 1) {
  getProduct('25',"wallet")
}else{
    getProduct('25',"cod")
}



    setPaymentState(value);
  }
const radio_props = [
 {label: 'Online Payment', value: 0},
 {label: 'Wallet', value: 1},
 {label: 'COD', value: 2},
];

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

    var x = randomString({
length: 8,
numeric: true,
letters: true,
special: false,
exclude: ['a', 'b', '1']
});
    Checkout({payment_mode:"cod",txn_id:x})
      .then((data) => {

        if (data.status) {
navigation.navigate("EThankyou")
           //
        } else {
        //  alert(data)
        }
      })
      .catch((error) => {
        console.log('error', error);
      });
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

  }, []);

  return (
    <SafeAreaView style={{}}>
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
         <Text style={headerStyle.title}>Checkout</Text>

       </LinearGradient>

 <View style = {{backgroundColor:'white',marginLeft:-30}}>
     <RadioForm formHorizontal={false} animation={true}>
       {radio_props.map((obj, i) => (
         <RadioButton labelHorizontal={true} key={i}>
           <RadioButtonInput
             obj={obj}
             index={i}
             isSelected={paymentState === i}
             onPress={onRadioPress}
             borderWidth={1}
             buttonInnerColor={GLOBAL.tsecondcolor}
             buttonOuterColor={paymentState === i ? GLOBAL.tsecondcolor : GLOBAL.tsecondcolor}
             buttonSize={10}
             buttonOuterSize={20}
             buttonStyle={{}}
             buttonWrapStyle={styles.buttonWrapStyle}
           />
           <RadioButtonLabel
             obj={obj}
             index={i}
             labelHorizontal={true}
             onPress={onRadioPress}
             labelStyle={styles.labelStyle}
             labelWrapStyle={styles.labelWrapStyle}
           />
         </RadioButton>
       ))}
     </RadioForm>
     </View>




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

       </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonWrapStyle: {
    marginLeft: 40,
    marginTop: 25,
  },
  labelStyle: {
    fontSize: 16,
    color: GLOBAL.tsecondcolor,
    fontFamily: 'Avenir',
    fontWeight: '500',
  },
  labelWrapStyle: {
    marginTop: 25,
    marginLeft: 10,
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

export default Payment;

const BackImageSource=(type)=>{
  switch (type) {
    case 'neel':
    return require('../resources/whiteback.png')
        default:
    return require('../assets/icons/back.png')
    }
}
