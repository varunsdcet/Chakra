import React, {Component, PureComponent} from 'react'
import {
    StyleSheet, Text, View, TouchableOpacity,
    Dimensions, Modal, NativeModules, Image,Alert,
} from 'react-native'
import CountDown from 'react-native-countdown-component';
const window = Dimensions.get('window');
import { EventRegister } from 'react-native-event-listeners';
import LottieView from 'lottie-react-native';
import {Surface, ActivityIndicator} from 'react-native-paper'
const GLOBAL = require('./Global');
import store from '../redux/store';
import io from 'socket.io-client';
const socket = io('http://139.59.25.187:3355', {
  transports: ['websocket']
})
import NetInfo from "@react-native-community/netinfo";
import {RtcEngine, AgoraView} from 'react-native-agora'
import {LoginOtpApi,SignInApi,Explore,FetchHomeWallet,PujaStart,GetProfileApi,EndLive} from '../backend/Api';
import {APPID} from './settingss'
import {Stopwatch} from "react-native-stopwatch-timer";
const {Agora} = NativeModules
console.log(Agora)
const options = {
    container: {
        backgroundColor: 'transparent',
    },
    text: {
        fontSize: 12,
        color: '#fff',
    }
};
if (!Agora) {
    throw new Error("Agora load failed in react-native, please check ur compiler environments")
}

const {
    FPS30,
    AudioProfileDefault,
    AudioScenarioDefault,
    Host,
    Audience,
    Adaptative
} = Agora

const BtnEndCall = () => require('./btn_endcall.png')
const BtnMute = () => require('./btn_mute.png')
const VideoOff = () => require('./v-off.png')
const VideoOn = () => require('./v-on.png')
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
        top: 40,
        left: 0,
        right: 0,
        bottom: 0,
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
    duration: {
      position: 'absolute',
      top: 130,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
  },
  absView: {
      position: 'absolute',
      top: 70,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
  },
  absViews: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width:window.width,
      height:80,
      justifyContent: 'space-between',
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
        const {onPress, source, style, imgStyle = {width: 40, height: 40,resizeMode:'contain',marginTop:6}} = this.props
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

class LiveVideoCall extends Component<Props> {
    state = {
        peerIds: [],
        joinSucceed: false,
        isMute: false,
        hideButton: false,
        visible: false,
        selectedUid: undefined,
        animating: true,
        isMutes:false,
        connectionState: 'connecting',
        stopwatchStart: false,
        stopwatchReset: false,
        video:false,
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
        //  alert(JSON.stringify(data))
            console.log('[RtcEngine] onUserJoined', data);
            const {peerIds} = this.state;
            if (peerIds.indexOf(data.uid) === -1) {
              this.setState({stopwatchStart:true})
              this.setState({connectionState:'connected'})
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

    toggleStopwatch = () => {
       this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
   };
   resetStopwatch() {
       this.setState({stopwatchStart: false, stopwatchReset: true});
   }
   getFormattedTime(time) {
      // this.currentTime = time;
   }


   navigateToScreen1 = () => {


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
            this.props.navigation.replace('Rating')

            } else {

            }
          })
          .catch((error) => {
            console.log('error', error);
          });
               // alert

       // Alert.alert('Complete Booking!','Are you sure you want to Complete Booking?',
       //     [{text:"Cancel"},
       //         {text:"Yes", onPress:()=>this.handleCancel()
       //         },
       //     ],
       //     {cancelable:false}
       // )

   }


    componentDidMount () {
        if (GLOBAL.user_id != "0"){
      // this.getlog()
      }
      const unsubscribe = NetInfo.addEventListener(state => {

                if (state.isConnected == true){
                  console.log(state.isConnected)

                }
})
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



        const { goBack } = this.props.navigation;
        RtcEngine.leaveChannel().then(_ => {
            this.setState({
                joinSucceed: false
            })

        }).catch(err => {
            console.log("[agora]: err", err)
        })


      //   const url = 'http://139.59.76.223/shaktipeeth/api/force_booking_done_complete_online'
      // fetch(url, {
      // method: 'POST',
      // headers: {
      //  'HTTP_X_API_KEY': 'ShaktipeethAUTH@##@17$',
      //  'Content-Type': 'application/json',
      // },
      // body: JSON.stringify({
      //  booking_id: GLOBAL.booking_id,
      //  from:"priest"
      //
      // }),
      // }).then((response) => response.json())
      // .then((responseJson) => {
      //
      //
      // if (responseJson.status == true) {
      //   // this.props
      //   //     .navigation
      //   //     .dispatch(StackActions.reset({
      //   //         index: 0,
      //   //         actions: [
      //   //             NavigationActions.navigate({
      //   //                 routeName: 'TabNavigator',
      //   //                 params: { someParams: 'parameters goes here...' },
      //   //             }),
      //   //         ],
      //   //     }))
      // } else {
      // }
      // })
      // .catch((error) => {
      //
      // console.error(error);
      // });
    }

    switchCamera = () => {
        RtcEngine.switchCamera();
    }

    toggleAllRemoteAudioStreams = () => {
        this.setState({
            isMute: !this.state.isMute
        }, () => {
            Agora.enableLocalAudio(this.state.isMute).then(_ => {
                /**
                 * ADD the code snippet after muteAllRemoteAudioStreams success.
                 */
            })
        })
    }


