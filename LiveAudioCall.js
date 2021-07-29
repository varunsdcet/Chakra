import React, {Component, PureComponent} from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity,
    Dimensions, Modal, NativeModules, Image,Alert
} from 'react-native'
const window = Dimensions.get('window');
import {LoginOtpApi,SignInApi,Explore,FetchHomeWallet,PujaStart,GetProfileApi,EndLive} from '../backend/Api';
import {Surface, ActivityIndicator} from 'react-native-paper'
const GLOBAL = require('./Global');
import store from '../redux/store';
import io from 'socket.io-client';
const socket = io('http://139.59.25.187:3355', {
  transports: ['websocket']
})
import CountDown from 'react-native-countdown-component';
import { EventRegister } from 'react-native-event-listeners';
import {RtcEngine, AgoraView} from 'react-native-agora'
import {Stopwatch} from "react-native-stopwatch-timer";
import LottieView from 'lottie-react-native';
import {APPID} from './settingss'
const options = {
    container: {
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 12,
        color: '#fff',
    }
};
const {Agora} = NativeModules
console.log(Agora)

if (!Agora) {
    throw new Error("Agora load failed in react-native, please check ur compiler environments")
}

const {
    FPS30,
    AudioProfileDefault,
    AudioScenarioDefault,
    Host,
    Adaptative
} = Agora

const BtnEndCall = () => require('./btn_endcall.png')
const On = () => require('./btn_endcall.png')
const BtnMute = () => require('./btn_mute.png')
const BtnSwitchCamera = () => require('./btn_switch_camera.png')
const IconMuted = () => require('./icon_muted.png')

const {width} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4'
    },
    absView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex:1,
          backgroundColor:'#7BAAED',
        justifyContent: 'space-between',
    },
    absViews: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width:window.width,
        backgroundColor:'#FFD00D',
        height:80,
        justifyContent: 'space-between',
    },
    videoView: {
        padding: 5,
        flexWrap: 'wrap',
        flexDirection: 'row',
        zIndex: 100
    },
    localView: {
        flex: 1
    },
    remoteView: {
        width: (width - 40) / 3,
        height: (width - 40) / 3,
        margin: 5
    },
    bottomView: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})

class OperateButton extends PureComponent {
    render() {
        const {onPress, source, style, imgStyle = {width: 50, height: 50}} = this.props
        return (
            <TouchableOpacity
                style={style}
                onPress={onPress}
                activeOpacity={.7}
            >
                <Image
                    style={imgStyle}
                    source={source}
                />
            </TouchableOpacity>
        )
    }
}

type Props = {
    channelProfile: Number,
    channelName: String,
    clientRole: Number,
    onCancel: Function,
    uid: Number,
}

