import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Platform,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    FlatList,
    Alert,
    TextInput,

    ImageBackground, Image, Dimensions,
} from 'react-native';
const GLOBAL = require('./Global');
import {globalStyle, headerStyle} from '../styles/styles';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-community/async-storage';
import {GetAdress,DeleteAdress,DefaultAdress} from '../backend/Api';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from 'react-native-button';
const window = Dimensions.get('window');

// const GLOBAL = require('./Global');
// ;
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

export default class ManageAddress extends Component {
    state = {
        selectedIndex: 0,
        userDetail:[],
        zip:'',
        landmark:'',
        address:'',
        FlatListItems:[],
        speciality : [],
        loading:false,

    };

selection = (index) => {


  if (index == 4){
    this.props.navigation.navigate('ContactUs')
  }else if(index == 6){
      this.props.navigation.navigate('Refer')
  }
  else if(index == 9){

        this.navigateToScreen1('Login')
  }
}
showLoading() {
    this.setState({loading: true})
   }

    hideLoading() {
    this.setState({loading: false})
   }

    renderRowItem2 = (itemData) => {

        return (
    <TouchableOpacity activeOpacity = {0.9}onPress= {()=>this.selection(itemData.index)}>
            <View style={{backgroundColor:'white',color :'white', flex: 1 ,margin: 2,borderRadius :9,width : window.width - 30,flexDirection:'row',
              justifyContent:'space-between'}}>

                <View style = {{flexDirection:'row',width:'90%'}}>
                <Image   source={itemData.item.image}
                         style  = {{width:30, height:30,resizeMode:'stretch',margin:10
                         }}

                />
                <Text style={{fontFamily:'AvenirLTStd-Medium',fontSize:16,marginLeft:6,marginTop:14,color:'grey'}}>
                    {itemData.item.name}

                </Text>
                </View>

















            </View>
            </TouchableOpacity>

        )
    }

 _handleStateChange = (state) =>{
   alert('hi')


   // const url = GLOBAL.BASE_URL +  'get_address'
   //
   //                   fetch(url, {
   //                       method: 'POST',
   //                       headers: {
   //   'x-api-key':GLOBAL.header,
   //      'Content-Type': 'application/json',
   //                       },
   //                       body: JSON.stringify({
   //                           user_id:GLOBAL.user_id,
   //
   //
   //                       }),
   //                   }).then((response) => response.json())
   //                       .then((responseJson) => {
   //
   //
   //
   //
   //
   //
   //                           if (responseJson.status == true) {
   //                             this.setState({userDetail:responseJson.address})
   //
   //                           }else {
   //                               alert('Unable to get Connect You. Please try again after Sometime.')
   //                           }
   //                       })
   //                       .catch((error) => {
   //                           console.error(error);
   //                       });
 }

    componentDidMount(){
      const unsubscribe =   this.props.navigation.addListener('focus', () => {
        this.showLoading()
        GetAdress({name: "1"})
          .then((data) => {

            if (data.status) {
this.hideLoading()
            this.setState({userDetail:data.data})
         //   this.props.navigation.goBack()
            } else {
              this.hideLoading()
            //  alert(data)
            }
          })
          .catch((error) => {
            this.hideLoading()
            console.log('error', error);
          });

     });


    }


    handleIndexChange = index => {
        this.setState({
            ...this.state,
            selectedIndex: index
        });
    };



delete = (item,index) =>{


  DeleteAdress({id: item.id})
    .then((data) => {

      if (data.status) {
        var array = [...this.state.userDetail]; // make a separate copy of the array

      if (index !== -1) {
        array.splice(index, 1);
        this.setState({userDetail: array});
      }

                                  alert('Address Delete Successfully')
      } else {
        alert(data)
      }
    })
    .catch((error) => {
      console.log('error', error);
    });
}


default_address = (item) =>{
//DefaultAdress
DefaultAdress({id: item.id})
  .then((data) => {

    if (data.status) {
        //this.props.route.params.getProduct("1")
      this.props.navigation.goBack()

    } else {
      alert(data)
    }
  })
  .catch((error) => {
    console.log('error', error);
  });
}

renderItem=({item,index}) => {

return(
 <TouchableOpacity onPress={()=>this.default_address(item)}>
  <View style={{backgroundColor:'white',color :'white', flex: 1 ,margin: 10,borderRadius :9,width : window.width - 30, shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 5 }}>





         <Text style={{fontSize:17,fontFamily:'AvenirLTStd-Heavy',color:'#1E1F20',width:'80%',marginLeft:'5%',marginTop:15}}>{item.name}</Text>

         <Text style={{fontSize:13,fontFamily:'AvenirLTStd-Roman',color:'#46362B',width:'80%',marginLeft:'5%',marginTop:4,lineHeight:20}}>{item.flat} {item.location}</Text>


         <Text style={{fontSize:13,fontFamily:'AvenirLTStd-Heavy',color:'#46362B',width:'80%',marginLeft:'5%',marginTop:4,lineHeight:20}}>Mobile :{item.phone}</Text>



         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,marginLeft:'5%',width:'50%'}}>

           <TouchableOpacity onPress={()=>this.props.navigation.navigate('EditAddress',{item:item})}>
             <Text style={{fontSize:22,fontFamily:'AvenirLTStd-Medium',color:GLOBAL.tsecondcolor}}>Edit</Text>
           </TouchableOpacity>

                 <TouchableOpacity onPress={()=>this.delete(item,index)}>
             <Text style={{fontSize:22,fontFamily:'AvenirLTStd-Medium',color:GLOBAL.tsecondcolor}}>Delete</Text>
           </TouchableOpacity>
         </View>


       </View>
       </TouchableOpacity>


 );
}

    render(){

        return (
            <SafeAreaView style={styles.AndroidSafeArea}>
                <StatusBar backgroundColor={GLOBAL.tsecondcolor} barStyle="light-content" />

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

                  <Text style={headerStyle.title}>Add Address</Text>

                </LinearGradient>
                <KeyboardAwareScrollView style={{ backgroundColor: 'white',marginTop:0,height:window.height - 70 }} >

                <FlatList style={{width:'100%',height:window.height - 200}}
           data={this.state.userDetail}

           keyExtractor={this._keyExtractor}
           renderItem={this.renderItem}
           />
           <Button
               style={{marginLeft:28,paddingTop: 10 ,fontSize: 15,backgroundColor:GLOBAL.tsecondcolor, color: 'white',fontFamily:'KastelovAxiformaMedium',marginTop:30,height:45,width:window.width - 56,borderRadius:30}}
               styleDisabled={{color: 'red'}}
               onPress={() => this.props.navigation.navigate('Add')}>
               Add New Address
           </Button>

                </KeyboardAwareScrollView>
            </SafeAreaView>

        );
    }
}
