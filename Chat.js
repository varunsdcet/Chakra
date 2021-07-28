import React, {Component} from 'react';
import { StyleSheet, Text, View, Button,Image, Dimensions,Alert } from 'react-native';
import Backend from "./Backend.js";
import { GiftedChat, InputToolbar,Send } from 'react-native-gifted-chat'
const GLOBAL = require('./Global');
import {LoginOtpApi,SignUpApi,RegisterVerify,EditDetail,GetProfileApi} from '../backend/Api';
import store from '../redux/store';
const window = Dimensions.get('window');
import { EventRegister } from 'react-native-event-listeners';
type Props = {};
export default class Chat extends Component<Props> {
    state = {
        messages: [],
        name:'',
    };



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

    renderInputToolbar (props) {
        //Add the extra styles via containerStyle
        return <InputToolbar {...props}

                             textInputStyle={{ color: "black" }}
                             containerStyle={{backgroundColor:'white',marginLeft:10,borderRadius:20,borderWidth:0,color:'black',marginBottom:0,marginRight:10}} />
    }




    renderBubble(props) {

        return (
            <View style = {{backgroundColor:'rgba(0,0,0,0.6)',borderRadius:12,marginBottom:6,borderColor:'#979797',borderWidth:1,flexDirection:'row'}}>


                <Text style={{color:'#7BAAED',fontFamily:"Nunito-Bold",fontSize:22,margin:4,marginLeft:8,marginBottom:1}}>{props.currentMessage.user.name} :</Text>


                <Text style={{color:'white',fontFamily:"Nunito-Bold",fontSize:22,margin:4,marginTop:1}}>{props.currentMessage.text}</Text>

            </View>
        );
    }
    componentWillMount() {

    }


    renderMessages = (msg) => {
    //  alert(JSON.stringify(msg.user._id))

let message = msg.currentMessage
var ColorCode = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';

console.log("single message", message)
return (
  <View>

      <View style = {{backgroundColor:'rgba(0,0,0,0.00)',borderRadius:12,marginBottom:6,borderColor:'#979797',borderWidth:0,marginLeft:6,width:window.width - 126,flexDirection:'row'}}>


                <Text style={{color:'green',fontFamily:'Nunito-Regular',fontSize:12,margin:4,marginLeft:8,padding:1,lineHeight:18,marginBottom:1}}>{message.user.name}: </Text>

  <Text style={{color:'white',fontFamily:'Nunito-Regular',fontSize:12,margin:4,marginLeft:-2,padding:1,lineHeight:18,marginTop:4}}>{message.text} </Text>




      </View>

  </View>
)}

    render() {
        if (GLOBAL.user_id == "" ){
            return(
                <View style={{flex:1}}>
                    <Text style = {{color:'black',fontSize:22,alignSelf:'center',marginTop:window.height/2,textAlign:'center'}}>
                        Please Login First to Join Chat.
                    </Text>
                </View>
            )
        }

        return (
            <GiftedChat
                renderUsernameOnMessage = {true}
                messages={this.state.messages}
                renderInputToolbar={this.renderInputToolbar}
                renderBubble={this.renderBubble}
                renderSend = {this.renderSend}
                 renderMessage={(message) => this.renderMessages(message)}
                onInputTextChanged = {text =>{
                    Backend.updateTyping(text)

                    // alert(text)

                }

                }
                onSend={message => {

                  if (GLOBAL.user_id == "0" ){

                        Alert.alert(' UNREGISTERED USER','You seem to be an Unregistered User. To Use DISKUSS kindly create an account and Log In.',
                            [{text:"Cancel"},
                                {text:"Yes", onPress:()=>EventRegister.emit('myCustomEvent', 'it works!!!')
                                },
                            ],
                            {cancelable:false}
                          )
                  }else {
                    Backend.sendMessage(message);
                  }
                }}

                user={{
                    _id: GLOBAL.user_id,
                    name: this.state.name

                }}
            />
        );
    }


    componentDidMount() {


      GetProfileApi({user_id:store.getState().user.id})
           .then((data) => {
            // setLoading(false)
             console.log(JSON.stringify(data))
             if (data.status) {
      //setData(data.data)

    //alert(JSON.stringify(data.data))
      this.setState({name:data.data.name})


             } else {

             }
           })
           .catch((error) => {
             console.log('error', error);
           });
      Backend.loadMessages(message => {

          if (message.text != ""){
            this.setState(previousState => {
                return {
                    messages: GiftedChat.append(previousState.messages, message)
                };
            });
          }



        });
    }
    componentWillUnmount() {
        Backend.closeChat();
    }
}
