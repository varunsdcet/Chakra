import React, {Component} from 'react';
import { StyleSheet, Text, View, Button,SafeAreaView,StatusBarLight,Dimensions,Image,Animated,TouchableOpacity,Alert,ImageBackground } from 'react-native';
import Backend from "./Backend.js";
import { GiftedChat,Time,Send,InputToolbar } from "react-native-gifted-chat";
import ImagePicker from 'react-native-image-picker';
import Bubble from "react-native-gifted-chat/lib/Bubble";
import {LoginOtpApi,SignInApi,Explore,FetchHomeWallet,PujaStart,GetProfileApi,EndLive,Recently} from '../backend/Api';
import { EventRegister } from 'react-native-event-listeners';
import CountDown from 'react-native-countdown-component';
import store from '../redux/store';
import io from 'socket.io-client';
import {globalStyle, headerStyle} from '../styles/styles';
const socket = io('http://139.59.25.187:3355', {
  transports: ['websocket']
})
var randomString = require('random-string');
const GLOBAL = require('./Global');
const window = Dimensions.get('window');
type Props = {};
const options = {
    title: 'Select Document',
    maxWidth:300,
    maxHeight:500,

    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};
export default class LiveChat extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Chat Consulation',
      animations: {
        setRoot: {
          waitForRender: false,
        },
      },
    };
  };

  constructor(props) {
    super(props);

    this.state = {
        modalVisible: false,
        recognized: '',
        started: '',
        text :'',
        mystatus:false,
        results: [],
        messages: [],
        texts:'',

    };
  }

  // renderBubble(props) {
  //
  //     return (
  //         <View>
  //             <Text style={{color:'black'}}>{props.currentMessage.user.name}</Text>
  //         </View>
  //     );
  // }


  endcall = () =>{
  var k = {booking_id:GLOBAL.ids}

    EndLive({booking_id:GLOBAL.ids})
         .then((data) => {

          // alert(JSON.stringify(data))
           if (data.status) {

             socket.emit('end_live_session',{

                                     token:store.getState().token,
                                     user_id:store.getState().user.id,
                                     booking_id:GLOBAL.ids

                  })

          // alert('Your Live Consulation has been Ended')
           this.props.navigation.replace('Rating')

           } else {

           }
         })
         .catch((error) => {
           console.log('error', error);
         });
  }

  componentWillMount() {
    this.listener = EventRegister.addEventListener('pujaend', data => {
      this.props.navigation.goBack();
    });
    // const url = GLOBAL.BASE_URL + 'chat_read';

    // fetch(url, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     user_id: GLOBAL.user_id,
    //     chat_group_id: GLOBAL.bookingid,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((responseJson) => {
    //     if (responseJson.status == true) {
    //     } else {
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
  }
  renderBubble = (props,index) => {
         var a = false;
         if (props.currentMessage.status == true){
         a = true;
         }else{
             a = false;
         }
         //
         // if (props.currentMessage.user_id != GLOBAL.user_id ){
         //
         // }
         return (

                 <View style={{paddingRight: 12}}>




                     <Bubble {...props}

                     textProps={{
       style: {

         fontFamily:'Nunito-Regular',
         color:'#333333'

       },
     }}
                     wrapperStyle={{
                                             left: {
                                                 backgroundColor: 'white',
                                                 color:'#333333'
                                             },
                                             right: {
                                                 backgroundColor: '#90EE90',
                                                 color:'#333333'
                                             }
                                         }} />
                     {props.currentMessage.user_id != GLOBAL.user_id  &&  (
                         <View>

                         </View>
                     )}

                     {props.currentMessage.user_id == GLOBAL.user_id  &&  (
                         <View>


                         </View>
                     )}






                 </View>

         )
     }

  showActionSheet = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};

        const url =
          'http://139.59.67.166/astrohelp24/api/image_attchment_upload';
        const data = new FormData();

        // you can append anyone.
        data.append('image', {
          uri: response.uri,
          type: 'image/jpeg', // or photo.type
          name: 'image.png',
        });
        fetch(url, {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            //       this.hideLoading()

            //alert(responseJson.path)
            var x = randomString({
              length: 20,
              numeric: true,
              letters: true,
              special: false,
              exclude: ['a', 'b'],
            });

            var array = [];
            var users = {
              _id: GLOBAL.user_id,
              name: GLOBAL.myname,
            };
            var today = new Date();
            /* today.setDate(today.getDate() - 30);
                                 var timestamp = new Date(today).toISOString(); */
            var timestamp = today.toISOString();
            var dict = {
              text: 'Attachment',
              user: users,
              createdAt: timestamp,
              _id: x,
              image: responseJson.path,

              // etc.
            };
            array.push(dict);
            //Backend.load()

            console.log(responseJson.images);
            Backend.sendMessage(array);
          });

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
      }
    });
  };

  renderActions = () => {
    return (
      <TouchableOpacity onPress={() => this.showActionSheet()}>
        <Image
          style={{
            width: 22,
            height: 22,
            resizeMode: 'contain',
            marginLeft: 9,
            marginBottom: 12,
          }}
          source={require('../assets/attachement.png')}
        />
      </TouchableOpacity>
    );
  };
  login = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'Landing',
            params: {someParams: 'parameters goes here...'},
          }),
        ],
      }),
    );
  };

  renderChatFooter = () => {
    if (this.state.texts != '') {
      return (
        <Text style={{fontSize: 14, margin: 10}}> {this.state.texts}</Text>
      );
    }

    // if (this.state.isTyping) {
    //   if (this.typingTimeoutTimer == null) {
    //     this.startTimer();
    //   }
    //   return <TypingIndicator />;
    // }
    return null;
  };
  fieldView = (title, value) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingVertical: 5,
      }}>
      <View style={{flex: 0.5, paddingHorizontal: 5}}>
        <Text>{title}</Text>
      </View>
      <View style={{flex: 0.5, paddingHorizontal: 5}}>
        <Text>{value}</Text>
      </View>
    </View>
  );

  renderInputToolbar (props) {
          //Add the extra styles via containerStyle
          return <InputToolbar {...props}

                               textInputStyle={{ color: "black" }}
                               containerStyle={{backgroundColor:'white',marginLeft:10,borderRadius:20,borderWidth:0,color:'black',marginBottom:0,marginRight:10}} />
      }
  renderSend(props) {
       return (
           <Send
               {...props}
           >
               <View style={{backgroundColor:'transparent'}}>
                   <Image source={require('../assets/send.png')}
                   style = {{height:38,width:38,resizeMode:'contain',backgroundColor:'transparent',marginRight:2,marginBottom:2}}/>
               </View>
           </Send>
       );
   }
   renderTime = (props) => {
 return (
   <Time
   {...props}
     timeTextStyle={{
       left: {
         color: 'grey',
       },
       right: {
         color: 'grey',
       },
     }}
   />
 );
};
  render() {


    return (
      <ImageBackground source={require('../resources/chat-bg.png')}
      style = {{flex:1,backgroundColor:'#fcfcfe',width:window.width,marginBottom:8}}>

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
        <View style ={{flexDirection:'row',justifyContent:'space-between'}} >
        <View style = {{flexDirection:'row',width:window.width - 190}}>
        <Image style = {{width:30,height:30,borderRadius:15,marginRight:12}}
        source = {{uri:GLOBAL.data.astrologer.imageUrl}}/>
        <Text numberOfLines={1} style={{color:'black',fontFamily:"Nunito-Bold",fontSize:16,width:100,height:30}}>{GLOBAL.data.astrologer.name}</Text>
        </View>
        <TouchableOpacity onPress={()=>this.endcall()} >
                <View style = {{backgroundColor:'red',borderRadius:12,width:100,height:30}}>
                  <Text style={{fontSize:12,fontFamily:"Nunito-Bold",color:'white',marginTop:6,textAlign:'center'}}>END CHAT</Text>
                </View>
                          </TouchableOpacity>

</View>



      </View>

       <View style = {{width:'100%',backgroundColor:'#90EE90',height:40,flexDirection:'row'}}>
       <Text style = {{color:'#333333',fontFamily:'Nunito-Bold',fontSize:12,textAlign:'center',marginTop:8,textAlign:'center',alignSelf:'center',marginLeft:window.width/2 -90}}>
       Chat Time Left :
       </Text>
       <View style = {{marginLeft:10,marginTop:10}}>
             <CountDown
                    until={parseInt(GLOBAL.rtime)}
                    onFinish={() => console.log('hi')}
                    digitStyle={{backgroundColor: '#90EE90'}}
                digitTxtStyle={{color: '#333333'}}
                size = {11}
                timeToShow={['H','M', 'S']}
                timeLabels={{h:'hr',m: 'min', s: 'sec'}}
                  />
                  </View>



       </View>



             <GiftedChat
                     renderActions={this.renderActions}
                     extraData={this.state}
                    showUserAvatar = {false}
                     messages={this.state.messages}
             renderChatFooter={this.renderChatFooter}
             renderSend = {this.renderSend}
             renderInputToolbar={this.renderInputToolbar}
                     onSend={message => {


     Backend.sendMessage(message);



                     }}
                     renderBubble={this.renderBubble}
                     renderTime = {this.renderTime}
                     renderAvatar = {null}
                     onInputTextChanged = {text =>{
                         Backend.updateTyping(text)

                         // alert(text)

                     }

                     }
                     user={{
                         _id: GLOBAL.user_id,
                         name: ""
                     }}
                 />

             </ImageBackground>


    );
  }
  componentDidMount() {
  //  alert('hi')
    this.listener = EventRegister.addEventListener('pujaend', (data) => {

            this.props.navigation.replace('Rating')
              })

    //  GLOBAL.mystatus = "Online";



      // Backend.updateMessage(message => {
      //     alert(JSON.stringify(message))
      //
      //
      // })


      Backend.loadMessages(message => {
        //  alert(JSON.stringify(message))




        if (message.length == 0){


        }else {
          this.setState(previousState => {


              return {
                  messages: GiftedChat.append(previousState.messages, message)
              };
          });


        }





      });


     ;
     setTimeout(() => {

    if (this.state.messages.length == 0){

      Recently({user_id:store.getState().user.id})
           .then((data) => {


             if (data.status) {

               var data = data.data

               var  dd = `Hi\nBelow are my details:\nName:${data.name}\nDOB:${data.dob}\nTOB:${data.tob}\nPOB:${data.pob}\nGender:${data.gender}`

               var x = randomString({
                   length: 20,
                   numeric: true,
                   letters: true,
                   special: false,
                   exclude: ['a', 'b']
               });

               var array = [];
               var users = {
                   _id: store.getState().user.id,
                   name:'' ,
               }
               var today = new Date();
               /* today.setDate(today.getDate() - 30);
               var timestamp = new Date(today).toISOString(); */
               var timestamp = today.toISOString();
               var dict = {
                   text:dd,
                   user: users,
                   createdAt: timestamp,
                   _id: x,


                   // etc.
               };
               array.push(dict)
               //Backend.load()

               Backend.sendMessage(array)
             //this.props.navigation.replace('Rating')

             } else {

             }
           })
           .catch((error) => {
             console.log('error', error);
           });
    }
  }, 40);

      // Backend.updateMessage(message => {
      //     alert(JSON.stringify(message))
      //
      //
      // })




      Backend.loadMessagess(message => {
        // alert(JSON.stringify(message.typinganother))
          if (message.typinganother == true){
              var s = message.name +  ' is typing ...'
              this.setState({texts:s})
          }else{
              this.setState({texts:''})
          }

      });
  }




  componentWillUnmount() {
    Backend.closeChat();
  }
}
const styles = StyleSheet.create({
  wrapper: {},
  container: {
    flex: 1,
    backgroundColor: '#001739',
  },
  slide1: {
    marginLeft: 50,

    width: window.width - 50,
    height: 300,
    resizeMode: 'contain',
    marginTop: window.height / 2 - 200,
  },
  loading: {
    position: 'absolute',
    left: window.width / 2 - 30,

    top: window.height / 2,

    opacity: 0.5,

    justifyContent: 'center',
    alignItems: 'center',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});