class LiveAudioCall extends Component<Props> {
    state = {
        peerIds: [],
        joinSucceed: false,
        isMute: false,
        hideButton: false,
        visible: false,
        peak:false,
        selectedUid: undefined,
        animating: true,
        connectionState: 'connecting',
        stopwatchStart: false,
        stopwatchReset: false,
    }
    toggleStopwatch = () => {
       this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
   };
   resetStopwatch() {
       this.setState({stopwatchStart: false, stopwatchReset: true});
   }
   getFormattedTime(time) {
       this.currentTime = time;
   }
    componentWillMount () {
      this.listener = EventRegister.addEventListener('pujaend', (data) => {
              this.props.navigation.goBack()
                })

        // const options = {
        //     appid: 'ef38b64215ed49d2acc3c6d8e20439f4',
        //     channelProfile: 1,
        //     videoProfile: 40,
        //     clientRole: 1,
        //     swapWidthAndHeight: true
        // };
        // RtcEngine.init(options);


        const config = {
            appid: APPID,
            channelProfile: this.props.channelProfile,
            clientRole: this.props.clientRole,
            videoEncoderConfig: {
                width: 360,
                height: 480,
                bitrate: 1,
                frameRate: FPS30,
                orientationMode: Adaptative,
            },
            swapWidthAndHeight:true,
            audioProfile: AudioProfileDefault,
            audioScenario: AudioScenarioDefault
        }
        console.log("[CONFIG]", JSON.stringify(config));
        console.log("[CONFIG.encoderConfig", config.videoEncoderConfig);
        RtcEngine.on('videoSizeChanged', (data) => {
            console.log("[RtcEngine] videoSizeChanged ", data)
        })
        RtcEngine.on('remoteVideoStateChanged', (data) => {
            console.log('[RtcEngine] `remoteVideoStateChanged`', data);
        })
        RtcEngine.on('userJoined', (data) => {
            console.log('[RtcEngine] onUserJoined', data);
            const {peerIds} = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
                  this.setState({stopwatchStart:true})
                this.setState({
                    peerIds: [...peerIds, data.uid]
                })
            }
        })
        RtcEngine.on('userOffline', (data) => {
            console.log('[RtcEngine] onUserOffline', data);
            this.setState({
                peerIds: this.state.peerIds.filter(uid => uid !== data.uid)
            })
            console.log('peerIds', this.state.peerIds, 'data.uid ', data.uid)
        })
        RtcEngine.on('joinChannelSuccess', (data) => {
            console.log('[RtcEngine] onJoinChannelSuccess', data);
            RtcEngine.startPreview().then(_ => {
                this.setState({
                    joinSucceed: true,
                    animating: false
                })
            })
        })
        RtcEngine.on('audioVolumeIndication', (data) => {
            console.log('[RtcEngine] onAudioVolumeIndication', data);
        })
        RtcEngine.on('clientRoleChanged', (data) => {
            console.log("[RtcEngine] onClientRoleChanged", data);
        })
        RtcEngine.on('videoSizeChanged', (data) => {
            console.log("[RtcEngine] videoSizeChanged", data);
        })
        RtcEngine.on('error', (data) => {
            console.log('[RtcEngine] onError', data);
            if (data.error === 17) {
                RtcEngine.leaveChannel().then(_ => {
                    this.setState({
                        joinSucceed: false
                    })
                    const { state, goBack } = this.props.navigation;
                    this.props.onCancel(data);
                    goBack();
                })
            }
        })
        RtcEngine.init(config);
    }
    getlog = ()=>{
      const url = GLOBAL.BASE_URL +  'online_counsult_timer'


                           fetch(url, {
                               method: 'POST',
                               headers: {
                                   'Content-Type': 'application/json',
                               },
                               body: JSON.stringify({
                                   booking_id : GLOBAL.mybookingid,

                               }),
                           }).then((response) => response.json())
                               .then((responseJson) => {
                               


                                   if (responseJson.status == true) {


                                     if (responseJson.start_or_end == 1){
                                          this.getlog() 
                                     }else{

        Alert.alert('CONSULTATION COMPLETED','Your Online Consultation session has been completed successfully. Please rate your call',
              [{text:"Ok"},

              ],
              {cancelable:false}
          )
        this.props.navigation.replace('Ratings')
                                     }



                                       // this.setState({name :responseJson.user_details.name})
                                       // this.setState({address: responseJson.user_details.address})
                                       // this.setState({area: responseJson.user_details.area})
                                       // this.setState({city: responseJson.user_details.city})
                                       // this.setState({description :responseJson.user_details.email})
                                       // this.setState({image :responseJson.user_details.image})
                                       // this.setState({username: responseJson.user_details.username})
                                       // if(responseJson.user_details.dob==''){
                                       //     this.setState({dob:'Select Date of Birth'})
                                       // }else{
                                       //     this.setState({dob: responseJson.user_details.dob})
                                       // }

                                   }else {
                                 
                                   }
                               })
                               .catch((error) => {
        this.getlog()
                                   console.error(error);
                               });

    }
    componentDidMount () {
        //this.getlog()

        RtcEngine.getSdkVersion((version) => {
            console.log('[RtcEngine] getSdkVersion', version);
        })

        console.log('[joinChannel] ' + this.props.channelName);
        RtcEngine.joinChannel(this.props.channelName, this.props.uid)
            .then(result => {
                /**
                 * ADD the code snippet after join channel success.
                 */
            });
        RtcEngine.enableAudioVolumeIndication(500, 3,true)
      //  RtcEngine.setDefaultAudioRouteToSpeakerphone(false)
RtcEngine.setEnableSpeakerphone(false)
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.navigation.isFocused();
    }


    componentWillUnmount () {
        if (this.state.joinSucceed) {
            RtcEngine.leaveChannel().then(res => {
                RtcEngine.destroy()
            }).catch(err => {
                RtcEngine.destroy()
                console.log("leave channel failed", err);
            })
        } else {
            RtcEngine.destroy()
        }
    }

    handleCancel = () => {



      EndLive({booking_id:GLOBAL.ids})
           .then((data) => {

           //  alert(JSON.stringify(data))
             if (data.status) {
               socket.emit('end_live_session',{

                                       token:store.getState().token,
                                       user_id:store.getState().user.id,
                                       booking_id:GLOBAL.ids
                    })
            //alert('Your Live Consulation has been Ended')
             const { goBack } = this.props.navigation;
             RtcEngine.leaveChannel().then(_ => {
                 this.setState({
                     joinSucceed: false
                 })



this.props.navigation.replace('Rating')

             }).catch(err => {
                 console.log("[agora]: err", err)
             })

             } else {

             }
           })
           .catch((error) => {
             console.log('error', error);
           });

    }

    switchCamera = () => {
      //  RtcEngine.switchCamera();
    }

    toggleAllRemoteAudioStreams = () => {
        this.setState({
            isMute: !this.state.isMute
        }, () => {
            RtcEngine.muteAllRemoteAudioStreams(this.state.isMute).then(_ => {
                /**
                 * ADD the code snippet after muteAllRemoteAudioStreams success.
                 */
            })
        })
    }

    toggleHideButtons = () => {
        this.setState({
            hideButton: !this.state.hideButton
        })
    }

    onPressVideo = (uid) => {
        this.setState({
            selectedUid: uid
        }, () => {
            this.setState({
                visible: true
            })
        })
    }

    toolBar = () => {

            return (
                <View>
                    <View style={styles.bottomView}>

                        <OperateButton
                            style={{alignSelf: 'center', marginBottom: -10}}
                            onPress={this.handleCancel}
                            imgStyle={{width: 60, height: 60}}
                            source={BtnEndCall()}
                        />

                    </View>
                </View>)

    }

    agoraPeerViews = ({visible, peerIds}) => {
        return (
            <View style={styles.videoView} />
          )
    }

    selectedView = ({visible}) => {
        return (
            <Modal
                visible={visible}
                presentationStyle={'fullScreen'}
                animationType={'slide'}
                onRequestClose={() => {}}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{flex: 1}}
                    onPress={() => this.setState({
                        visible: false
                    })} >

                </TouchableOpacity>
            </Modal>)
    }


    peakrty = () =>{
      RtcEngine.setEnableSpeakerphone(true)

      //  RtcEngine.setDefaultAudioRouteToSpeakerphone(true)

        this.setState({peak:!this.state.peak})
    }

    peakrt = () =>{
RtcEngine.setEnableSpeakerphone(false)
      //  RtcEngine.setDefaultAudioRouteToSpeakerphone(false)

        this.setState({peak:!this.state.peak})
    }

    render () {
        if (!this.state.joinSucceed) {
            return (
              <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>

              <Text style = {{color:'black',textAlign:'center',marginTop:30,fontSize:12}}>
              Connecting
              </Text>
              <LottieView source={require('./waiting.json')} autoPlay loop />


              </View>
            )
        }

        if (this.state.peerIds.length == 0){
         return (
             <View style={{flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>

             <Text style = {{color:'black',textAlign:'center',marginTop:30,fontSize:12}}>
             Connecting
             </Text>
             <LottieView source={require('./waiting.json')} autoPlay loop />


             </View>
           )
         }


        return (

<View style = {{flex:1,backgroundColor:'#FFD00D'}}>
<View style = {styles.absViews}>



<View style = {{flexDirection:'row',height:30,marginTop:100}}>


<View style = {{width:'100%',backgroundColor:'#90EE90',height:40,flexDirection:'row'}}>
<Text style = {{color:'black',fontFamily:'Nunito-Bold',fontSize:15,textAlign:'center',marginTop:8,marginLeft:'27%'}}>
  Call Time Left :
</Text>
<View style = {{marginLeft:10,marginTop:5}}>
      <CountDown
             until={parseInt(GLOBAL.rtime)}
             onFinish={() => console.log('hi')}
             digitStyle={{backgroundColor: '#90EE90'}}
         digitTxtStyle={{color: ''}}
         size = {11}
         timeToShow={['H','M', 'S']}
         timeLabels={{h:'hr',m: 'min', s: 'sec'}}
           />
           </View>

</View>
</View>


<Text style = {{color:'black',fontFamily:'Nunito-Bold',fontSize:15,textAlign:'center',marginTop:28}}>
 Voice Call
</Text>


<Text style = {{color:'black',fontFamily:'Nunito-Bold',fontSize:22,textAlign:'center',marginTop:28}}>
 {GLOBAL.priest_name}
</Text>


<Image   source={{uri:GLOBAL.pimage}}
style  = {{width:100, height:100,borderRadius:50,borderWidth:2,borderColor:'white',alignSelf:'center',marginTop:20
}}/>


<View style = {{flexDirection:'row',width:window.width,height:80,marginLeft:12,justifyContent:'space-between',marginTop:36}}>

<View style = {{flexDirection:'row'}}>




<View style = {{marginTop:1,height:30,marginLeft:-20}}>

<View style = {{flexDirection:'row',width:window.width - 25 ,justifyContent:'space-between'}}>





</View>


<View style = {{flexDirection:'row',marginLeft:25,marginTop:-20}}>







</View>
</View>
</View>
</View>
</View>
<View style= {{position:'absolute',bottom:100,flexDirection:'row',alignSelf:'center',margin:7}}>

<OperateButton
    style={{alignSelf: 'center', marginBottom: -10}}
    onPress={this.handleCancel}
    imgStyle={{width: 60, height: 60}}
    source={BtnEndCall()}
/>


{this.state.peak == false && (
  <OperateButton
      style={{alignSelf: 'center', marginBottom: -10,marginLeft:30}}
      onPress={this.peakrty}
      imgStyle={{width: 60, height: 60}}
      source={require('../assets/icons/offe.png')}
  />
)}
{this.state.peak == true && (
  <OperateButton
      style={{alignSelf: 'center', marginBottom: -10,marginLeft:30}}
      onPress={this.peakrt}
      imgStyle={{width: 60, height: 60}}
      source={require('../assets/icons/on.png')}
  />
)}
</View>



                </View>



        )
    }
}
export default function AgoraRTCViewContainer(props) {
const  navigation  = props.route.params
//alert(JSON.stringify(props.route.params))

  const channelProfile = navigation.channelProfile
  const clientRole = navigation.clientRole
  const channelName = navigation.channelName
  const uid = navigation.uid
  const onCancel = navigation.onCancel

  return (<LiveAudioCall
      channelProfile={channelProfile}
      channelName={channelName}
      clientRole={clientRole}
      uid={uid}
      onCancel={onCancel}
      {...props}
  ></LiveAudioCall>)
}
