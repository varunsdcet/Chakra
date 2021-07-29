import React, {Component} from 'react';
import {SafeAreaView, Text,ImageBackground,Image,View,TouchableOpacity,TextInput,Dimensions} from 'react-native';
import {globalStyle, headerStyle} from '../styles/styles';
import {LoginOtpApi,SignInApi,SocialLogin} from '../backend/Api';
const window = Dimensions.get('window');
import Toast from 'react-native-simple-toast';
const GLOBAL = require('./Global');
import Stars from 'react-native-stars';
import { LoginManager,LoginButton,AccessToken,GraphRequest,GraphRequestManager} from 'react-native-fbsdk';


import * as actions from '../redux/actions';

import { AsyncStorageSetUser,AsyncStorageSettoken,Addreview } from '../backend/Api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
export default class Rating extends Component {
    state = {
        selectedIndex: 0,
        speciality : [],
        visible:false,
        rating:'Excellent',
        value:5,
        password:'',
        reason:'',

    };

    componentDidMount(){
    console.log(JSON.stringify(GLOBAL.data))
  //  alert(this.props.route.params.item.id)
    //  params = this.props.navigation.state.params

    }

    loginButtonPress = () =>{

    }
_handlePress = () =>{
// var aid = ""
// var booking = ""
//   if (this.props.route.params.item.booking_type == "2"){
// aid = this.props.route.params.item.astrologer.id
// booking = this.props.route.params.item.id
//   }else{
//     aid = this.props.route.params.item.puja_id
//     booking = this.props.route.params.item.booking_id
//   }

  var e = {type: "2",type_id:GLOBAL.data.astrologer.id,booking_id:GLOBAL.data.id,rate:this.state.value,message:this.state.password}
//alert(JSON.stringify(e))

  Addreview(e)
    .then((data) => {
//d

      if (data.status) {
    alert('Thanks for Rating')

    this.props.navigation.reset({
                    index: 0,
                    routes: [{name: 'TabNavigator'}],
                  });
//navigation.navigate('AmbulanceBooking')
      } else {
        //  this.setState({visible:true})
        console.log(data);
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

star = (val) =>{
  this.setState({value:val})

  this.setState({stars: val})
  if (val == 1){
    this.setState({rating:'Poor'})
  }else if (val == 2){
    this.setState({rating:'Average'})
  }else if (val == 3){
    this.setState({rating:'Good'})
  }
  else if (val == 4){
    this.setState({rating:'Very Good'})
  }else if (val == 5){
    this.setState({rating:'Excellent'})
  }
}
//this.setState({stars: val})

    render(){
        return (
            <SafeAreaView style={{flex:1}}>


            <View
              style={headerStyle.view}
            >
              <TouchableOpacity
                style={headerStyle.backTouch}
                onPress={()=>this.props.navigation.goBack()}
                >
                <Image
                  source={require('../assets/icons/back.png')}
                  style={headerStyle.backImage}
                />
              </TouchableOpacity>

        <Text style={headerStyle.title}>Rating</Text>

            </View>

                <KeyboardAwareScrollView  keyboardShouldPersistTaps={'always'} style={{ backgroundColor: '#fcfcfe',marginTop:0 }} >

  <Text style={{fontFamily:'Nunito-Bold',fontSize:24,marginLeft:6,marginTop:8,textAlign:'center',color:'#1E2432'}}>
      Rate Your Experience

  </Text>
    <Text style={{fontFamily:'Nunito-Bold',fontSize:17,marginLeft:6,marginTop:8,textAlign:'center',color:'black'}}>
      Tell Us how was your experience

  </Text>

{typeof GLOBAL.data.astrologer != "undefined" && (
  <View>

  <Text style={{fontFamily:'Nunito-Bold',fontSize:15,marginLeft:6,marginTop:2,color:'black',textAlign:'center'}}>
      Thankyou for {GLOBAL.data.type == "3" ? "CHAT" : GLOBAL.data.type == "1" ? "VIDEO" : GLOBAL.data.type == "2"  ? "AUDIO" :""} Call Please give feedback

  </Text>

  <Image style = {{width:100,height:100,resizeMode:'contain',alignSelf:'center',borderRadius:50}}
  source = {{uri:GLOBAL.data.astrologer.imageUrl}}/>
  <Text style={{fontFamily:'Nunito-Bold',fontSize:15,marginLeft:6,marginTop:2,color:'black',textAlign:'center'}}>
      {GLOBAL.data.astrologer.name}

  </Text>
  </View>

)}

  <View style = {{backgroundColor:'#fcebbf',borderRadius:32,width:200,alignSelf:'center',height:50,marginTop:30}}>
  <Text style={{fontFamily:'Nunito-Bold',fontSize:21,marginLeft:6,marginTop:10,textAlign:'center',color:'#1E2432'}}>
   {this.state.rating}

</Text>



  </View>
  <View style={{alignItems:'center',marginTop:20}}>
    <Stars
      half={false}
      default={5}
      update={(val)=>{this.star(val)}}
      spacing={4}
      starSize={40}
      count={5}
      fullStar= {require('../resources/fillstar.png')}
      emptyStar= {require('../resources/emptystar.png')}
        halfStar= {require('../resources/star.png')}
    />
  </View>
  <Text style={{fontFamily:'Nunito-Bold',fontSize:15,marginLeft:6,marginTop:18,marginLeft:30,color:'black'}}>
      Write your feedback

  </Text>
  <TextInput
     style={{ height: 160, borderColor: '#bfc4d1', borderWidth: 2 ,width:window.width - 60,alignSelf:'center',marginTop:8,borderRadius:8}}
     onChangeText={(text) => this.setState({password:text})}
     textAlignVertical={'top'}
     multiline={true}
     value = {this.state.password}

   />




   <Text style = {{height:10}}>

   </Text>
   <TouchableOpacity

           onPress={() => this._handlePress()}
         >
   <View style = {{height:40,borderRadius:5,backgroundColor:'#FFD00D',width:window.width - 40,marginTop:40,alignSelf:'center'}}>
   <Text style  = {{fontFamily:'DMSans-Regular',fontSize:14,color:'black',alignSelf:'center',marginTop:10}}>
   Continue
   </Text>
   </View>
   </TouchableOpacity>


                </KeyboardAwareScrollView>
            </SafeAreaView>

        );
    }
}