videooff = () =>{

  if (this.state.video == false){
    RtcEngine.enableLocalVideo(false)

  }else{
    RtcEngine.enableLocalVideo(true)
        //  RtcEngine.startPreview()
  }
  this.setState({
      video: !this.state.video
  })

//   alert('hi')
// RtcEngine.setClientRole(Audience)
}
    toggleAllRemoteAudioStreamss = () => {
        this.setState({
            isMutes: !this.state.isMutes
        }, () => {
            RtcEngine.setEnableSpeakerphone(this.state.isMutes).then(_ => {
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
//setEnableSpeakerphone
    toolBar = ({hideButton, isMute}) => {
        if (!hideButton) {
            return (
                <View>
                    <View style={styles.bottomView}>



                        <OperateButton
                            onPress={this.toggleAllRemoteAudioStreams}
                            source={isMute ? IconMuted() : BtnMute()}
                        />

                        <OperateButton
                            onPress={this.switchCamera}
                            source={BtnSwitchCamera()}
                        />
                    </View>
                </View>)
        }
    }

    agoraPeerViews = ({visible, peerIds}) => {
        return (visible ?
            <View style={styles.videoView} /> :
            <View style={styles.videoView}>{
                peerIds.map((uid, key) => (
                    <TouchableOpacity
                        activeOpacity={1}

                        key={key}>
                        {/*               <Text>uid: {uid}</Text>*/}
                        <AgoraView
                            mode={1}
                            style={styles.remoteView}
                            zOrderMediaOverlay={true}
                            showLocalVideo={true}
                        />
                    </TouchableOpacity>
                ))
            }</View>)
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
                    <AgoraView
                        mode={1}
                        style={{flex: 1}}
                        zOrderMediaOverlay={true}
                        remoteUid={this.state.selectedUid}
                    />
                </TouchableOpacity>
            </Modal>)
    }

    render () {
    //  alert(this.state.peerIds)
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
            <Surface
                activeOpacity={1}
                onPress={this.toggleHideButtons}
                style={styles.container}
            >

              <AgoraView style={styles.localView} remoteUid={this.state.peerIds[0]}showLocalVideo={false} mode={1} />


                <View style = {styles.absViews}>


<View style = {{flexDirection:'row',width:window.width,height:80,marginLeft:12,justifyContent:'space-between',marginTop:36}}>

<View style = {{flexDirection:'row'}}>


<Image   source={{uri:GLOBAL.pimage}}
         style  = {{width:30, height:30,borderRadius:15,borderWidth:2,borderColor:'white'
       }}/>

         <View style = {{marginTop:1,height:30,marginLeft:-20}}>

         <View style = {{flexDirection:'row',width:window.width - 25 ,justifyContent:'space-between'}}>

         <Text style={{fontFamily:'Nunito-Bold',fontSize:16,marginTop:2,color:'white',marginLeft:20,textAlign:'center'}}>
           {GLOBAL.priest_name}

         </Text>



         </View>


<View style = {{flexDirection:'row',marginLeft:25,marginTop:-20}}>






<View style = {{flexDirection:'row',height:30}}>




</View>
</View>
</View>
</View>
</View>
</View>
<View style = {{alignSelf:'center',position:'absolute',top:80}}>
<View style = {{width:window.width,backgroundColor:'#90EE90',height:40,flexDirection:'row'}}>
<Text style = {{color:'black',fontFamily:'Nunito-Bold',fontSize:12,textAlign:'center',marginTop:8,textAlign:'center',alignSelf:'center',marginLeft:window.width/2 -110}}>
Video Call Time Left
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
     </View>


     <View style = {{position:'absolute',top:160,right:10}}>

{this.agoraPeerViews(this.state)}
     </View>

     <View style = {{position:'absolute',height:30,bottom:100,flexDirection:'row',alignSelf:'center'
   }}>




       <OperateButton
           style={{width:70,height:70,marginLeft:12}}
           onPress={this.switchCamera}
           source={require('./btn_switch_camera.png')}
       />


       <OperateButton
           style={{width:70,height:70,marginLeft:12}}
           onPress={this.navigateToScreen1}
           source={require('./btn_endcall.png')}
       />




       <OperateButton
           style={{width:70,height:70,marginLeft:12}}
           onPress={this.toggleAllRemoteAudioStreams}
           source={this.state.isMute ? BtnMute() : IconMuted()}
       />
       <OperateButton
           style={{width:70,height:70,marginLeft:12}}
           onPress={this.videooff}
           source={this.state.video ? VideoOn() : VideoOff()}
       />

     </View>
                {this.selectedView(this.state)}
            </Surface>
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

    return (<LiveVideoCall
        channelProfile={channelProfile}
        channelName={channelName}
        clientRole={clientRole}
        uid={uid}
        onCancel={onCancel}
        {...props}
    ></LiveVideoCall>)
}
