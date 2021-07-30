import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    StatusBar,
    View,
    Platform,
    SafeAreaView,
    StatusBarLight,
    TouchableOpacity,
    FlatList,
    Alert,
    TextInput,

    ImageBackground, Image, Dimensions,
} from 'react-native';
import * as RNLocalize from "react-native-localize";
const GLOBAL = require('./Global');
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import {GetCoupan,ApplyCoupan} from '../backend/Api';
import {globalStyle, headerStyle} from '../styles/styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from 'react-native-button';
const window = Dimensions.get('window');



const styles = StyleSheet.create({
    wrapper: {
    },
    AndroidSafeArea: {
        flex: 0,
        backgroundColor: '#08C25E',
        paddingTop: Platform.OS === "android" ? 0 : 0
    },
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    }
})

export default class Coupan extends Component {
    state = {
        selectedIndex: 0,
        userDetail:[],
        zip:'',
        landmark:'',
        address:'',
        FlatListItems:[],
        speciality : []

    };




    renderRowItem2 = (itemData) => {

        return (
    <TouchableOpacity onPress= {()=>this.selection(itemData.index)}>
            <View style={{backgroundColor:'white',color :'white', flex: 1 ,margin: 2,borderRadius :9,width : window.width - 30,flexDirection:'row',
              justifyContent:'space-between'}}>

                <View style = {{flexDirection:'row',width:'90%'}}>
                <Image   source={itemData.item.image}
                         style  = {{width:30, height:30,resizeMode:'stretch',margin:10
                         }}

                />
                <Text style={{fontFamily:'Nunito-SemiBold',fontSize:16,marginLeft:6,marginTop:14,color:'grey'}}>
                    {itemData.item.name}

                </Text>
                </View>

















            </View>
            </TouchableOpacity>

        )
    }

 _handleStateChange = (state) =>{

 }

    componentDidMount(){
      GetCoupan({subcategory_id:"6"})
        .then((data) => {
         console.log(JSON.stringify(data))

          if (data.status) {
this.setState({userDetail:data.data})
          } else {
            alert(data.message)
          }
        })
        .catch((error) => {
          console.log('error', error);
        });

    }


    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };




_handlePress = (item) =>{

  ApplyCoupan({coupon_id:item.id})
    .then((data) => {


      if (data.status) {
          //this.props.route.params.getProduct("1")
this.props.navigation.goBack()
      } else {
        alert(data.message)
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
  // const url = 'http://139.59.9.158/panel/api/customers/' +  'apply_coupan'
  //
  //                   fetch(url, {
  //                       method: 'POST',
  //                       headers: {
  //   'x-api-key':GLOBAL.header,
  //      'Content-Type': 'application/json',
  //                       },
  //                       body: JSON.stringify({
  //                           user_id:GLOBAL.user_id,
  //                           coupan_code:item.code
  //
  //
  //                       }),
  //                   }).then((response) => response.json())
  //                       .then((responseJson) => {
  //
  //
  //                           if (responseJson.status == true) {
  //                              alert('Applied Successfully')
  // this.props.navigation.goBack()
  //
  //                           }else {
  //                              alert(responseJson['message'])
  //                           }
  //                       })
  //                       .catch((error) => {
  //                           console.error(error);
  //                       });
}
renderItem=({item,index}) => {

return(

  <View style={{backgroundColor:'white',color :'white', flex: 1 ,margin: 3,borderRadius :9,width : window.width - 10, shadowColor: '#000',marginTop:8,
                borderBottomWidth:1,borderBottomColor:'grey' }}>
<View style = {{flexDirection:'row',justifyContent:'space-between'}}>
<Text style = {{color:'#DD2476',fontSize:22,margin:10}}>
{item.code}

</Text>

<Button
    style={{alignSelf:'center',paddingTop: 10 ,fontSize: 15,backgroundColor:'white',borderWidth:1,borderRadius:4,borderColor:'#DD2476', color: '#DD2476',fontFamily:'Nunito-SemiBold',marginTop:10,height:40,width:130,borderRadius:30}}
    styleDisabled={{color: 'red'}}
    onPress={() => this._handlePress(item)}>
    APPLY
</Button>

</View>

<Text style = {{color:'grey',fontSize:14,margin:10,marginTop:0}}>
{item.description}

</Text>
<Text style = {{color:'grey',fontSize:14,margin:10,marginTop:4}}>
Valid upto :  {item.expiry_date}

</Text>
{item.discount_type != "percentage" && (
  <Text style = {{color:'grey',fontSize:14,margin:10,marginTop:4}}>
  {RNLocalize.getTimeZone() == "Asia/Kolkata" ? ` Flat ₹ ${item.amount} Off` : `Flat $ ${(parseFloat(item.amount)/GLOBAL.currency).toFixed(2)} Off`}

  </Text>
)}
{item.discount_type == "percentage" && (
  <Text style = {{color:'grey',fontSize:14,margin:10,marginTop:4}}>
  {item.amount} % Off Max Discount ₹ {item.max_discount}

  </Text>
)}
</View>





 );
}


 BackImageSource=(type)=>{
  switch (type) {
    case 'neel':
    return require('../resources/whiteback.png')
        default:
    return require('../assets/icons/back.png')
    }
}
    render(){
        return (
          <SafeAreaView style={styles.AndroidSafeArea}>
             <StatusBar backgroundColor="#FF512F" barStyle="light-content" />

             <LinearGradient
               style={headerStyle.view}
               colors={[GLOBAL.apptype =="neel"?GLOBAL.tfirstcolor:GLOBAL.bfirstcolor, GLOBAL.apptype=="neel"?GLOBAL.tsecondcolor:GLOBAL.bsecondcolor]}
               start={{x: 0, y: 0}}
               end={{x: 1, y: 0}}>
               <TouchableOpacity
                 style={headerStyle.backTouch}
                 onPress={this.props.navigation.goBack}>

                 <Image
                   source={require('../resources/whiteback.png')}
                   style={headerStyle.backImage}
                 />
               </TouchableOpacity>

               <Text style={headerStyle.title}>Coupan</Text>

             </LinearGradient>

             <KeyboardAwareScrollView style={{ backgroundColor: 'white',marginTop:0,height:window.height - 70 }} >


             <FlatList style={{width:'100%',height:window.height - 70}}
        data={this.state.userDetail}

        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        />



             </KeyboardAwareScrollView>
         </SafeAreaView>

        );
    }
}
